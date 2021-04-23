import React from 'react'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

interface IconButtonProps {
	text: string
	icon: FontAwesomeIconProps['icon']
}

export const IconButton: React.FC<IconButtonProps> = ({ text, icon }) => {
	return (
		<button className='btn-action bg-gray-200 hover:bg-gray-300'>
			<span className='w-full text-gray-700 mx-4 self-center justify-center'>
				<FontAwesomeIcon icon={icon} />
			</span>
			<span>{text}</span>
		</button>
	)
}
