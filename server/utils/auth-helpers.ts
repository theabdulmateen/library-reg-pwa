import { User } from '@prisma/client'
import * as jwt from 'jsonwebtoken'

import constants from '../constants'

export const generateJWTToken = (user: User) => {
	const id = user.id
	const expiresIn = '180d'
	const payload = {
		sub: id,
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
