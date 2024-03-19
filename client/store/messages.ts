import { useNuxtApp } from '#app'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGetFetch, useGetReq, usePostReq } from '~/composables/use-request'

export type Message = {
	id: number
	text: string
	created_at: number
}

let messages: number[] | undefined = void 0

const writeMyMessagesIds = () => {
	window.localStorage.setItem('my-messages', JSON.stringify(messages))
}

const addMyMessageId = (id: number) => {
	messages?.push(id)
	writeMyMessagesIds()
}

const getMyMessagesIds = (): number[] => {
	if (messages !== undefined) {
		return messages
	}

	let value = window.localStorage.getItem('my-messages')

	if (!value) {
		writeMyMessagesIds()
	}

	messages = JSON.parse(value || '[]')

	return getMyMessagesIds()
}

export const useMessagesStore = defineStore('messages', () => {
	const messages = ref<Message[]>([])
	const limit = 70
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

		return useGetReq<Message[]>('/messages', {
			query: { limit, offset: offset.value }
		}).send().then(_messages => {
			offset.value += limit
			beforeStateUpdating()
			_messages.forEach(m => messages.value.push(m))
			thatsAll.value = _messages.length < limit
		})
	}

	const fetch = () => {
		const _limit = 15
		offset.value = _limit

		return useGetFetch<Message[]>('/messages', 'messages', {
			query: { limit: _limit, offset: 0 }
		}).send().then(({ data: _messages }) => {
			messages.value = _messages.value as Message[]
		})
	}

	const send = (message_text: string) => {
		return usePostReq<Message>('/messages', { message_text }).send()
			.then(({ id }) => addMyMessageId(id))
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
