import fetch from 'isomorphic-fetch'

export default async function refreshToken(rtk: string) {
	const response = await fetch('http://localhost:3000/refresh_token', {
		headers: {
			cookie: 'rtk=' + rtk,
		},
		credentials: 'include',
		method: 'POST',
	})
	return await response.json()
}
