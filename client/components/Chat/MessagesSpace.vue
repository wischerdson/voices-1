<template>
	<div class="flex flex-col justify-end">
		<div class="justify-self-end pb-10" v-if="pending">
			<span class="text-gray-500">Загрузка...</span>
		</div>

		<!-- <div class="text-center text-gray-600 mb-20" v-else-if="!messagesStore.messages.length">Сообщений еще нет</div> -->

		<ScrollableTrack :loader="messagesStore.load">
			<MessageList />
		</ScrollableTrack>

		<WritingStatus />
	</div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { useMessagesStore } from '~/store/messages'
import ScrollableTrack from '~/components/Chat/ScrollableTrack.vue'
import MessageList from '~/components/Chat/MessageList.vue'
import WritingStatus from '~/components/Chat/WritingStatus.vue'

const messagesStore = useMessagesStore()
const pending = computed(() => process.server || messagesStore.pending)

process.client && messagesStore.load()

</script>
