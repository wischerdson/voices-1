<template>
	<div>
		<div class="w-full max-w-3xl mx-auto px-4 relative">
			<div class="min-h-screen pt-14 pb-20 flex flex-col justify-end">
				<MessagesSpace />
			</div>
		</div>
		<div class="fixed inset-x-0 bottom-0 z-30">
			<WritingArea />
		</div>
	</div>
</template>

<script setup lang="ts">

import { useHead } from '#imports'
import WritingArea from '~/components/Chat/WritingArea.vue'
import MessagesSpace from '~/components/Chat/MessagesSpace.vue'
import { useSoundsStore } from '~/store/sounds'

useHead({ title: 'Чат - Void\'s voices' })

const initSounds = () => {
	const soundsStore = useSoundsStore()

	soundsStore.defineSound('message-sent', '/sounds/message-sent.wav').volume = .4
	soundsStore.defineSound('message-recieved', '/sounds/message-recieved.wav').volume = .4
}

if (process.client) {
	initSounds()
}

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

.gradient {
	&.v-enter-active, &.v-leave-active {
		transition: opacity .25s ease;
	}

	&.v-enter-from, &.v-leave-to {
		opacity: 0;
	}
}



</style>
