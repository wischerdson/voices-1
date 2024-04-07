<template>
	<div class="w-full flex-1 flex flex-col">
		<div class="flex-1 relative">
			<transition>
				<div class="gradient top absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" v-if="!infiniteZoneStore.arrivedTop"></div>
			</transition>
			<transition>
				<div class="gradient bottom absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" v-if="!infiniteZoneStore.arrivedBottom"></div>
			</transition>
			<InfiniteScrollZone class="absolute inset-0" @loadMore="loadMore" v-if="showInfiniteScrollZone">
				<MessagesSpace class="max-w-3xl mx-auto px-4" />
			</InfiniteScrollZone>
			<div class="absolute inset-0 max-w-3xl mx-auto px-4 flex items-end pb-10" v-else>
				<span class="text-gray-500">Загрузка...</span>
			</div>
			<transition>
				<div class="to-down-btn absolute bottom-0 z-10 inset-x-0 max-w-3xl mx-auto px-4 pointer-events-none flex justify-end pr-6 pb-6" v-if="infiniteZoneStore.scrollBottom > 200">
					<TheClickable class="w-7 h-7 bg-gray-300 text-black rounded-full flex items-center justify-center pointer-events-auto" @click="infiniteZoneStore.scrollDown(true)">
						<icon name="material-symbols:arrow-downward-rounded" />
					</TheClickable>
				</div>
			</transition>
		</div>
		<div class="w-full max-w-3xl mx-auto px-4">
			<WritingArea />
		</div>
	</div>
</template>

<script setup lang="ts">

import { useMessagesStore } from '~/store/messages'
import { useInfiniteZoneStore } from '~/store/infinite-zone'
import { computed, onMounted, useHead } from '#imports'
import { storeToRefs } from 'pinia'
import WritingArea from '~/components/WritingArea.vue'
import MessagesSpace from '~/components/MessagesSpace.vue'
import InfiniteScrollZone from '~/components/InfiniteScrollZone.vue'
import TheClickable from '~/components/Clickable.vue'

useHead({ title: 'Чат - Void\'s voices' })

const messagesStore = useMessagesStore()
const infiniteZoneStore = useInfiniteZoneStore()

const { pending: messagesPending } = storeToRefs(messagesStore)

const loadMore = (onBeforeUpdate: () => void, onAfterUpdate: () => void) => messagesStore.loadMore(onBeforeUpdate, onAfterUpdate)

const showInfiniteScrollZone = computed(() => !messagesPending.value)

onMounted(() => {
	messagesStore.fetch()
})

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
	overflow: hidden;
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
