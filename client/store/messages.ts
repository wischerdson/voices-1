import { defineStore } from 'pinia'
import { useChatStore } from './chat'
import { fetchMessages, sendMessage, type Message } from '~/repositories/messages'
import { computed, ref } from 'vue'
import { useBatcher, useLocalStorage } from '#imports'
import type { ChamberParticipant } from './user'

export interface ClientMessage extends Omit<Message, 'id'> {
	status: 'pending' | 'sent' | 'error'
}

const defineClientMessages = async() => {
	const [ clientMessages, writeClientMessages ] = useLocalStorage<ClientMessage[]>('client-messages', () => [])

	for (let idx in clientMessages.value) {
		const message = clientMessages.value[idx]

		if (message.status === 'sent') {
			delete clientMessages.value[idx]
		}

		if (message.status === 'pending') {
			message.status = 'error'

			clientMessages.value[idx] = message
		}
	}

	const add = (text: string, chamber: ChamberParticipant) => {

	}

	writeClientMessages()

	return {
		clientMessages
	}
}

export const useMessagesStore = defineStore('messages', async () => {
	const BATCH_SIZE = 70

	const chatStore = await useChatStore()
	const chamber = chatStore.chamber

	const pending = ref(false)
	const pendingGetter = computed(() => pending.value)
	let thatsAll = false

	const batcher = useBatcher(
		(limit, offset) => fetchMessages(chamber.value, limit, offset), BATCH_SIZE
	)

	const serverMessages = ref<Message[]>([])
	// const { clientMessages, add } = defineClientMessages()




	const send = (text: string) => {
		const { clientCode, request } = sendMessage(chamber.value, text)

		// clientMessages.value.push({
		// 	chamber_participant: chatStore.chamberParticipant,
		// 	client_code: clientCode,
		// 	text,
		// 	created_at: Math.floor((new Date()).getTime() / 1000),
		// 	reactions: {},
		// 	my_reaction: null,
		// 	status: 'pending'
		// })

		return request
	}

	const load = async () => {
		if (thatsAll) {
			return
		}

		pending.value = true

		const messages = await batcher.next()
			.finally(() => pending.value = false)

		if (messages !== undefined) {
			thatsAll = messages.length < BATCH_SIZE
			serverMessages.value = serverMessages.value.concat(messages)
		}
	}

	return {
		loadPending: pendingGetter, serverMessages,
		send, load,
	}
})





























// import { useNuxtApp } from '#app'
// import { defineStore, storeToRefs } from 'pinia'
// import { ref, nextTick } from 'vue'
// import { deleteReaction, messagesBatcher, saveReaction, sendMessage } from '~/repositories/messages'
// import { useUserStore, type ChamberParticipant, type User } from './user'
// import { useChatStore } from './chat'
// import { isEmpty } from 'lodash-es'

// export type Message = {
// 	id?: number
// 	chamber_participant: ChamberParticipant
// 	client_code: string
// 	text: string
// 	my_reaction: string | null
// 	reactions: { [key: string]: number }
// 	created_at: number
// }

// export type MessageReactionsChangedData = {
// 	message_id: number
// 	reactions: { [key: string]: number }
// }

// export const useMessagesStore = defineStore('messages', () => {
// 	const LIMIT = 70
// 	const messages = ref<Message[]>([])
// 	const pagination = messagesBatcher(0)
// 	const thatsAll = ref(false)
// 	const { $echo } = useNuxtApp()
// 	const { user } = storeToRefs(useUserStore())
// 	const pending = ref(true)
// 	const chamber = useChatStore().chamber
// 	let messageSentSound: HTMLAudioElement
// 	let messageRecievedSound: HTMLAudioElement

// 	process.client && $echo
// 		.channel('messages')
// 		.listen('MessageSent', ({ message }: { message: Message }) => {
// 			const idx = messages.value.findIndex(m => {
// 				return (m.client_code === message.client_code && m.chamber_participant.id === user.value?.chamber_participant.id) ||
// 					('id' in m && m.id === message.id)
// 			})

