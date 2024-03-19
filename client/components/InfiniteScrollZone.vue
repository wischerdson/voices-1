<template>
	<div class="overflow-y-scroll" ref="$scrollable">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
	(e: 'loadMore', onBeforeUpdate: () => void, onAfterUpdate: () => void): void
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
	}, () => {
		$el.scrollTo({ top: scrollTopBefore + ($el.scrollHeight - scrollHeightBefore) })
		setTimeout(() => waiting = false, 100)
	})
}

onMounted(() => {
	$scrollable.value?.scrollTo({ top: $scrollable.value.scrollHeight })
	$scrollable.value?.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
	$scrollable.value?.removeEventListener('scroll', onScroll)
})

</script>
