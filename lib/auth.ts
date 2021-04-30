import { GetServerSidePropsContext } from 'next'
import fetch from 'isomorphic-fetch'
import * as jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'
import { setAccessToken } from './accessToken'
import refreshToken from 'lib/refreshToken'

interface LoginProps {
	emailOrSRN: string
	password: string
}

export const login = async ({ emailOrSRN, password }: LoginProps) => {
	const response = await fetch('/login', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ emailOrSRN, password }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const data = await response.json()
	console.log('login data: ', data)
	setAccessToken(data.accessToken)
	return data
}

interface SignupProps {
	email: string
	srn: string
	password: string
}

export const signup = async ({ email, srn, password }: SignupProps) => {
	const response = await fetch('/register', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ email, srn, password }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const data = await response.json()
	console.log('signup data: ', data)
	setAccessToken(data.accessToken)
	return data
}

interface Payload {
	sub: number
	iat: number
	exp: number
}

export const isAuth = async (ctx: GetServerSidePropsContext) => {
	const { rtk } = ctx.req.cookies

	const prisma = new PrismaClient({
		rejectOnNotFound: {
			findUnique: true,
		},
	})

	if (!rtk) {
		return {
			authenticated: false,
		}
	}

	try {
		const payload = jwt.decode(rtk)

		const { accessToken } = await refreshToken(rtk)

		if (!accessToken) {
			return {
				authenticated: false,
			}
		}

		const user = await prisma.user.findUnique({
			where: { id: (payload as Payload).sub },
			select: {
				email: true,
				srn: true,
				fistName: true,
				lastName: true,
				checkInId: true,
			},
		})

		if (!user) {
			return {
				authenticated: false,
			}
		}

		return {
			authenticated: true,
			user,
			accessToken,
		}
	} catch (err) {
		console.error(err)
		return {
			authenticated: false,
		}
	}
}
