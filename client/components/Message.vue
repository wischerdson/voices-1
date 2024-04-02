<template>
	<div class="message-row flex" :class="{ 'message-is-mine': isMine }">
		<div class="message" @mouseover="messageHovered = true" @mouseleave="messageHovered = false">
			<div class="message-bubble bg-gray-900 py-2 pl-3 rounded-lg leading-normal whitespace-pre-line text-sm relative pr-12">
				<span>{{ message.text }}</span>
				<div class="absolute inset-y-0 flex items-end pb-2.5 bottom-0 right-0 pr-2">
					<span class="message-time text-[.625rem] text-gray-700 font-light">{{ date }}</span>
				</div>
			</div>
			<MessageReactions :show-no-reactions-button="messageHovered" @reacted="r => saveReaction(message, r)" />
		</div>
	</div>
</template>

<script setup lang="ts">

import type { Message } from '~/store/messages'
import { useMessagesStore } from '~/store/messages'
import { saveReaction } from '~/repositories/messages'
import { timestampToTime } from '~/utils/date'
import { computed, ref } from 'vue'
import MessageReactions from '~/components/MessageReactions.vue'

const props = defineProps<{ message: Message }>()

const messagesStore = useMessagesStore()

const messageHovered = ref(false)

const date = computed(() => timestampToTime(props.message.created_at))
const isMine = computed(() => !!messagesStore.isMessageMine(props.message))

</script>

<style scoped lang="scss">

.message-row {
	padding-right: 40px;
	justify-content: flex-start;

	&.message-is-mine {
		padding-left: 40px;
		padding-right: 0;
		justify-content: flex-end;

		.message-bubble {
			@apply bg-gray-850;

			.message-time {
				@apply text-gray-600;
			}
		}
	}
}

</style>
