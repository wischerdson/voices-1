import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGetFetch, useGetReq } from '~/composables/use-request'

export type Message = {
	id: number
	text: string
	created_at: number
}

export const useMessagesStore = defineStore('ws', () => {
	const messages = ref<Message[]>([])
	const limit = 50
	const offset = ref(0)
	const thatsAll = ref(false)

	const loadMore = () => {
		if (thatsAll.value) {
			return
		}

		offset.value += limit

		return useGetReq<Message[]>('/messages', {
			query: { limit, offset: offset.value }
		}).send().then(_messages => {
			_messages.reverse().forEach(m => messages.value.unshift(m))
			thatsAll.value = _messages.length < limit
		}).catch(e => {
			offset.value -= limit

			throw e
		})
	}

	const fetch = () => {
		offset.value = limit

		return useGetFetch<Message[]>('/messages', 'messages', {
			query: { limit, offset: 0 }
		}).send().then(({ data: _messages }) => {
			messages.value = _messages.value as Message[]
		})
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

	return { messages, groupedMessages, fetch, loadMore }
})
