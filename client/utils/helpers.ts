import { useRuntimeConfig } from '#imports'

export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2)

export const apiBaseUrl = () => {
	const config = useRuntimeConfig()
	return process.server ? config.apiBaseUrl : config.public.apiBaseUrl
}

export const randomString = (length: number) => {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''

	for (let i = length - 1; i >= 0; i--) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	return result;
}
