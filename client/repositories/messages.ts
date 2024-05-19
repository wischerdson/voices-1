import { useGetReq, usePostReq } from '~/composables/use-request'
import { useUserStore, type ChamberParticipant } from '~/store/user'
import { randomString } from '~/utils/helpers'

export interface Message {
	id: number
	chamber_participant: ChamberParticipant
	client_code: string
	text: string
	my_reaction: string | null
	reactions: { [key: string]: number }
	created_at: number
}

export const fetchMessages = async (chamber: string, limit: number, offset: number = 0) => {
	const user = await useUserStore().getUser()

	return useGetReq<Message[]>('/messages', { query: { limit, offset, chamber } })
		.sign(user)
		.send()
}

export const sendMessage = (chamber: string, text: string) => {
	const user = useUserStore().user
	const clientCode = randomString(5)

	return {
		clientCode,
		request: usePostReq<Message>('/messages', { text, chamber, client_code: clientCode })
			.sign(user)
			.send()
	}
}
