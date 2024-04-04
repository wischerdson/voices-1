<template>
	<div class="min-h-full flex flex-col justify-end pt-12">
		<div v-for="(messages, timestamp) in groupedMessages" :key="`messages-group-${timestamp}`">
			<div class="text-center py-4 my-4 sticky top-0 z-10">
				<div class="bg-gray-300 text-black text-xs px-4 py-1.5 inline-block rounded-full">{{ timestampToDate(timestamp) }}</div>
			</div>
			<div class="space-y-6">
				<TheMessage :message="message" v-for="message in messages" :key="`message-${message.id}`" />
			</div>
		</div>

		<div class="writing text-xs text-gray-600 mt-6 sm:mb-4 sm:mt-4" :class="{ not: !writing }">
			<span>Кто-то скребется...</span>
		</div>
	</div>
</template>

<script setup lang="ts">

import TheMessage from '~/components/Message.vue'
import { timestampToDate } from '~/utils/date'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessagesStore } from '~/store/messages'
import { useNuxtApp } from '#app'

const writing = ref(0)
const { groupedMessages } = storeToRefs(useMessagesStore())

const ratchet = useNuxtApp().$ratchet

process.client && ratchet.listen('writing', (count: number) => {
	writing.value = count
})

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
