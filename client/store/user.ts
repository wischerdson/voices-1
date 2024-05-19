import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { fetchUser } from '~/repositories/user'
import { useChatStore } from './chat'

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

	const chatStore = useChatStore()
	const chamber = chatStore.chamber

	const getUser = () => {
		return new Promise<User>(resolve => {
			if (user.value) {
				return resolve(user.value)
			}

			const stopHandler = watch(user, u => {
				if (u !== undefined) {
					stopHandler()
					resolve(u)
				}
			}, { immediate: true })
		})
	}

	const defineUser = async () => {
		if (user.value) {
			return
		}

		user.value = await fetchUser(chamber.value)
	}

	return { user: userGetter, getUser, defineUser }
})
