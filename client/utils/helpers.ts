import type { Ref } from 'vue'
import { useRuntimeConfig, watch } from '#imports'

export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2)

export const apiBaseUrl = () => {
	const config = useRuntimeConfig()
	return process.server ? config.apiBaseUrl : config.public.apiBaseUrl
}

export const clickOutside = ($element: Ref<HTMLElement | undefined>, callback: () => void) => {
	const onClick = (event: MouseEvent) => {
		if (!$element.value?.contains(event.target as Node)) {
			callback()
		}
	}

	const removeListener = () => document.removeEventListener('click', onClick)

	const unwatch = watch($element, $el => {
		$el ? document.addEventListener('click', onClick) : removeListener()
	})

	return {
		destroy: () => {
			unwatch()
			removeListener()
		}
	}
}

export const randomString = (length: number) => {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''

	for (let i = length - 1; i >= 0; i--) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	return result;
}
