const colors = require('tailwindcss/colors')

module.exports = {
	mode: 'jit',
	theme: {
		colors: {
			gray: colors.coolGray,
			blue: colors.lightBlue,
			red: colors.rose,
			black: colors.black,
			white: colors.white,
			yellow: colors.amber,
			green: colors.emerald,
			blue: colors.blue,
			indigo: colors.indigo,
			purple: colors.violet,
			pink: colors.pink,
		},
		minHeight: {
			0: '0',
			'1/4': '25%',
			'1/2': '50%',
			'3/4': '75%',
			full: '100%',
			screen: '100vh',
		},
		extend: {
			screens: {
				'3x': '1920x',
			},
		},
	},
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'media',
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
}
