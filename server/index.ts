import express, { Request, Response } from 'express'
import next from 'next'
import boom from 'express-boom'
import cors from 'cors'
import errorHandler from 'errorhandler'
import { loadEnvConfig } from '@next/env'
import cookieParser from 'cookie-parser'

loadEnvConfig('./', process.env.NODE_ENV !== 'production')

// passport config and strategies
import passport from './config/passport'

// RSA-key pair helper
import genKeyPair from './utils/generateKeyPair'

// Controllers (route handlers)
import * as authController from './controllers/auth'
import * as regController from './controllers/reg'

// Middlewares
import * as authMiddleware from './middlewares/auth'

const port = process.env['PORT'] || 3000
const dev = process.env.NODE_ENV !== 'production'
const server = next({ dev })
const handle = server.getRequestHandler()

server.prepare().then(async () => {
	const app = express()

	/**
	 * Error Handler
	 */
	if (dev) {
		console.log('Performing development specifics...')
		app.use(errorHandler())
		genKeyPair()
	}

	// Express Configuration
	app.set('port', process.env.PORT || 3000)
	app.use(cors({ credentials: true, origin: true }))
	app.use(cookieParser())
	app.use(passport.initialize())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(boom())
	app.disable('x-powered-by')

	/**
	 * Primary app routes.
	 */
	app.post('/login', authController.login)
	app.post('/register', authController.register)
	app.get(
		'/protected',
		passport.authenticate('jwt', { session: false }),
		(req: Request, res: Response) => {
			return res.json({ success: true, message: 'You are successfully authenticated' })
		}
	)
	app.post('/refresh_token', authController.refreshToken)
	app.get(
		'/auth/google',
		passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
	)
	app.get(
		'/auth/google/callback',
		passport.authenticate('google', { session: false, failureRedirect: '/login' }),
		authMiddleware.getJWTToken
	)

	app.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: 'email' }))
	app.get(
		'/auth/facebook/callback',
		passport.authenticate('facebook', {
			session: false,
			scope: 'email',
			failureRedirect: '/login',
		}),
		authMiddleware.getJWTToken
	)

	app.post('/check-in', passport.authenticate('jwt', { session: false }), regController.checkIn)
	app.post('/check-out', passport.authenticate('jwt', { session: false }), regController.checkOut)
	app.post(
		'/export-all-records',
		passport.authenticate('jwt', { session: false }),
		regController.exportAllRecords
	)
	app.post(
		'/export-records',
		passport.authenticate('jwt', { session: false }),
		regController.exportRecordsInRange
	)

	app.all('*', (req: Request, res: Response) => {
		return handle(req, res)
	})

	app.listen(port, () => {
		console.log('  App is running at http://localhost:%d in %s mode', port, app.get('env'))
		console.log('  Press CTRL-C to stop\n')
	})
})
