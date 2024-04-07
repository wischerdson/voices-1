import type { User } from '~/store/user'
import { useGetReq, useLocalStorage } from '#imports'

export const fetchUser = async () => {
	const storage = useLocalStorage<string>('user_token')
	const req = useGetReq<User>('/user')

	if (storage.value) {
		req.setBearerToken(storage.value)
	}

	const user = await req.send()

	storage.value = `${user.id}:${user.token}`

	return user
}
