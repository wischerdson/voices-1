<template>
	<div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { ref, onUnmounted } from 'vue'
import { useInfiniteZoneStore } from '~/store/infinite-zone'
import { onMounted } from 'vue';
import { watch } from 'vue';

const emit = defineEmits<{
	(e: 'loadMore', onBeforeUpdate: () => void, onAfterUpdate: () => void): void
}>()

const TRIGGER_MARGIN = 500

onMounted(() => {
	console.log(window.document.body)
})

// const infiniteZoneStore = useInfiniteZoneStore()

// const $scrollable = ref<HTMLElement>()
// let waiting = true
// let observer: MutationObserver

// watch(() => infiniteZoneStore.scrollTop, scrollTop => {
// 	const $track = $scrollable.value as HTMLElement

// 	if (scrollTop > props.triggerMargin || waiting) {
// 		return
// 	}

// 	waiting = true

// 	let scrollTopBefore: number, scrollHeightBefore: number

// 	emit('loadMore', () => {
// 		scrollTopBefore = document.body.scrollTop
// 		scrollHeightBefore = $track.scrollHeight
// 	}, () => {
// 		window.document.body.scrollTo({ top: scrollTopBefore + ($track.scrollHeight - scrollHeightBefore) })
// 		setTimeout(() => waiting = false, 1000)
// 	})
// })

// const heightChanged = () => {
// 	infiniteZoneStore.arrivedBottom && infiniteZoneStore.scrollDown(true)
// }

// onMounted(() => {
// 	$scrollable.value = window.document.body

// 	if ($scrollable.value) {
// 		infiniteZoneStore.bindTrackElement($scrollable.value)
// 		window.document.addEventListener('scroll', infiniteZoneStore.scrollListener)
// 		infiniteZoneStore.scrollDown()

// 		observer = new MutationObserver(heightChanged)
// 		observer.observe($scrollable.value as HTMLElement, { attributes: true, childList: true, subtree: true })
// 	}
// })

// onUnmounted(() => {
// 	if ($scrollable.value) {
// 		$scrollable.value.removeEventListener('scroll', infiniteZoneStore.scrollListener)
// 	}

// 	observer.disconnect()
// })

</script>
