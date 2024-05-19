import type { User } from '~/store/user'
import { useGetReq, useLocalStorage } from '#imports'

export const fetchUser = async (chamberCode: string) => {
	const userToken = useLocalStorage<string>('user_token')
	const req = useGetReq<User>('/user', { query: { chamber: chamberCode } })

	if (userToken.value) {
		req.setBearerToken(userToken.value)
	}

	const user = await req.send()

	userToken.value = `${user.id}:${user.token}`

	return user
}
