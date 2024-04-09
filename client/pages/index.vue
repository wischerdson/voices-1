<template>
	<div>
		<div class="w-full max-w-3xl mx-auto px-4 relative">
			<div class="min-h-screen pt-14 pb-20 flex flex-col justify-end">
				<div class="justify-self-end pb-10" v-if="messagesPending">
					<span class="text-gray-500">Загрузка...</span>
				</div>
				<MessagesSpace v-else />
			</div>

			<!-- <transition>
				<div class="gradient top absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" v-if="!infiniteZoneStore.arrivedTop"></div>
			</transition>
			<transition>
				<div class="gradient bottom absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" v-if="!infiniteZoneStore.arrivedBottom"></div>
			</transition>
			<InfiniteScrollZone @loadMore="loadMore" v-if="!showInfiniteScrollZone">
				<MessagesSpace />
			</InfiniteScrollZone>

			<transition>
				<div class="to-down-btn absolute bottom-0 z-10 inset-x-0 max-w-3xl mx-auto px-4 pointer-events-none flex justify-end pr-6 pb-6" v-if="infiniteZoneStore.scrollBottom > 200">
					<TheClickable class="w-7 h-7 bg-gray-300 text-black rounded-full flex items-center justify-center pointer-events-auto" @click="infiniteZoneStore.scrollDown(true)">
						<icon name="material-symbols:arrow-downward-rounded" />
					</TheClickable>
				</div>
			</transition> -->
		</div>
		<div class="fixed inset-x-0 bottom-0 z-30">
			<WritingArea />
		</div>
	</div>
</template>

<script setup lang="ts">

import { useMessagesStore } from '~/store/messages'
import { onMounted, useHead } from '#imports'
import { storeToRefs } from 'pinia'
import WritingArea from '~/components/WritingArea.vue'
import MessagesSpace from '~/components/MessagesSpace.vue'

useHead({ title: 'Чат - Void\'s voices' })

const messagesStore = useMessagesStore()

const { pending: messagesPending } = storeToRefs(messagesStore)

onMounted(() => {
	messagesStore.fetch()
	messagesStore.initMessageSentSound(new Audio('/sounds/message-sent.wav'))
	messagesStore.initMessageRecievedSound(new Audio('/sounds/message-recieved.wav'))
})

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

.gradient {
	&.v-enter-active, &.v-leave-active {
		transition: opacity .25s ease;
	}

	&.v-enter-from, &.v-leave-to {
		opacity: 0;
	}
}

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
