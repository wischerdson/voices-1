<template>
	<div class="h-full w-full max-w-3xl mx-auto mt-4" @click="writing = !writing">
		<MessagesSpace />

		<div class="writing text-xs text-gray-600" :class="{ not: !writing }">
			<span>Кто-то скребется...</span>
		</div>
	</div>
</template>

<script setup lang="ts">

import { useHead, ref } from '#imports'
import MessagesSpace from '~/components/MessagesSpace.vue'

const writing = ref(false)

useHead({ title: 'Чат - Voices of the Void' })

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

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
