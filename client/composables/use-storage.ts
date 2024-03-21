import { useState } from '#app'
import { snakeCase } from 'lodash-es'
import { watch } from 'vue'
import { singletonClientOnly } from '~/utils/singleton'

interface Storage<T> {
	read(): T
	write(data: T): void
}

const localStorageDriver = <T>(key: string, init: () => T): Storage<T> => {
	if (process.server) {
		throw new Error('There is impossible to use localStorage driver on the server side')
	}

	return {
		read() {
			let dataFromStorage = window.localStorage.getItem(key)

			if (dataFromStorage) {
				return JSON.parse(dataFromStorage)
			}

			return init()
		},
		write(data: T) {
			window.localStorage.setItem(key, JSON.stringify(data))
		}
	}
}

const dummyStorageDriver = <T>(key: string, init: () => T): Storage<T> => {
	return {
		read: init,
		write: () => void 0
	}
}

const useStorage = <T>(stateKey: string, { read, write }: Storage<T>) => {
	const state = useState<T>(stateKey, read)

	watch(state, write)

	return state
}

export const useLocalStorage = <T>(key: string, init: () => T) => {
	const stateKey = 'local_storage_' + snakeCase(key)

	return singletonClientOnly(stateKey, () => {
		const storageKey = 'app_' + snakeCase(key)
		const driver = process.server ? dummyStorageDriver(storageKey, init) : localStorageDriver(storageKey, init)

		return useStorage(stateKey, driver)
	})
}
