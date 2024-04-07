import { useNuxtApp } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { deleteReaction, messagesBatcher, saveReaction, sendMessage } from '~/repositories/messages'
import { useUserStore, type User } from './user'

export type Message = {
	id?: number
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
	let messageSentSound: HTMLAudioElement
	let messageRecievedSound: HTMLAudioElement

	process.client && $echo
		.channel('messages')
		.listen('MessageSent', ({ message }: { message: Message }) => {
			const idx = messages.value.findIndex(m => {
				return (m.client_code === message.client_code && m.user_id === user.value?.id) ||
					('id' in m && m.id === message.id)
			})

			if (idx === -1) {
				messages.value.unshift(message)

				if (message.user_id !== user.value?.id) {
					messageRecievedSound.play()
				}
			}
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

		messages.value.unshift({
			client_code: clientCode,
			created_at: Math.floor((new Date()).getTime() / 1000),
			my_reaction: null,
			reactions: {},
			user_id: (user.value as User).id,
			text
		})

		request.then(message => {
			const idx = messages.value.findIndex(m => {
				return !('id' in m) && (m.client_code === message.client_code)
			})

			messageSentSound.play()

			return messages.value[idx] = message
		})

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

	const _saveReaction = (message: Message, reactionName: string) => {
		const idx = messages.value.findIndex(({ id }) => id === message.id)

		messages.value[idx].my_reaction = reactionName

		return saveReaction(message, reactionName)
	}

	const _deleteReaction = (message: Message) => {
		const idx = messages.value.findIndex(({ id }) => id === message.id)

		messages.value[idx].my_reaction = null

		return deleteReaction(message)
	}

	const initMessageRecievedSound = (sound: HTMLAudioElement) => {
		sound.volume = .5
		messageRecievedSound = sound
	}
	const initMessageSentSound = (sound: HTMLAudioElement) => {
		sound.volume = .5
		messageSentSound = sound
	}

	return {
		messages, groupedMessages, thatsAll, pending,
		fetch, loadMore, send, isMessageMine,
		saveReaction: _saveReaction, deleteReaction: _deleteReaction,
		initMessageRecievedSound, initMessageSentSound
	}
})
