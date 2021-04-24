import { User as PrismaUser } from '.prisma/client'

export type Constants = {
	PUB_KEY: string
	PRIV_KEY: string
	FACEBOOK_CLIENT_ID: string
	FACEBOOK_CLIENT_SECRET: string
	FACEBOOK_CALLBACK_URL: string
	GOOGLE_CLIENT_ID: string
	GOOGLE_CLIENT_SECRET: string
	GOOGLE_CALLBACK_URL: string
}

declare module 'passport' {
	interface Profile {
		email: string
	}
}

declare global {
	namespace Express {
		interface User extends PrismaUser {}
	}
}
