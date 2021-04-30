import { RequestHandler } from 'express'

import * as authUtils from '../utils/auth-helpers'

export const getJWTToken: RequestHandler = (req, res) => {
	if (!req.user) {
		return res.boom.notFound('User does not exist')
	} else {
		authUtils.refreshAllTokens(res, req.user.id)
		return res.redirect('/')
	}
}
