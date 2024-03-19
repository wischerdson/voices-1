<template>
	<div class="py-6 max-w-3xl mx-auto flex space-x-4 items-end">
		<TextArea
			class="flex-1 resize-none max-h-72 bg-gray-900 px-5 py-2.5 leading-normal h-[46px] rounded-lg"
			:allow-shrink="true"
			@keydown="handleKeyDown"
			v-model="message"
		></TextArea>
		<TheClickable class="bg-gray-900 w-[46px] h-[46px] rounded-full" @click="sendMessage" :style="{ opacity: message ? '' : '.7' }">
			<icon name="svg-spinners:90-ring-with-bg" :size="`26px`" v-if="sending" />
			<icon class="ml-1" name="material-symbols:send-rounded" size="26px" v-else />
		</TheClickable>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useMessagesStore } from '~/store/messages'
import TextArea from '~/components/TextArea.vue'
import TheClickable from '~/components/Clickable.vue'

const messagesStore = useMessagesStore()
const message = ref('')
const sending = ref(false)

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault()

		sendMessage()
	}
}

const sendMessage = () => {
	if (!message.value || sending.value) {
		return
	}

	sending.value = true

	messagesStore.send(message.value)
		.then(() => {
			message.value = ''
		})
		.finally(() => {
			sending.value = false
		})
}

</script>
