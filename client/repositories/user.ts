import type { User } from '~/store/user'
import { useGetReq } from '#imports'
import { useFingerprints } from '~/composables/use-fingerprint'

export const fetchUser = async () => {
	const { fingerprints } = await useFingerprints()

	return useGetReq<User>('/user', { query: { fingerprints: fingerprints.join(',') } }).send()
}
