import { RequestHandler } from 'express'
import { check, validationResult } from 'express-validator'
import { PrismaClient, User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon2 from 'argon2'

import * as authValidator from '../utils/validators/auth'
import * as authUtils from '../utils/auth-helpers'
import constants from '../constants'

const prisma = new PrismaClient()

export const login: RequestHandler = async (req, res) => {
	try {
		await check('password')
			.isLength({ min: 5 })
			.withMessage('must be at least 5 chars long')
			// .matches(/\d/)
			// .withMessage('must contain a number')
			.run(req)

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			console.log('errors: ', errors.array())
			return res.boom.badData('Error in validating input data', errors.array())
		}

		let user: User | null = null

		if (check(req.body.emailOrSRN).isEmail()) {
			await check('emailOrSRN').normalizeEmail({ gmail_remove_dots: false }).run(req)

			user = await prisma.user.findUnique({
				where: authValidator.findUserFromEmail(req.body.emailOrSRN),
			})
		} else if (check(req.body.emailOrSRN).length === 8) {
			user = await prisma.user.findUnique({
				where: authValidator.findUserFromSRN(req.body.emailOrSRN),
			})
		}

		if (!user) {
			console.error('user not found')
			return res.boom.notFound('Cannot find user with the provided credentials')
		}

		if (!user.hashedPassword) {
			return res.boom.internal('Bad auth')
		}
		const isValidPassword = await argon2.verify(user.hashedPassword, req.body.password)
		if (!isValidPassword) {
			return res.boom.badData('Incorrect password')
		}

		return authUtils.refreshAllTokens(res, user.id)
	} catch (err) {
		console.error(err)
		return res.boom.boomify(err)
	}
}

export const register: RequestHandler = async (req, res) => {
	try {
		await check('email', 'Email is not valid')
			.isEmail()
			.normalizeEmail({ gmail_remove_dots: false })
			.run(req)
		await check('srn', 'SRN is not valid').isLength({ min: 8, max: 8 }).run(req)
		await check('password')
			.isLength({ min: 5 })
			.withMessage('must be at least 5 chars long')
			.matches(/\d/)
			.withMessage('must contain a number')
			.run(req)

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			console.log('errors: ', errors.array())
			return res.boom.badData('Error in validating input data', errors.array())
		}

		const hashedPassword = await argon2.hash(req.body.password)
		const user = await prisma.user.create({
			data: authValidator.createUser(req.body.email, req.body.srn, hashedPassword),
		})

		return authUtils.refreshAllTokens(res, user.id)
	} catch (err) {
		console.error(err)
		if (err instanceof PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				console.log('User already exists with the provided credentials')
				return res.boom.conflict('User already exists with the provided credentials')
			}
		}
		return res.boom.boomify(err)
	}
}

export const refreshToken: RequestHandler = async (req, res) => {
	const rtk = req.cookies.rtk

	if (!rtk) {
		console.log('no rtk')
		return res.send({ success: false, accessToken: '' })
	}

	try {
		const payload = authUtils.getPayloadFromToken(rtk, constants.REFRESH_SECRET)
		const { sub } = payload as any

		const user = await prisma.user.findUnique({
			where: { id: sub },
		})

		if (!user) {
			console.log('no user')
			return res.send({ success: false, accessToken: '' })
		}

		return authUtils.refreshAllTokens(res, user.id)
	} catch (err) {
		console.error(err)
		console.log('error refreshing token')
		return res.send({ success: false, accessToken: '' })
	}
}
