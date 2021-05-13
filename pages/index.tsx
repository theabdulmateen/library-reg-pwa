import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsResult } from 'next'
import { User } from '@prisma/client'
import fetch from 'isomorphic-fetch'
import { useToasts } from 'react-toast-notifications'

import { isAuth } from 'lib/auth'
import FormInput from 'components/FormInput'
import { getAccessToken, setAccessToken } from 'lib/accessToken'

const QrReader = dynamic(() => import('react-qr-reader'), {
	loading: () => (
		<div className='grid place-items-center text-2xl w-screen h-screen'>
			loading QR Scanner...
		</div>
	),
	ssr: false,
})

type HomeProps = {
	user: User
	accessToken: string
}

export default function Home({ user, accessToken }: HomeProps) {
	const [qrValue, setQrValue] = useState('')
	const [modalShown, setModalShown] = useState(false)
	const [srn, setSrn] = useState('')
	const router = useRouter()
	const { addToast } = useToasts()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setAccessToken(accessToken)
			Modal.setAppElement('body')
		}
	}, [])

	const checkIn = async (srn: string, libraryId: string) => {
		console.log('checking in')
		const response = await fetch('/check-in', {
			method: 'POST',
			body: JSON.stringify({
				libraryId,
				userIdentifier: srn,
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: 'Bearer ' + getAccessToken(),
			},
		})
		return await response.json()
	}

	const handleSubmit = async () => {
		console.log('submitting modal form')
		const data = (await checkIn(srn, qrValue)) as any
		if (data.success) {
			localStorage.setItem('lId', qrValue)
			addToast('Checked in successfully', { appearance: 'success', autoDismiss: true })
			router.replace('/checkout')
		} else {
			console.error('check-in failed')
			console.log('data: ', data)
			addToast('Check-In failed', { appearance: 'error', autoDismiss: true })
		}
		setModalShown(false)
	}

	const handleScan = async (data: string | null) => {
		if (data) {
			setQrValue(data)
			if (user.srn) {
				setSrn(user.srn)
			}
			setModalShown(true)
			addToast(`Scanned QR-code, value: '${data}'`, {
				appearance: 'success',
				autoDismiss: true,
			})
		} else {
			console.error('scan failed...')
		}
	}

	if (!user) {
		return (
			<div className='grid place-items-center'>
				<div>
					<div>You're not signed in.</div>
					<button className='btn-action bg-gray-200 hover:bg-gray-300'>Login</button>
				</div>
			</div>
		)
	}

	return (
		<div className='flex items-center justify-center relative'>
			<div className='h-screen w-full relative bg-gray-700'>
				<div className='w-full absolute z-10 top-[10%] left-2/4 transform translate-x-[-50%]'>
					<h1 className='text-gray-400 text-center w-full text-md mb-4'>
						Logged in as <span>{user.email}</span>
					</h1>
					<h1 className='text-2xl mx-5 uppercase text-center text-gray-300 font-semibold'>
						Scan the Libray QR code
					</h1>
				</div>
				<QrReader
					delay={500}
					className='qr-reader'
					onError={err => console.log('error ', err)}
					onScan={handleScan}
					facingMode='environment'
					showViewFinder={false}
				/>
				<div className='qr-overlay' />
				<div className='sticky-bottom'>
					<button onClick={() => setModalShown(true)} className='btn-action'>
						Check in manually
					</button>
				</div>
				{typeof window !== 'undefined' && (
					<Modal
						isOpen={modalShown}
						shouldFocusAfterRender={true}
						className='modal-cover'
						overlayClassName='modal-overlay'>
						<div className='modal-container'>
							<h1 className='modal-label'>Enter SRN and library ID</h1>
							<FormInput
								isRequired={true}
								label='SRN (eg. R18CS003)'
								placeholder='SRN (eg. R18CS003)'
								value={srn}
								setValue={setSrn}
								type='text'
							/>
							<FormInput
								isRequired={true}
								label='Library ID'
								placeholder='Library ID'
								value={qrValue}
								setValue={setQrValue}
								type='text'
							/>
							<div className='flex w-full'>
								<button
									onClick={() => setModalShown(false)}
									className='btn-action btn-checkin mr-2 bg-gray-400'>
									Cancel
								</button>
								<button
									onClick={handleSubmit}
									className='btn-action btn-checkin ml-2'>
									Check In
								</button>
							</div>
						</div>
					</Modal>
				)}
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
		if (authUser.user?.checkInId !== null) {
			return redirectToCheckOut
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

const redirectToLogin: GetServerSidePropsResult<HomeProps> = {
	redirect: {
		destination: '/login',
		statusCode: 302,
	},
}
const redirectToCheckOut: GetServerSidePropsResult<HomeProps> = {
	redirect: {
		destination: '/checkout',
		statusCode: 308,
	},
}
