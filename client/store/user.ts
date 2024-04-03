import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchUser } from '~/repositories/user'

export type User = {
	id: number
	token: string
	created_at: number
}

export const useUserStore = defineStore('user', () => {
	const user = ref<User>()

	const setUser = (_user: User) => (user.value === undefined) && (user.value = _user)
	const userGetter = computed(() => user.value)

	const getUser = () => {
		return new Promise<User>(async resolve => {
			if (!user.value) {
				user.value = await fetchUser()
			}

			resolve(user.value)
		})
	}

	return { setUser, getUser, user: userGetter }
})
