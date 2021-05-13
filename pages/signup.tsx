import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useToasts } from 'react-toast-notifications'

import FormInput from 'components/FormInput'
import { IconButton } from 'components/IconButton'
import { isAuth, signup } from 'lib/auth'

const Signup = ({}) => {
	const [srn, setSrn] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()
	const { addToast } = useToasts()
	return (
		<div className='min-h-screen bg-gray-200 grid place-items-center p-4'>
			<div className='w-full lg:w-2/5 md:w-4/6 p-4 md:p-6 rounded-lg bg-gray-100 flex flex-col items-center justify-self-center'>
				<h1 className='text-2xl font-bold mb-2'>Register</h1>
				<p className='text-sm mb-4'>
					Already have an account?
					<span className='ml-2 text-red-600 font-bold'>
						<Link href='/login'>log in</Link>
					</span>
				</p>

				<form
					onSubmit={async event => {
						event.preventDefault()
						const res = await signup({ email, srn, password })
						if (res.success) {
							router.replace('/')
						} else {
							addToast(res.message, {
								appearance: 'error',
								autoDismiss: true,
							})
							// alert('Signup failed..')
						}
					}}>
					<FormInput
						label='SRN (eg. R18CS003)'
						placeholder='SRN (eg. R18CS003)'
						type='text'
						isRequired={true}
						value={srn}
						setValue={setSrn}
					/>
					<FormInput
						label='Email address'
						placeholder='Email address'
						type='text'
						isRequired={true}
						value={email}
						setValue={setEmail}
					/>
					<FormInput
						label='Password'
						placeholder='Password (8+ characters)'
						type='password'
						isRequired={true}
						value={password}
						setValue={setPassword}
					/>

					<button className='btn-action text-white bg-blue-600 hover:bg-blue-700'>
						Create an account
					</button>
				</form>

				<div className='w-full flex my-4'>
					<div className='w-4/5 h-0 self-center mx-5 border-t-2 border-gray-300' />
					<span className='text-gray-300'>or</span>
					<div className='w-4/5 h-0 self-center mx-5 border-t-2 border-gray-300' />
				</div>

				<IconButton text='Log in with Facebook' url={'/auth/facebook'} icon={faFacebook} />
				<IconButton text='Log in with Google' url={'/auth/google'} icon={faGoogle} />
				<IconButton text='Log in with Github' url={'/auth/github'} icon={faGithub} />
			</div>
		</div>
	)
}
export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const authUser = await isAuth(ctx)
		if (authUser.authenticated) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}
		return {
			props: {},
		}
	} catch (err) {
		console.error(err)
		return {
			props: {},
		}
	}
}
export default Signup