// 			if (idx === -1) {
// 				messages.value.unshift(message)

// 				if (message.chamber_participant.id !== user.value?.chamber_participant.id) {
// 					messageRecievedSound.play()
// 				}
// 			}
// 		})

// 	process.client && $echo
// 		.channel('reactions')
// 		.listen('MessageReactionsChanged', ({ message_id, reactions }: MessageReactionsChangedData) => {
// 			const idx = messages.value.findIndex(({ id }) => id === message_id)

// 			if (idx >= 0) {
// 				messages.value[idx].reactions = reactions
// 			}
// 		})

// 	const loadMore = async (beforeStateUpdating: () => void, afterStateUpdating: () => void) => {
// 		if (thatsAll.value) {
// 			return
// 		}

// 		const data = await pagination.next(LIMIT)

// 		beforeStateUpdating()
// 		data.forEach(m => messages.value.push(m))

// 		nextTick(afterStateUpdating)

// 		thatsAll.value = data.length < LIMIT
// 	}

// 	const fetch = async () => {
// 		const { data } = await pagination.firstBatch(chamber.value, 20)

// 		messages.value = data.value || []
// 		pending.value = false
// 	}

// 	const send = (text: string) => {
// 		const { clientCode, request } = sendMessage(chamber.value, text)

// 		messages.value.unshift({
// 			client_code: clientCode,
// 			created_at: Math.floor((new Date()).getTime() / 1000),
// 			my_reaction: null,
// 			reactions: {},
// 			user_id: (user.value as User).id,
// 			text
// 		})

// 		request.then(message => {
// 			const idx = messages.value.findIndex(m => {
// 				return !('id' in m) && (m.client_code === message.client_code)
// 			})

// 			messageSentSound.play()

// 			return messages.value[idx] = message
// 		})

// 		return request
// 	}

// 	const isMessageMine = ({ user_id }: Message) => user.value && +user.value.chamber_participant.id === +user_id

// 	const addReactionLocally = (messageIdx: number, reaction: string) => {
// 		messages.value[messageIdx].my_reaction = reaction

// 		if (reaction in messages.value[messageIdx].reactions) {
// 			messages.value[messageIdx].reactions[reaction]++
// 		} else {
// 			if (isEmpty(messages.value[messageIdx].reactions)) {
// 				messages.value[messageIdx].reactions = { [reaction]: 1 }
// 			} else {
// 				messages.value[messageIdx].reactions[reaction] = 1
// 			}
// 		}
// 	}

// 	const deleteReactionLocally = (messageIdx: number) => {
// 		const myReaction = messages.value[messageIdx].my_reaction

// 		if (myReaction) {
// 			messages.value[messageIdx].reactions[myReaction]--

// 			if (messages.value[messageIdx].reactions[myReaction] <= 0) {
// 				delete messages.value[messageIdx].reactions[myReaction]
// 			}
// 		}

// 		messages.value[messageIdx].my_reaction = null
// 	}

// 	const _saveReaction = (message: Message, reactionName: string) => {
// 		const idx = messages.value.findIndex(({ id }) => id === message.id)

// 		addReactionLocally(idx, reactionName)

// 		return saveReaction(message, reactionName)
// 	}

// 	const _deleteReaction = (message: Message) => {
// 		const idx = messages.value.findIndex(({ id }) => id === message.id)

// 		deleteReactionLocally(idx)

// 		return deleteReaction(message)
// 	}

// 	const initMessageRecievedSound = (sound: HTMLAudioElement) => {
// 		sound.volume = .5
// 		messageRecievedSound = sound
// 	}

// 	const initMessageSentSound = (sound: HTMLAudioElement) => {
// 		sound.volume = .5
// 		messageSentSound = sound
// 	}

// 	return {
// 		messages, thatsAll, pending,
// 		fetch, loadMore, send, isMessageMine,
// 		saveReaction: _saveReaction, deleteReaction: _deleteReaction,
// 		initMessageRecievedSound, initMessageSentSound
// 	}
// })
