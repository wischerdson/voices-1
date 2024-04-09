<template>
	<div class="min-h-full flex flex-col justify-end">
		<div ref="messageList">
			<MessageList />
		</div>

		<div class="writing text-xs text-gray-600 mt-6 sm:mb-4 sm:mt-4" :class="{ not: !writing }">
			<span>Кто-то скребется...</span>
		</div>
	</div>
</template>

<script setup lang="ts">

import MessageList from '~/components/MessageList.vue'
import { onMounted, ref, watch } from 'vue'
import { useMessagesStore } from '~/store/messages'
import { useNuxtApp } from '#app'
import { useInfiniteZoneStore } from '~/store/infinite-zone'

const TRIGGER_MARGIN = 500
const messagesStore = useMessagesStore()
const infiniteZoneStore = useInfiniteZoneStore()

const writing = ref(0)
const messageList = ref<HTMLElement>()
const ratchet = useNuxtApp().$ratchet

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
		isMoreLoaderLocked = false
	})
})

onMounted(() => {
	ratchet.listen('writing', (count: number) => {
		writing.value = count
	})

	infiniteZoneStore.bindTrackElement(window.document.documentElement)
	infiniteZoneStore.scrollDown()

	window.document.addEventListener('scroll', infiniteZoneStore.scrollListener)

	observer = new MutationObserver(() => infiniteZoneStore.arrivedBottom && infiniteZoneStore.scrollDown(true))
	observer.observe(messageList.value as HTMLElement, { childList: true })
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
