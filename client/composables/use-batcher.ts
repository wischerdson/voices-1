type Callback<T> = (limit: number, offset: number) => Promise<T>

export interface Batcher<T> {
	prev(): Promise<T | undefined>
	next(): Promise<T | undefined>
	startOver(): Promise<T | undefined>
	isFirst(): boolean
	setBatchSize(value: number): void
}

export const useBatcher = <T>(callback: Callback<T>, limit: number): Batcher<T> => {
	let offset = 0
	let waiting = false

	const call = async (_offset: number) => {
		if (waiting) {
			return
		}

		waiting = true

		const result = await callback(limit, offset).finally(() => waiting = false)
		offset = _offset

		return result
	}

	const startOver = () => call(0)

	const next = () => call(offset + limit)

	const prev = () => call(offset - limit)

	const setBatchSize = (value: number) => limit = value

	const isFirst = () => offset === 0

	return { next, prev, startOver, setBatchSize, isFirst }
}
