import { useNuxtApp } from '#app'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGetFetch, useGetReq, usePostReq } from '~/composables/use-request'

export type Message = {
	id: number
	text: string
	created_at: number
}

export const useMessagesStore = defineStore('messages', () => {
	const messages = ref<Message[]>([])
	const limit = 80
	const offset = ref(0)
	const thatsAll = ref(false)
	const { $echo } = useNuxtApp()

	process.client && $echo
		.channel('messages')
		.listen('MessageSent', ({ message }: { message: Message }) => {
			messages.value.unshift(message)
		})

	const loadMore = (beforeStateUpdating: () => void) => {
		if (thatsAll.value) {
			return
		}

		offset.value += limit

		return useGetReq<Message[]>('/messages', {
			query: { limit, offset: offset.value }
		}).send().then(_messages => {
			beforeStateUpdating()
			_messages.forEach(m => messages.value.push(m))
			thatsAll.value = _messages.length < limit
		}).catch(e => {
			offset.value -= limit

			throw e
		})
	}

	const fetch = () => {
		const _limit = 20
		offset.value = _limit

		return useGetFetch<Message[]>('/messages', 'messages', {
			query: { limit, offset: 0 }
		}).send().then(({ data: _messages }) => {
			messages.value = _messages.value as Message[]
		})
	}

	const send = (message_text: string) => {
		return usePostReq('/messages', { message_text }).send()
	}

	const groupedMessages = computed(() => {
		const localeDateToTimestampMap: { [localeDate: string]: number } = {}

		return messages.value.reduce<{ [timestamp: number]: Message[] }>((groupedMessages, message) => {
			const localDate = new Date(message.created_at*1000).toLocaleDateString()

			if (!(localDate in localeDateToTimestampMap)) {
				localeDateToTimestampMap[localDate] = message.created_at
			}

			const timestamp = localeDateToTimestampMap[localDate]

			if (!(timestamp in groupedMessages)) {
				groupedMessages[timestamp] = []
			}

			groupedMessages[timestamp].unshift(message)

			return groupedMessages
		}, {})
	})

	return { messages, groupedMessages, thatsAll, fetch, loadMore, send }
})
