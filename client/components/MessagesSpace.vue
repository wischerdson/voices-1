<template>
	<div class="min-h-full flex flex-col justify-end">
		<div ref="messageList">
			<MessageList />
		</div>

		<WritingStatus />
	</div>
</template>

<script setup lang="ts">

import MessageList from '~/components/MessageList.vue'
import WritingStatus from '~/components/WritingStatus.vue'
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
