import type { Message } from '~/store/messages'
import { useGetReq, usePostReq } from '~/composables/use-request'
import { useUserStore } from '~/store/user'
import { randomString } from '~/utils/helpers'

export const fetchMessages = (limit: number, offset: number = 0) => {
	return useGetReq<Message[]>('/messages', {
		query: { limit, offset }
	})
}

export const messagesBatcher = (startOffset: number) => {
	let offset = startOffset

	const next = (limit: number) => {
		const _offset = offset
		offset += limit

		return fetchMessages(limit, _offset).send()
			.catch(e => {
				offset -= limit

				throw e
			})
	}

	const firstBatch = (limit: number) => {
		offset = startOffset + limit

		return fetchMessages(limit, startOffset).asAsyncData('messages', { server: false }).send()
			.catch(e => {
				offset = startOffset

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
