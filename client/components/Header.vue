<template>
	<div class="header bg-black fixed inset-x-0 top-0 z-20">
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

<style scoped lang="scss">

@supports (backdrop-filter: blur(18px)) {
	.header {
		background-color: rgba(#000, .5);
		backdrop-filter: blur(18px) saturate(1.5);
	}
}

</style>
