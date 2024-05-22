import type { CookieOptions } from 'nuxt/app'
import type { WatchOptions } from 'vue'
import { defineStorage, cookieStorageDriver, localStorageDriver, dummyStorageDriver } from '~/utils/storages'

type _CookieOptions = CookieOptions & { readonly?: false | undefined; }
type Storage<T> = ReturnType<typeof defineStorage<T>>

export function useCookieStorage<T>(key: string, init: () => T, cookieOptions?: _CookieOptions, watchOptions?: WatchOptions): Storage<T>
export function useCookieStorage<T>(key: string, init?: () => T, cookieOptions?: _CookieOptions, watchOptions?: WatchOptions): Storage<T | null>
export function useCookieStorage<T>(
	key: string,
	init?: () => T,
	cookieOptions: _CookieOptions = {},
	watchOptions: WatchOptions = {}
) {
	return defineStorage(key, cookieStorageDriver(init, cookieOptions), watchOptions)
}

export function useLocalStorage<T>(key: string, init: () => T, watchOptions?: WatchOptions): Storage<T>
export function useLocalStorage<T>(key: string, init?: () => T, watchOptions?: WatchOptions): Storage<T | null>
export function useLocalStorage<T>(
	key: string,
	init?: () => T,
	watchOptions: WatchOptions = {}
) {
	const driver = process.server ? dummyStorageDriver(init) : localStorageDriver(init)

	return defineStorage(key, driver, watchOptions)
}
