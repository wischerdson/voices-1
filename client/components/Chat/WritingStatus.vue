<template>
	<div class="writing text-xs text-gray-600 mt-6 sm:mb-4 sm:mt-4" :class="{ not: !writing }">
		<span>Кто-то скребется...</span>
	</div>
</template>

<script setup lang="ts">

import { useNuxtApp } from '#app'
import { onMounted, ref } from 'vue'

const ratchet = useNuxtApp().$ratchet
const writing = ref(0)

onMounted(() => {
	ratchet.listen('writing', (count: number) => {
		writing.value = count
	})
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
