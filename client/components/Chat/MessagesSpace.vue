<template>
	<div class="flex flex-col justify-end">
		<div class="justify-self-end pb-10" v-if="pending">
			<span class="text-gray-500">Загрузка...</span>
		</div>

		<ScrollableTrack>
			<pre>{{ messagesStore.serverMessages }}</pre>
			<!-- <MessageList /> -->
		</ScrollableTrack>

		<!-- <div class="text-center text-gray-600 mb-20" v-if="!messagesStore.messages.length">Сообщений еще нет</div>
		<WritingStatus /> -->
	</div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { useMessagesStore } from '~/store/messages'
import ScrollableTrack from '~/components/Chat/ScrollableTrack.vue'
// import MessageList from '~/components/Chat/MessageList.vue'

const messagesStore = useMessagesStore()
const pending = computed(() => process.server || messagesStore.loadPending)

if (process.client) {
	messagesStore.load()
}

</script>
