import React from 'react'
import Link from 'next/link'

import FormInput from 'components/FormInput'
import { IconButton } from 'components/IconButton'
import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'

const Signup: React.FC<{}> = () => {
	return (
		<div className='min-h-screen bg-gray-200 grid place-items-center p-4'>
			<div className='w-full lg:w-2/5 md:w-4/6 p-4 md:p-6 rounded-lg bg-gray-100 flex flex-col items-center justify-self-center'>
				<h1 className='text-2xl font-bold mb-2'>Sign in</h1>
				<p className='text-sm mb-4'>
					Already have an account?
					<span className='ml-2 text-red-600 font-bold'>
						<Link href='/login'>log in</Link>
					</span>
				</p>

				<FormInput
					label='SRN (eg. R18CS003)'
					placeholder='SRN (eg. R18CS003)'
					type='text'
					isRequired={true}
				/>
				<FormInput
					label='Email address'
					placeholder='Email address'
					type='text'
					isRequired={true}
				/>
				<FormInput
					label='Password'
					placeholder='Password (8+ characters)'
					type='password'
					isRequired={true}
				/>

				<button className='btn-action text-white bg-blue-600 hover:bg-blue-700'>
					Create an account
				</button>

				<div className='w-full flex my-4'>
					<div className='w-4/5 h-0 self-center mx-5 border-t-2 border-gray-300' />
					<span className='text-gray-300'>or</span>
					<div className='w-4/5 h-0 self-center mx-5 border-t-2 border-gray-300' />
				</div>

				<IconButton text='Log in with Facebook' icon={faFacebook} />
				<IconButton text='Log in with Google' icon={faGoogle} />
				<IconButton text='Log in with Github' icon={faGithub} />
			</div>
		</div>
	)
}

export default Signup
