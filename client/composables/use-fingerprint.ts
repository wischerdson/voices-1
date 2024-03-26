import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { singletonClientOnly } from '~/utils/singleton'
import { useLocalStorage } from '~/composables/use-storage'

export type Fingerprint = string

const getCurrentFingerprint = (): Promise<Fingerprint> => {
	const promise = FingerprintJS.load()

	return new Promise<Fingerprint>(async (resolve) => {
		const fp = await promise
		const result = await fp.get()

		resolve(result.visitorId)
	})
}

export const useFingerprints = () => singletonClientOnly('fingerprint', async () => {
	if (process.server) {
		throw new Error('Fingerprint can make on the client side only')
	}

	const currentFingerprint = await getCurrentFingerprint()

	const fingerprints = useLocalStorage<Fingerprint[]>('fingerprints', () => [], { deep: true })

	if (!fingerprints.value.includes(currentFingerprint)) {
		fingerprints.value.push(currentFingerprint)
	}

	return { fingerprints: fingerprints.value, currentFingerprint }
})
