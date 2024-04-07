<template>
	<div class="header bg-black">
		<div class="p-4 flex justify-between items-center max-w-3xl mx-auto">
			<TheLogo />
			<div class="h-full flex items-center">
				<div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
				<div class="text-sm">
					<span class="text-gray-600">Онлайн: </span>
					<span v-if="connectionsCount">{{ connectionsCount }}</span>
					<icon name="svg-spinners:90-ring-with-bg" :size="`19px`" v-else />
				</div>
			</div>
		</div>
		<!-- <transition>
			<div class="gradient absolute top-full inset-x-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" v-if="!arrivedState.top"></div>
		</transition> -->
	</div>
</template>

<script setup lang="ts">

import TheLogo from '~/components/Logo.vue'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/store/user'

const connectionsCount = ref(0)
const userStore = useUserStore()
const ratchet = useNuxtApp().$ratchet

process.client && ratchet.listen('online', (connections: number) => {
	connectionsCount.value = connections
})

process.client && ratchet.onOpen(async () => {
	const user = await userStore.getUser()
	ratchet.send('online', user.token)
})

</script>
