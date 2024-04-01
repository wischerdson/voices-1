import { useNuxtApp } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { messagesBatcher, sendMessage } from '~/repositories/messages'
import { useUserStore } from './user'

export type Message = {
	id: number
	user_id: number
	client_code: string
	text: string
	created_at: number
}

export const useMessagesStore = defineStore('messages', () => {
	const LIMIT = 70
	const messages = ref<Message[]>([])
	const pagination = messagesBatcher(0)
	const thatsAll = ref(false)
	const { $echo } = useNuxtApp()
	const { user } = storeToRefs(useUserStore())
	const pending = ref(false)

	process.client && $echo
		.channel('messages')
		.listen('MessageSent', ({ message }: { message: Message }) => {
			messages.value.unshift(message)
		})

	const loadMore = async (beforeStateUpdating: () => void) => {
		if (thatsAll.value) {
			return
		}

		const data = await pagination.next(LIMIT)

		beforeStateUpdating()
		data.forEach(m => messages.value.push(m))

		thatsAll.value = data.length < LIMIT
	}

	const fetch = async () => {
		pending.value = true
		const { data } = await pagination.firstBatch(10)

		messages.value = data.value || []

		watch(data, value => {
			messages.value = value || []
			pending.value = !value
		}, { once: true })
	}

	const send = (text: string) => {
		const { clientCode, request } = sendMessage(text)

		return request
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

	const isMessageMine = ({ user_id }: Message) => user.value && +user.value.id === +user_id

	return { messages, groupedMessages, thatsAll, pending, fetch, loadMore, send, isMessageMine }
})
