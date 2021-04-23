import React from 'react'

interface FormInputPropType {
	label: string
	placeholder: string
	type: string
	isRequired: boolean
}

const FormInput: React.FC<FormInputPropType> = ({ label, placeholder, type, isRequired }) => {
	return (
		<label className='w-full mb-4'>
			<span className='h-8 text-md text-gray-500'>{label}</span>
			<input
				className='w-full mt-1 h-12 border-gray-400 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700 text-gray-900 placeholder-gray-900 font-semibold rounded-lg shadow-sm'
				type={type}
				placeholder={placeholder}
				required={isRequired}
			/>
		</label>
	)
}

export default FormInput
