<template>
	<div v-for="(messages, timestamp) in groupedMessages" :key="`messages-group-${timestamp}`">
		<div class="text-center py-4 my-4 sticky top-14 z-10">
			<div class="bg-gray-300 text-black text-xs px-4 py-1.5 inline-block rounded-full">{{ timestampToDate(timestamp) }}</div>
		</div>
		<div class="space-y-6">
			<TheMessage :message="message" v-for="message in messages" :key="`message-${message.id}`" />
		</div>
	</div>
</template>

<script setup lang="ts">

import TheMessage from '~/components/Message.vue'
import { timestampToDate } from '~/utils/date'
import { useMessagesStore, type Message } from '~/store/messages'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { messages } = storeToRefs(useMessagesStore())

const groupedMessages = computed(() => {
	const localeDateToTimestampMap: { [localeDate: string]: number } = {}

	return messages.value.reduce<{ [timestamp: number]: Message[] }>((groupedMessages, message) => {
		const localDate = new Date(message.created_at*1000).toLocaleDateString()

		if (!(localDate in localeDateToTimestampMap)) {
			localeDateToTimestampMap[localDate] = message.created_at
		}

		const timestamp = localeDateToTimestampMap[localDate]

		if (!(timestamp in groupedMessages)) {
			groupedMessages[timestamp] = []
		}

		groupedMessages[timestamp].unshift(message)

		return groupedMessages
	}, {})
})

</script>
