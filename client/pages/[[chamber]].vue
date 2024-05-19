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

import { useSoundsStore } from '~/store/sounds'
import { useChatStore } from '~/store/chat'
import { useUserStore } from '~/store/user'
import { useHead, useRoute } from '#imports'
import WritingArea from '~/components/Chat/WritingArea.vue'
import MessagesSpace from '~/components/Chat/MessagesSpace.vue'

useHead({ title: 'Чат - Void\'s voices' })

const userStore = useUserStore()
useChatStore().setChamber(useRoute().params.chamber as string)

const initSounds = () => {
	const soundsStore = useSoundsStore()

	soundsStore.defineSound('message-sent', '/sounds/message-sent.wav').volume = .5
	soundsStore.defineSound('message-recieved', '/sounds/message-recieved.wav').volume = .5
}

if (process.client) {
	initSounds()
	userStore.defineUser()
}

// import { useMessagesStore } from '~/store/messages'
// import { onMounted, useHead, useRoute, useNuxtApp, watch, definePageMeta } from '#imports'
// import { storeToRefs } from 'pinia'

//
//
// import { useAfkDetection } from '~/composables/use-afk-detection'
//


//

//

// const messagesStore = useMessagesStore()
// const { pending: messagesPending } = storeToRefs(messagesStore)

// const userStore = useUserStore()
//

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
//
//

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
