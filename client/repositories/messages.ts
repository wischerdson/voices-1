import type { Message } from '~/store/messages'
import { useDeleteReq, useGetReq, usePostReq } from '~/composables/use-request'
import { useUserStore } from '~/store/user'
import { randomString } from '~/utils/helpers'

export const fetchMessages = async (limit: number, offset: number = 0) => {
	const user = await useUserStore().getUser()

	return useGetReq<Message[]>('/messages', { query: { limit, offset } })
		.sign(user)
		.send()
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

export const deleteReaction = ({ id }: Message) => {
	const user = useUserStore().user

	return useDeleteReq('/reactions', { query: { message_id: id } }).sign(user).send()
}
