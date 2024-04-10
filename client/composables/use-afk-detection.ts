import { useState } from '#app'
import { singletonClientOnly } from '~/utils/singleton'

export const useAfkDetection = () => singletonClientOnly('afk-composable', () => {
	const isAfk = useState('afk', () => false)

	if (process.server) {
		return isAfk
	}

	let timeout: NodeJS.Timeout

	const fresh = () => {
		clearTimeout(timeout)
		isAfk.value = false
		timeout = setTimeout(() => isAfk.value = true, 1000*60*2)
	}

	window.document.addEventListener('keydown', fresh)
	window.document.addEventListener('focus', fresh)
	window.document.addEventListener('mousemove', fresh)
	window.document.addEventListener('click', fresh)
	window.document.addEventListener('scroll', fresh)

	return isAfk
})
