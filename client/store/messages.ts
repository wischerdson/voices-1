import { useNuxtApp } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { deleteReaction, messagesBatcher, saveReaction, sendMessage } from '~/repositories/messages'
import { useUserStore } from './user'

export type Message = {
	id: number
	user_id: number
	client_code: string
	text: string
	my_reaction: string | null
	reactions: { [key: string]: number }
	created_at: number
}

export type MessageReactionsChangedData = {
	message_id: number
	reactions: { [key: string]: number }
}

export const useMessagesStore = defineStore('messages', () => {
	const LIMIT = 70
	const messages = ref<Message[]>([])
	const pagination = messagesBatcher(0)
	const thatsAll = ref(false)
	const { $echo } = useNuxtApp()
	const { user } = storeToRefs(useUserStore())
	const pending = ref(true)

	process.client && $echo
		.channel('messages')
		.listen('MessageSent', ({ message }: { message: Message }) => {
			messages.value.unshift(message)
		})

	process.client && $echo
		.channel('reactions')
		.listen('MessageReactionsChanged', ({ message_id, reactions }: MessageReactionsChangedData) => {
			const idx = messages.value.findIndex(({ id }) => id === message_id)

			if (idx >= 0) {
				messages.value[idx].reactions = reactions
			}
		})

	const loadMore = async (beforeStateUpdating: () => void, afterStateUpdating: () => void) => {
		if (thatsAll.value) {
			return
		}

		const data = await pagination.next(LIMIT)

		beforeStateUpdating()
		data.forEach(m => messages.value.push(m))

		nextTick(afterStateUpdating)

		thatsAll.value = data.length < LIMIT
	}

	const fetch = async () => {
		const { data } = await pagination.firstBatch(20)

		messages.value = data.value || []
		pending.value = false
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

	const _saveReaction = async (message: Message, reactionName: string) => {
		await saveReaction(message, reactionName)

		const idx = messages.value.findIndex(({ id }) => id === message.id)

		messages.value[idx].my_reaction = reactionName
	}

	const _deleteReaction = async (message: Message) => {
		await deleteReaction(message)

		const idx = messages.value.findIndex(({ id }) => id === message.id)

		messages.value[idx].my_reaction = null
	}

	return {
		messages, groupedMessages, thatsAll, pending,
		fetch, loadMore, send, isMessageMine,
		saveReaction: _saveReaction, deleteReaction: _deleteReaction
	}
})
