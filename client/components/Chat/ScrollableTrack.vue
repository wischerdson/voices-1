<template>
	<div ref="$track">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { nextTick, onMounted, ref, watch } from 'vue'
import { useMessagesStore } from '~/store/messages'
import { useScrollableTrackStore } from '~/store/chat'

const TRIGGER_MARGIN = 1000
const messagesStore = useMessagesStore()
const store = useScrollableTrackStore()
const $track = ref<HTMLElement>()

let observer: MutationObserver

watch(() => store.scrollTop, async scrollTop => {
	if (scrollTop > TRIGGER_MARGIN) {
		return
	}

	const $track = store.$track as HTMLElement

	await messagesStore.load()

	const scrollTopBefore = $track.scrollTop
	const scrollHeightBefore = $track.scrollHeight

	await nextTick()

	store.scrollTo(scrollTopBefore + $track.scrollHeight - scrollHeightBefore, false)
})

onMounted(() => {
	store.bindTrackElement(window.document.documentElement)
	store.scrollDown()

	window.document.addEventListener('scroll', store.scrollListener)

	observer = new MutationObserver(() => store.arrivedBottom && store.scrollDown(true))
	observer.observe($track.value as HTMLElement, { childList: true })
})

</script>
