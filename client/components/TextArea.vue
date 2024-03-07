<template>
	<textarea
		v-uid
		ref="$textarea"
		v-bind="attrs"
		v-model="model"
	></textarea>
</template>

<script setup lang="ts">

import { useAttrs, onMounted, onUnmounted, ref } from '#imports'

const attrs = useAttrs()

const model = defineModel<string>()

const props = withDefaults(defineProps<{
	modelValue?: string
	autoHeight?: boolean
	allowShrink?: boolean
}>(), {
	autoHeight: true,
	allowShrink: false
})

const $textarea = ref<HTMLElement>()

const setHeight = () => {
	const tx = ($textarea.value as HTMLElement)

	if (tx.scrollHeight > tx.offsetHeight || props.allowShrink) {
		tx.style.height = '0'
		tx.style.height = `${tx.scrollHeight + 2}px`
	}
}

onMounted(() => {
	$textarea.value?.addEventListener('input', setHeight)
})

onUnmounted(() => {
	$textarea.value?.removeEventListener('input', setHeight)
})

</script>
