<template>
	<div class="message-row flex" :class="{ 'message-is-mine': isMine }">
		<div class="message flex flex-col" @mouseover="messageHovered = true" @mouseleave="messageHovered = false">
			<div class="message-bubble self-start bg-gray-900 py-2 pl-3 rounded-lg leading-normal whitespace-pre-line text-sm relative pr-12">
				<span>{{ message.text }}</span>
				<div class="absolute inset-y-0 flex items-end pb-2.5 bottom-0 right-0 pr-2">
					<span class="message-time text-[.625rem] text-gray-700 font-light">{{ date }}</span>
				</div>
				<MessageReactions :message="message" :show-menu-button="messageHovered" @reacted="saveReaction" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import type { Message } from '~/store/messages'
import { useMessagesStore } from '~/store/messages'
import { timestampToTime } from '~/utils/date'
import { computed, ref } from 'vue'
import MessageReactions from '~/components/MessageReactions.vue'

const props = defineProps<{ message: Message }>()

const messagesStore = useMessagesStore()

const messageHovered = ref(false)

const date = computed(() => timestampToTime(props.message.created_at))
const isMine = computed(() => !!messagesStore.isMessageMine(props.message))

const saveReaction = (reactionName: string) => {
	messageHovered.value = false

	if (props.message.my_reaction === reactionName) {
		messagesStore.deleteReaction(props.message)
	} else {
		messagesStore.saveReaction(props.message, reactionName)
	}
}

</script>

<style scoped lang="scss">

.message-row {
	padding-right: 40px;
	justify-content: flex-start;

	.message-bubble {
		align-self: flex-start;
	}

	&.message-is-mine {
		padding-left: 40px;
		padding-right: 0;
		justify-content: flex-end;

		.message-bubble {
			background-color: theme('colors.gray.850');
			align-self: flex-end;

			.message-time {
				color: theme('colors.gray.600');
			}
		}
	}
}

</style>
