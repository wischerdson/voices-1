import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
	const chamber = ref<string>('')

	const setChamber = (c: string) => chamber.value = c
	const chamberGetter = computed(() => chamber)

	return { setChamber, chamber: chamberGetter }
})
