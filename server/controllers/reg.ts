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
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const user = await prisma.user.findUnique({ where: { id: req.user.id } })
		if (!user) {
			console.error('User unauthorized')
			return res.boom.unauthorized('unauthorized')
		}

		const library = await prisma.library.findUnique({ where: { id: req.body.libraryId } })
		if (!library) {
			console.error('Library is not registered')
			return res.boom.unauthorized('Library is not registered')
		}

		if (user.isCheckedIn) {
			return res.boom.badRequest('User is already checked in')
		}

		const record = prisma.record.create({
			data: {
				checkOutTime: new Date(Date.now() + 30 * 1000 * 60),
				user: { connect: { id: user.id } },
				library: { connect: { id: library.id } },
			},
		})
		await prisma.user.update({
			where: { id: user.id },
			data: { isCheckedIn: true },
		})
		return res.json({ success: true, record })
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

		await check('libraryId', 'Invalid library Id').exists().run(req)
		await check('recordId', 'Invalid record Id').exists().run(req)
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const user = await prisma.user.findUnique({ where: { id: req.user.id } })
		if (!user) {
			console.error('User unauthorized')
			return res.boom.unauthorized('unauthorized')
		}

		const library = await prisma.library.findUnique({ where: { id: req.body.libraryId } })
		if (!library) {
			console.error('Library is not registered')
			return res.boom.unauthorized('Library is not registered')
		}

		if (!user.isCheckedIn) {
			return res.boom.badRequest('User is not checked in')
		}

		const record = await prisma.record.findUnique({
			where: {
				id: req.body.recordId,
			},
		})
		if (!record) {
			console.error('Record does not exist')
			return res.boom.badRequest('Record does not exist')
		}
		if (record.userId !== user.id || record.libraryId !== library.id) {
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
			data: { isCheckedIn: false },
		})
		return res.json({ success: true, record })
	} catch (err) {
		console.error(err.message)
		return res.boom.boomify(err)
	}
}
