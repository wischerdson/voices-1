<template>
	<div class="overflow-y-scroll" ref="$scrollable">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { nextTick, ref, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessagesStore } from '~/store/messages'

const emit = defineEmits<{
	(e: 'loadMore', onBeforeUpdate: () => void): void
}>()
const props = withDefaults(defineProps<{ triggerMargin?: number }>(), { triggerMargin: 500 })

const $scrollable = ref<HTMLElement>()
let waiting = false

const onScroll = () => {
	const $el = $scrollable.value as HTMLElement

	if ($el.scrollTop > props.triggerMargin || waiting) {
		return
	}

	waiting = true

	let scrollTopBefore: number, scrollHeightBefore: number

	emit('loadMore', () => {
		scrollTopBefore = $el.scrollTop
		scrollHeightBefore = $el.scrollHeight

		nextTick(() => {
			$el.scrollTo({ top: scrollTopBefore + ($el.scrollHeight - scrollHeightBefore) })
			setTimeout(() => waiting = false, 100)
		})
	})
}

const { messages } = storeToRefs(useMessagesStore())

watch(messages, () => nextTick(() => {
	$scrollable.value?.scrollTo({ top: $scrollable.value?.scrollHeight })
	$scrollable.value?.addEventListener('scroll', onScroll)
}), { once: true })

onUnmounted(() => {
	$scrollable.value?.removeEventListener('scroll', onScroll)
})

</script>
