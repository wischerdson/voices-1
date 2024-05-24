import { defineStore } from 'pinia'

export const useSoundsStore = defineStore('sounds', () => {
	const buffer: { [key: string]: HTMLAudioElement } = {}

	const playSound = (key: string) => {
		if (key in buffer) {
			return buffer[key].play()
		}

		console.warn(`Sound "${key}" is not defined`);
	}

	const defineSound = (key: string, source: string) => {
		return buffer[key] = new Audio(source)
	}

	return { defineSound, playSound }
})
