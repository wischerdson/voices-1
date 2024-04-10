<template>
	<div class="min-h-full flex flex-col justify-end">
		<div ref="messageList">
			<MessageList />
		</div>

		<transition>
			<div class="to-down-btn fixed bottom-20 z-10 inset-x-0 max-w-3xl mx-auto px-4 pointer-events-none flex justify-end pr-6 pb-6" v-if="infiniteZoneStore.scrollBottom > 200">
				<TheClickable class="w-7 h-7 bg-gray-300 text-black rounded-full flex items-center justify-center pointer-events-auto" @click="infiniteZoneStore.scrollDown(true)">
					<icon name="material-symbols:arrow-downward-rounded" />
				</TheClickable>
			</div>
		</transition>

		<WritingStatus />
	</div>
</template>

<script setup lang="ts">

import MessageList from '~/components/MessageList.vue'
import WritingStatus from '~/components/WritingStatus.vue'
import TheClickable from '~/components/Clickable.vue'
import { onMounted, ref, watch } from 'vue'
import { useMessagesStore } from '~/store/messages'
import { useInfiniteZoneStore } from '~/store/infinite-zone'

const TRIGGER_MARGIN = 1000
const messagesStore = useMessagesStore()
const infiniteZoneStore = useInfiniteZoneStore()
const messageList = ref<HTMLElement>()

let observer: MutationObserver
let isMoreLoaderLocked = false

watch(() => infiniteZoneStore.scrollTop, scrollTop => {
	if (scrollTop > TRIGGER_MARGIN || isMoreLoaderLocked) {
		return
	}

	const $track = infiniteZoneStore.$track as HTMLElement

	isMoreLoaderLocked = true

	let scrollTopBefore: number, scrollHeightBefore: number

	messagesStore.loadMore(() => {
		scrollTopBefore = $track.scrollTop
		scrollHeightBefore = $track.scrollHeight
	}, () => {
		infiniteZoneStore.scrollTo(scrollTopBefore + $track.scrollHeight - scrollHeightBefore, false)
		setTimeout(() => isMoreLoaderLocked = false, 1000)
	})
})

onMounted(() => {
	infiniteZoneStore.bindTrackElement(window.document.documentElement)
	infiniteZoneStore.scrollDown()

	window.document.addEventListener('scroll', infiniteZoneStore.scrollListener)

	observer = new MutationObserver(() => infiniteZoneStore.arrivedBottom && infiniteZoneStore.scrollDown(true))
	observer.observe(messageList.value as HTMLElement, { childList: true })
})

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
