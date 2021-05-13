import { RequestHandler } from 'express'

import * as authUtils from '../utils/auth-helpers'

export const getJWTToken: RequestHandler = (req, res) => {
	if (!req.user) {
		return res.boom.notFound('User does not exist')
	} else {
		const refreshTokenJWT = authUtils.generateRefreshTokenJWTToken(req.user.id)
		res.cookie('rtk', refreshTokenJWT.token, {
			httpOnly: true,
		})
		return res.redirect('/')
	}
}
