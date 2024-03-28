import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type User = {
	id: number
	token: string
	created_at: number
}

export const useUserStore = defineStore('user', () => {
	const user = ref<User>()

	const setUser = (_user: User) => (user.value === undefined) && (user.value = _user)
	const userGetter = computed(() => user.value)

	return { setUser, user: userGetter }
})
