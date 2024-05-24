import { useNuxtApp } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { deleteReaction, fetchMessages, saveReaction, sendMessage } from '~/repositories/messages'
import { useUserStore, type User } from './user'
import { isEmpty } from 'lodash-es'
import { useBatcher } from '~/composables/use-batcher'
import { useSoundsStore } from './sounds'

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
	const BATCH_SIZE = 70
	const messages = ref<Message[]>([])
	const thatsAll = ref(false)
	const { $echo } = useNuxtApp()
	const { user } = storeToRefs(useUserStore())
	const pending = ref(true)
	const soundsStore = useSoundsStore()

	const batcher = useBatcher(fetchMessages, BATCH_SIZE)

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
					soundsStore.playSound('message-recieved')
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

	const load = async () => {
		if (thatsAll.value) {
			return
		}

		pending.value = true

		const _messages = await batcher.next()
			.finally(() => pending.value = false)

		if (_messages !== undefined) {
			thatsAll.value = _messages.length < BATCH_SIZE
			messages.value = messages.value.concat(_messages)
		}
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

			soundsStore.playSound('message-sent')

			return messages.value[idx] = message
		})

		return request
	}

	const isMessageMine = ({ user_id }: Message) => user.value && +user.value.id === +user_id

	const addReactionLocally = (messageIdx: number, reaction: string) => {
		messages.value[messageIdx].my_reaction = reaction

		if (reaction in messages.value[messageIdx].reactions) {
			messages.value[messageIdx].reactions[reaction]++
		} else {
			if (isEmpty(messages.value[messageIdx].reactions)) {
				messages.value[messageIdx].reactions = { [reaction]: 1 }
			} else {
				messages.value[messageIdx].reactions[reaction] = 1
			}
		}
	}

	const deleteReactionLocally = (messageIdx: number) => {
		const myReaction = messages.value[messageIdx].my_reaction

		if (myReaction) {
			messages.value[messageIdx].reactions[myReaction]--

			if (messages.value[messageIdx].reactions[myReaction] <= 0) {
				delete messages.value[messageIdx].reactions[myReaction]
			}
		}

		messages.value[messageIdx].my_reaction = null
	}

	const _saveReaction = (message: Message, reactionName: string) => {
		const idx = messages.value.findIndex(({ id }) => id === message.id)

		addReactionLocally(idx, reactionName)

		return saveReaction(message, reactionName)
	}

	const _deleteReaction = (message: Message) => {
		const idx = messages.value.findIndex(({ id }) => id === message.id)

		deleteReactionLocally(idx)

		return deleteReaction(message)
	}

	return {
		messages, thatsAll, pending,
		fetch, load, send, isMessageMine,
		saveReaction: _saveReaction, deleteReaction: _deleteReaction
	}
})
