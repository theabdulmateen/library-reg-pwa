import * as fs from 'fs'
import * as path from 'path'

import { Constants } from '../types'

const constants: Constants = {
	PUB_KEY: fs.readFileSync(path.resolve(__dirname, '../../', 'id_rsa_pub_key.pem'), 'utf-8'),
	PRIV_KEY: fs.readFileSync(path.resolve(__dirname, '../../', 'id_rsa_priv_key.pem'), 'utf-8'),
	FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || 'client-id',
	FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || 'secret',
	FACEBOOK_CALLBACK_URL: 'http://localhost:3000/auth/facebook/callback',
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'client-id',
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'secret',
	GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
}

export default constants
