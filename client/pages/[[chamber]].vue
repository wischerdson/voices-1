<template>
	<div>
		<div class="w-full max-w-3xl mx-auto px-4 relative">
			<div class="min-h-screen pt-14 pb-20 flex flex-col justify-end">
				<div class="justify-self-end pb-10" v-if="true">
					<span class="text-gray-500">Загрузка...</span>
				</div>
				<ClientOnly>
					<MessagesSpace />
				</ClientOnly>
			</div>
		</div>
		<div class="fixed inset-x-0 bottom-0 z-30">
			<WritingArea />
		</div>
	</div>
</template>

<script setup lang="ts">

import WritingArea from '~/components/Chat/WritingArea.vue'
import MessagesSpace from '~/components/Chat/MessagesSpace.vue'

if (process.client) {

}

// import { useMessagesStore } from '~/store/messages'
// import { onMounted, useHead, useRoute, useNuxtApp, watch, definePageMeta } from '#imports'
// import { storeToRefs } from 'pinia'

//
// import { useChatStore } from '~/store/chat'
// import { useAfkDetection } from '~/composables/use-afk-detection'
// import { useUserStore } from '~/store/user'
// import { useSoundsStore } from '~/store/sounds'

// useHead({ title: 'Чат - Void\'s voices' })

// useChatStore().setChamber(useRoute().params.chamber as string)

// const messagesStore = useMessagesStore()
// const { pending: messagesPending } = storeToRefs(messagesStore)

// const userStore = useUserStore()
// const soundsStore = useSoundsStore()

// if (process.client) {
// 	const user = await userStore.getUser()
// 	const ratchet = useNuxtApp().$ratchet

// 	watch(
// 		useAfkDetection(),
// 		v => v ? ratchet.close() : ratchet.open(user),
// 		{ immediate: true }
// 	)
// }

// onMounted(() => {
// 	soundsStore.defineSound('message-sent', '/sounds/message-sent.wav').volume = .5
// 	soundsStore.defineSound('message-recieved', '/sounds/message-recieved.wav').volume = .5

// 	messagesStore.fetch()
// })

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
