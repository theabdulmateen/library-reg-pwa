import { Response } from 'express'
import * as jwt from 'jsonwebtoken'

import constants from '../constants'

export const generateAccessTokenJWTToken = (userId: Number) => {
	const expiresIn = '15m'
	const payload = {
		sub: userId,
		iat: Date.now(),
	}
	const token = jwt.sign(payload, constants.PRIV_KEY, {
		expiresIn: expiresIn,
		algorithm: 'RS256',
	})

	return {
		token,
		expiresIn,
	}
}

export const generateRefreshTokenJWTToken = (userId: Number) => {
	const expiresIn = '7d'
	const payload = {
		sub: userId,
		iat: Date.now(),
	}
	const token = jwt.sign(payload, constants.REFRESH_SECRET, {
		expiresIn: expiresIn,
	})

	return {
		token,
		expiresIn,
	}
}

export const getPayloadFromToken = (token: string, secret: string) => {
	return jwt.verify(token, secret)
}

export const refreshAllTokens = (res: Response, userId: Number) => {
	const refreshTokenJWT = generateRefreshTokenJWTToken(userId)
	res.cookie('rtk', refreshTokenJWT.token, {
		httpOnly: true,
	})

	const accessTokenJWT = generateAccessTokenJWTToken(userId)
	return res.json({
		success: true,
		accessToken: accessTokenJWT.token,
		accessTokenExpiresIn: accessTokenJWT.expiresIn,
	})
}
