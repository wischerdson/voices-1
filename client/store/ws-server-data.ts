import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWsServerDataStore = defineStore('ws', () => {
	let socket: WebSocket | null = null
	let messageEvent: Ref<MessageEvent | null> = ref(null)
	let openEvent: Event | null = null

	const setSocket = (soc: WebSocket | null) => socket = soc

	const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => socket?.send(data)

	const setOnOpenEvent = (event: Event) => openEvent = event

	const setOnMessageEvent = (event: MessageEvent) => messageEvent.value = event

	const data = computed(() => {
		return messageEvent.value ? JSON.parse(messageEvent.value.data) : null
	})

	return { data, setSocket, setOnMessageEvent, setOnOpenEvent, send }
})
