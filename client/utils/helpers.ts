import { useRuntimeConfig } from '#imports'

export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2)

export const apiBaseUrl = () => {
	const config = useRuntimeConfig()
	return process.server ? config.apiBaseUrl : config.public.apiBaseUrl
}
