import React from 'react'
import dynamic from 'next/dynamic'

const QrReader = dynamic(() => import('react-qr-reader'), {
	loading: () => <p>loading...</p>,
	ssr: false,
})

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
	const handleScan = async (data: string | null) => {}

	return (
		<div className='flex items-center justify-center'>
			<div className='h-screen w-full sm:w-3/5 relative bg-red-500'>
				<div className='w-full absolute z-10 top-[10%] left-2/4 transform translate-x-[-50%]'>
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
			</div>
		</div>
	)
}

export default Home
