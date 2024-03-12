<template>
	<div class="w-full py-6 pr-10 flex flex-col items-start space-y-4 text-sm">
		<TheMessage :message="message" v-for="message in messages" :key="`message-${message.id}`" />
	</div>
</template>

<script setup lang="ts">

import TheMessage from '~/components/Message.vue'
import { useAsyncData, useFetch, useNuxtApp, useRuntimeConfig } from '#imports'
import { apiBaseUrl } from '~/utils/helpers'
import { onMounted, ref } from 'vue'

const { $echo } = useNuxtApp()

const { data: messages } = await useFetch('messages', {
	method: 'GET',
	baseURL: apiBaseUrl(),
	key: 'messages'
})

onMounted(() => {
	$echo
		.channel('messages')
		.listen('MessageSent', ({ message }: { message: Message }) => {
			messages.value.push(message)
		})
})

</script>
