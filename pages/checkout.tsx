import React, { useEffect, useState } from 'react'
import { GetServerSideProps, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-fetch'
import { useToasts } from 'react-toast-notifications'

import { isAuth } from 'lib/auth'
import { setAccessToken } from 'lib/accessToken'
import { User } from '@prisma/client'

interface CheckOutProps {
	user: User
	accessToken: string
}

const checkout = ({ user, accessToken }: CheckOutProps) => {
	const [libraryId, setLibraryId] = useState('')
	const router = useRouter()
	const { addToast } = useToasts()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			console.log(localStorage.getItem('lId'))
			setAccessToken(accessToken)
			setLibraryId(localStorage.getItem('lId') || '')
		}
	}, [])

	const handleCheckOut = async () => {
		const response = await fetch('/check-out', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				authorization: 'Bearer ' + accessToken,
			},
		})
		const data = await response.json()
		console.log('check out data: ', data)
		if (data.success) {
			addToast('Checked out successfully.', {
				appearance: 'success',
				autoDismiss: true,
			})
			router.replace('/')
		} else {
			console.error('something went round. whoops')
			addToast('Something went wrong. Please try again later.', {
				appearance: 'error',
				autoDismiss: true,
			})
		}
	}

	return (
		<div className='h-screen w-full grid place-items-center bg-gray-700'>
			<div className='text-gray-400'>
				<h1 className='text-3xl'>Check out from library `{libraryId}`</h1>
				<button
					onClick={handleCheckOut}
					className='btn-action text-gray-200 text-lg border-gray-300'>
					Check out
				</button>
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const authUser = await isAuth(ctx)
		if (!authUser.authenticated) {
			return redirectToLogin
		}
		if (authUser.user?.checkInId === null) {
			return redirectToCheckIn
		}
		return {
			props: {
				user: authUser.user,
				accessToken: authUser.accessToken,
			},
		}
	} catch (err) {
		console.error(err)
		return redirectToLogin
	}
}

const redirectToLogin: GetServerSidePropsResult<CheckOutProps> = {
	redirect: {
		destination: '/login',
		statusCode: 302,
	},
}
const redirectToCheckIn: GetServerSidePropsResult<CheckOutProps> = {
	redirect: {
		destination: '/',
		statusCode: 308,
	},
}

export default checkout
