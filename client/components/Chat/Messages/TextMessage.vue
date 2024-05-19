<template>
	<div class="message-row flex" :class="{ 'message-is-mine': isMine }">
		<div class="message" @mouseover="messageHovered = true" @mouseleave="messageHovered = false">
			<div class="message-author mb-1" data-color="amber">
				<span class="text-[11px] opacity-50">Alisson Dean</span>
			</div>
			<div class="message-bubble self-start bg-gray-900 py-2 pl-3 rounded-lg leading-normal whitespace-pre-line text-sm relative pr-12">
				<p class="message-text">{{ message.text }}</p>
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
import MessageReactions from '~/components/Chat/MessageReactions.vue'

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

		.message-author {
			text-align: right;
		}

		.message-bubble {
			background-color: theme('colors.gray.850');
			align-self: flex-end;

			.message-time {
				color: theme('colors.gray.600');
			}
		}
	}
}

.message-author {
	&[data-color="red"] {
		color: theme('colors.red.500');
	}

	&[data-color="pink"] {
		color: theme('colors.pink.500');
	}

	&[data-color="purple"] {
		color: theme('colors.purple.400');
	}

	&[data-color="indigo"] {
		color: theme('colors.indigo.400');
	}

	&[data-color="sky"] {
		color: theme('colors.sky.500');
	}

	&[data-color="cyan"] {
		color: theme('colors.cyan.400');
	}

	&[data-color="emerald"] {
		color: theme('colors.emerald.500');
	}

	&[data-color="white"] {
		color: theme('colors.white');
	}

	&[data-color="lime"] {
		color: theme('colors.lime.500');
	}

	&[data-color="amber"] {
		color: theme('colors.amber.500');
	}
}

</style>
