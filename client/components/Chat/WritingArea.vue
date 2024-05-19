<template>
	<div class="bg-black p-4 sm:py-3 max-w-3xl mx-auto flex space-x-4 items-end">
		<TextArea
			class="flex-1 resize-none max-h-72 bg-gray-900 px-5 py-2.5 leading-normal h-[46px] rounded-lg"
			:allow-shrink="true"
			@keydown="handleKeyDown"
			v-model="message"
			placeholder="Сообщение..."
		></TextArea>
		<TheClickable class="bg-gray-900 sm:bg-black/0 sm:w-[26px] w-[46px] h-[46px] rounded-full" @click="sendMessage" :style="{ opacity: message ? '' : '.7' }">
			<icon name="svg-spinners:90-ring-with-bg" :size="`26px`" v-if="sending" />
			<icon class="ml-1 sm:ml-0" name="material-symbols:send-rounded" size="26px" v-else />
		</TheClickable>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useMessagesStore } from '~/store/messages'
import TextArea from '~/components/TextArea.vue'
import TheClickable from '~/components/Clickable.vue'
import { watch } from 'vue'
import { useNuxtApp } from '#app'
import isMobile from 'is-mobile'

const messagesStore = useMessagesStore()
const message = ref('')
const sending = ref(false)
const writing = ref(false)
const ratchet = useNuxtApp().$ratchet

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && !event.shiftKey && !isMobile()) {
		event.preventDefault()

		sendMessage()
	}
}

let timeout: NodeJS.Timeout

watch(message, () => {
	writing.value = true
	clearTimeout(timeout)
	timeout = setTimeout(() => writing.value = false, 1000)
})

watch(writing, v => process.client && ratchet.send('writing', +v))

const sendMessage = () => {
	if (!message.value || sending.value) {
		return
	}

	sending.value = true

	const textBackup = message.value

	message.value = ''

	messagesStore.send(textBackup)
		.catch(e => {
			message.value = textBackup

			throw new Error('Произошла ошибка при отправке сообщения, чек: ', e)
		})
		.finally(() => {
			sending.value = false
		})
}

</script>
