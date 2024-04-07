import type { WatchOptions } from 'vue'
import { useState } from '#app'
import { snakeCase } from 'lodash-es'
import { watch } from 'vue'
import { singletonClientOnly } from '~/utils/singleton'
import ClientCookies from 'js-cookie'

export interface StorageDriver<T> {
	read(): T | null
	write(data: T | null): void
}

const handleFetchedData = <T>(rawData: string | null | undefined, init: () => T): T => {
	if (!rawData) {
		return (init || (() => null))()
	}

	try {
		return JSON.parse(rawData);
	} catch (e) {
		return rawData as T
	}
}

const localStorageDriver = <T>(key: string, init?: () => T): StorageDriver<T> => {
	if (process.server) {
		throw new Error('There is impossible to use localStorage driver on the server side')
	}

	return {
		read() {
			return handleFetchedData(
				window.localStorage.getItem(key),
				init || (() => null)
			)
		},
		write(data: T) {
			window.localStorage.setItem(
				key,
				typeof data === 'object' ? JSON.stringify(data) : `${data}`
			)
		}
	}
}

const dummyStorageDriver = <T>(key: string, init?: () => T): StorageDriver<T> => {
	return {
		read: init || (() => null),
		write: () => void 0
	}
}

const clientCookieStorageDriver = <T>(key: string, init?: () => T, cookieOptions?: typeof ClientCookies.attributes): StorageDriver<T> => {
	return {
		read() {
			return handleFetchedData(
				ClientCookies.get(key),
				init || (() => null)
			)
		},
		write(data: T) {
			ClientCookies.set(key, JSON.stringify(data), cookieOptions)
		}
	}
}

const useStorage = <T>(stateKey: string, { read, write }: StorageDriver<T>, watchOptions: WatchOptions) => {
	const state = useState<T | null>(stateKey, read)

	watch(state, write, watchOptions)

	return state
}

export const useLocalStorage = <T>(key: string, init?: () => T, watchOptions: WatchOptions = {}) => {
	const stateKey = 'local_storage_' + snakeCase(key)

	return singletonClientOnly(stateKey, () => {
		const storageKey = 'app_' + snakeCase(key)
		const driver = process.server ? dummyStorageDriver(storageKey, init) : localStorageDriver(storageKey, init)

		return useStorage<T>(stateKey, driver, watchOptions)
	})
}

export const useCookieStorage = <T>(key: string, init?: () => T, watchOptions: WatchOptions = {}) => {
	const stateKey = 'cookie_' + snakeCase(key)

	return singletonClientOnly(stateKey, () => {
		const storageKey = 'app_' + snakeCase(key)
		const driver = process.server ? dummyStorageDriver(storageKey, init) : clientCookieStorageDriver(storageKey, init)

		return useStorage<T>(stateKey, driver, watchOptions)
	})
}
