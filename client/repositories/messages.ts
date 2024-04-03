import type { Message } from '~/store/messages'
import { useGetReq, usePostReq } from '~/composables/use-request'
import { useUserStore } from '~/store/user'
import { randomString } from '~/utils/helpers'

export const fetchMessages = async (limit: number, offset: number = 0) => {
	const user = await useUserStore().getUser()

	return useGetReq<Message[]>('/messages', {
		query: { limit, offset }
	}).sign(user)
}

export const messagesBatcher = (startOffset: number) => {
	let offset = startOffset

	const next = async (limit: number) => {
		const _offset = offset
		offset += limit

		return (await fetchMessages(limit, _offset)).send()
			.catch(e => {
				offset -= limit

				throw e
			})
	}

	const firstBatch = async (limit: number) => {
		offset = startOffset + limit

		return (await fetchMessages(limit, startOffset)).asAsyncData('messages', { server: false }).send()
			.catch(e => {
				offset -= limit

				throw e
			})
	}

	return { next, firstBatch }
}

export const sendMessage = (text: string) => {
	const user = useUserStore().user
	const clientCode = randomString(5)

	return {
		clientCode,
		request: usePostReq<Message>('/messages', { text, client_code: clientCode })
			.sign(user)
			.send()
	}
}

export const saveReaction = ({ id }: Message, reaction: string) => {
	const user = useUserStore().user

	return usePostReq('/reactions', {
		message_id: id,
		reaction_name: reaction
	}).sign(user).send()
}
