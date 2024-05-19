import { useDeleteReq, usePostReq } from '~/composables/use-request'
import { useUserStore } from '~/store/user'

export const saveReaction = (messageId: number, reaction: string) => {
	const user = useUserStore().user

	return usePostReq('/reactions', {
		message_id: messageId,
		reaction_name: reaction
	}).sign(user).send()
}

export const deleteMyReaction = (messageId: number) => {
	const user = useUserStore().user

	return useDeleteReq('/reactions', { query: { message_id: messageId } })
		.sign(user).send()
}
