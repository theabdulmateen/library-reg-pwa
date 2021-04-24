import { RequestHandler } from 'express'

import * as authUtils from '../utils/auth-helpers'

export const getJWTToken: RequestHandler = (req, res, next) => {
	if (!req.user) {
		return res.boom.notFound('User does not exist')
	} else {
		const tokenJWT = authUtils.generateJWTToken(req.user)
		return res.json({ success: true, token: tokenJWT.token, expiresIn: tokenJWT.expiresIn })
	}
}
