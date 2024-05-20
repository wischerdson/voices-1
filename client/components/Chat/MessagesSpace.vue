<template>
	<div class="flex flex-col justify-end">
		<!-- <transition>
			<div class="to-down-btn fixed bottom-20 z-10 inset-x-0 max-w-3xl mx-auto px-4 pointer-events-none flex justify-end pr-6 pb-6" v-if="infiniteZoneStore.scrollBottom > 200">
				<TheClickable class="w-7 h-7 bg-gray-300 text-black rounded-full flex items-center justify-center pointer-events-auto" @click="infiniteZoneStore.scrollDown(true)">
					<icon name="material-symbols:arrow-downward-rounded" />
				</TheClickable>
			</div>
		</transition> -->

		<div class="justify-self-end pb-10" v-if="pending">
			<span class="text-gray-500">Загрузка...</span>
		</div>

		<ScrollableTrack>
			<!-- <MessageList /> -->
		</ScrollableTrack>


		<!--

		<div class="text-center text-gray-600 mb-20" v-if="!messagesStore.messages.length">Сообщений еще нет</div>

		<WritingStatus /> -->
	</div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { useMessagesStore } from '~/store/messages'
import ScrollableTrack from '~/components/Chat/ScrollableTrack.vue'
// import MessageList from '~/components/Chat/MessageList.vue'

const messagesStore = useMessagesStore()
const pending = computed(() => process.server || messagesStore.pending)

if (process.client) {
	messagesStore.load()
}


</script>

<style scoped lang="scss">

.to-down-btn {
	&.v-enter-from, &.v-leave-to {
		opacity: 0;
		transform: translateY(20px);
	}

	&.v-enter-active, &.v-leave-active {
		transition: opacity .25s ease, transform .25s ease;
	}
}

</style>
