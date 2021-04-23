const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
	future: {
		webpack5: true,
	},
	pwa: {
		dest: 'public',
		runtimeCaching,
		disable: process.env.NODE_ENV !== 'production',
	},
})
