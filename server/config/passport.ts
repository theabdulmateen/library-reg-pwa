import passport from 'passport'
import passportFacebook from 'passport-facebook'
import passportGoogle from 'passport-google-oauth20'
import PassportJwt, { StrategyOptions as JWTStrategyOptions } from 'passport-jwt'
import { PrismaClient } from '@prisma/client'

// import * as authValidator from '../utils/validators/auth'
import constants from '../constants'

const FacebookStrategy = passportFacebook.Strategy
const GoogleStrategy = passportGoogle.Strategy
const JwtStrategy = PassportJwt.Strategy
const ExtractJwt = PassportJwt.ExtractJwt

const prisma = new PrismaClient({
	rejectOnNotFound: {
		findUnique: true,
	},
})

const passportJWTOptions: JWTStrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: constants.PUB_KEY,
	algorithms: ['RS256'],
	jsonWebTokenOptions: {
		maxAge: '180d',
	},
}

passport.use(
	new JwtStrategy(passportJWTOptions, async (jwt_payload, done) => {
		// console.log(jwt_payload)
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: jwt_payload.sub,
				},
			})
			if (!user) {
				console.error('user not found')
				return done(null, false)
			}
			return done(null, user)
		} catch (err) {
			console.error(err)
			return done(err)
		}
	})
)

passport.use(
	new FacebookStrategy(
		{
			clientID: constants.FACEBOOK_CLIENT_ID,
			clientSecret: constants.FACEBOOK_CLIENT_SECRET,
			callbackURL: constants.FACEBOOK_CALLBACK_URL,
			profileFields: ['id', 'displayName', 'email'],
			enableProof: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				if (profile._json.email) {
					const user = await prisma.user.upsert({
						where: {
							email: profile._json.email,
						},
						update: {
							facebookId: profile.id,
							fistName: profile.name?.givenName,
							lastName: profile.name?.familyName,
						},
						create: {
							email: profile._json.email,
							facebookId: profile.id,
							fistName: profile.name?.givenName,
							lastName: profile.name?.familyName,
						},
					})
					return done(null, user)
				} else {
					console.error('Email not found')
					return done(new Error('Email not found'))
				}
			} catch (err) {
				console.error(err)
				return done(err)
			}
		}
	)
)

passport.use(
	new GoogleStrategy(
		{
			clientID: constants.GOOGLE_CLIENT_ID,
			clientSecret: constants.GOOGLE_CLIENT_SECRET,
			callbackURL: constants.GOOGLE_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				if (profile._json.email) {
					const user = await prisma.user.upsert({
						where: {
							email: profile._json.email,
						},
						update: {
							googleId: profile.id,
							fistName: profile.name?.givenName,
							lastName: profile.name?.familyName,
						},
						create: {
							email: profile._json.email,
							googleId: profile.id,
							fistName: profile.name?.givenName,
							lastName: profile.name?.familyName,
						},
					})
					return done(null, user)
				} else {
					console.error('Email not found')
					return done(new Error('Email not found'))
				}
			} catch (err) {
				console.error(err)
				return done(err)
			}
		}
	)
)

export default passport
