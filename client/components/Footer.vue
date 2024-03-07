<template>
	<div class="fixed bottom-0 inset-x-0 z-20 bg-black">
		<transition>
			<div class="gradient absolute bottom-full inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" v-if="!arrivedState.bottom"></div>
		</transition>
		<div class="py-6 max-w-3xl mx-auto">
			<TextArea
				class="w-full resize-none max-h-72 bg-gray-900 px-5 py-2.5 leading-normal h-[46px] rounded-lg"
				:allow-shrink="true"
				placeholder="Сообщение..."
			></TextArea>
		</div>
	</div>
</template>

<script setup lang="ts">

import TextArea from '~/components/TextArea.vue'
import { onMounted, ref } from 'vue'
import { useScroll } from '@vueuse/core'

const $document = ref<Document>()

const { arrivedState } = useScroll($document)

onMounted(() => $document.value = document)

</script>

<style scoped lang="scss">

.gradient {
	&.v-enter-active, &.v-leave-active {
		transition: opacity .15s ease;
	}

	&.v-enter-from, &.v-leave-to {
		opacity: 0;
	}
}

</style>
