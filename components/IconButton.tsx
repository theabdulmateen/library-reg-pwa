import React from 'react'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

interface IconButtonProps {
	text: string
	icon: FontAwesomeIconProps['icon']
	url: string
}

export const IconButton: React.FC<IconButtonProps> = ({ text, icon, url }) => {
	return (
		<a href={url} className='w-full'>
			<button className='btn-action bg-gray-200 hover:bg-gray-300'>
				<span className='w-full text-gray-700 mx-4 self-center justify-center'>
					<FontAwesomeIcon icon={icon} />
				</span>
				<span>{text}</span>
			</button>
		</a>
	)
}
