const instances: any = {}

export const singleton = <T>(key: string, callback: () => T): T => {
	if (!(key in instances)) {
		instances[key] = callback()
	}

	return instances[key]
}

export const singletonClientOnly = <T>(key: string, callback: () => T): T => {
	if (process.server) {
		return callback()
	}

	return singleton(key, callback)
}
