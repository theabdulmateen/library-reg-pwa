import { PrismaClient } from '@prisma/client'
import { RequestHandler } from 'express'
import { check, validationResult } from 'express-validator'

const prisma = new PrismaClient()

export const checkIn: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			console.error('User unauthorized')
			return res.boom.unauthorized('unauthorized')
		}

		await check('libraryId', 'Invalid library Id').exists().run(req)
		await check('userIdentifier', 'invalid user identifier').exists().run(req)
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const user = await prisma.user.findUnique({ where: { id: req.user.id } })
		if (!user) {
			console.error('User unauthorized')
			return res.boom.unauthorized('unauthorized')
		}

		const library = await prisma.library.findUnique({
			where: { id: Number(req.body.libraryId) },
		})
		if (!library) {
			console.error('Library is not registered')
			return res.boom.unauthorized('Library is not registered')
		}

		if (user.checkInId !== null) {
			return res.boom.badRequest('User is already checked in')
		}

		const record = await prisma.record.create({
			data: {
				userIdentifier: req.body.userIdentifier,
				checkOutTime: new Date(Date.now() + 30 * 1000 * 60),
				user: { connect: { id: user.id } },
				library: { connect: { id: library.id } },
			},
		})
		await prisma.user.update({
			where: { id: user.id },
			data: { checkInId: record.id },
		})
		return res.json({ success: true })
	} catch (err) {
		console.error(err.message)
		return res.boom.boomify(err)
	}
}

export const checkOut: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			console.error('User unauthorized')
			return res.boom.unauthorized('unauthorized')
		}

		const user = await prisma.user.findUnique({ where: { id: req.user.id } })
		if (!user) {
			console.error('User unauthorized')
			return res.boom.unauthorized('unauthorized')
		}

		if (user.checkInId === null) {
			return res.boom.badRequest('User is not checked in')
		}

		const record = await prisma.record.findUnique({
			where: {
				id: user.checkInId,
			},
		})
		if (!record) {
			console.error('Record does not exist')
			return res.boom.badRequest('Record does not exist')
		}
		if (record.userId !== user.id) {
			console.error('Wrong identifiers were passed')
			res.boom.badRequest('Wrong identifiers were passed')
		}

		await prisma.record.update({
			where: {
				id: record.id,
			},
			data: {
				checkOutTime: new Date(Date.now() + 30 * 1000 * 60),
			},
		})
		await prisma.user.update({
			where: { id: user.id },
			data: { checkInId: null },
		})
		return res.json({ success: true, record })
	} catch (err) {
		console.error(err.message)
		return res.boom.boomify(err)
	}
}
