import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchUser } from '~/repositories/user'

export type ChamberParticipant = {
	id: number
	chamber_id: number
	name: string
	color: string
}

export type User = {
	id: number
	token: string
	created_at: number
	chamber_participant: ChamberParticipant
}

export const useUserStore = defineStore('user', () => {
	const user = ref<User>()
	const userGetter = computed(() => user.value)

	const defineUser = async (chamberCode: string) => {
		if (user.value) {
			return
		}

		user.value = await fetchUser(chamberCode)
	}

	return { user: userGetter, defineUser }
})
