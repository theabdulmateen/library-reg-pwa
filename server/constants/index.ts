import * as fs from 'fs'
import * as path from 'path'

import { Constants } from '../types'

const constants: Constants = {
	PUB_KEY: fs.readFileSync(path.resolve(__dirname, '../../', 'id_rsa_pub_key.pem'), 'utf-8'),
	PRIV_KEY: fs.readFileSync(path.resolve(__dirname, '../../', 'id_rsa_priv_key.pem'), 'utf-8'),
	REFRESH_SECRET: process.env.REFRESH_SECRET!,
	FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID!,
	FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET!,
	FACEBOOK_CALLBACK_URL: 'http://localhost:3000/auth/facebook/callback',
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
	GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
}

export default constants
