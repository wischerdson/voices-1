<template>
	<div class="min-h-full flex flex-col justify-end pt-12">
		<div class="" v-for="(messages, timestamp) in groupedMessages" :key="`messages-group-${timestamp}`">
			<div class="text-center py-4 sticky top-0">
				<div class="bg-gray-900 text-gray-450 text-xs px-4 py-1.5 inline-block rounded-full">{{ timestampToDate(timestamp) }}</div>
			</div>
			<div class="pr-10 space-y-4">
				<TheMessage :message="message" v-for="message in messages" :key="`message-${message.id}`" />
			</div>
		</div>

		<div class="writing text-xs text-gray-600 mt-6" :class="{ not: writing }">
			<span>Кто-то скребется...</span>
		</div>
	</div>
</template>

<script setup lang="ts">

import TheMessage from '~/components/Message.vue'
import { timestampToDate } from '~/utils/date'
import { computed, ref } from 'vue'
import { useMessagesStore } from '~/store/messages'

const writing = ref(false)
const messagesStore = useMessagesStore()
const groupedMessages = computed(() => messagesStore.groupedMessages)

</script>

<style lang="scss" scoped>

.writing {
	transition: opacity .2s ease;

	span {
		animation: pulse_scratching 1s ease-in-out infinite;

		@keyframes pulse_scratching {
			from {
				opacity: 1;
			}
			50% {
				opacity: .7;
			}
			to {
				opacity: 1;
			}
		}
	}

	&.not {
		opacity: 0;
		pointer-events: none;
		user-select: none;
	}
}

</style>
