<template>
	<div class="header bg-black">
		<div class="p-4 flex justify-between max-w-3xl mx-auto">
			<TheLogo />
			<div class="h-full flex items-center">
				<div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
				<div class="text-sm">
					<span class="text-gray-600">Онлайн: </span>
					<!-- <span v-if="wsStore.data && wsStore.data.type === 'online'">
						<span>{{ wsStore.data.payload.online }}</span>
					</span> -->
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
import { onMounted, ref } from 'vue'
import { useScroll } from '@vueuse/core'
import { useNuxtApp } from '#app'
// import { useWsServerDataStore } from '~/store/ws-server-data'

// const wsStore = useWsServerDataStore()

const $document = ref<Document>()

const { arrivedState } = useScroll($document)

onMounted(() => {
	$document.value = document

	// $echo
	// 	.channel('online')
	// 	.listen('ConnectionsCountChanged', function (e) {
	// 		console.log(e)
	// 	})
		// .join('online')
		// // .join('online')
		// // .join('online')
		// // .here((users) => {
		// // 	console.log(users)
		// // })
		// .joining(() => {
		// 	console.log('Joining')
		// })
})

</script>

<style scoped lang="scss">

.gradient {
	&.v-enter-active, &.v-leave-active {
		transition: opacity .15s ease;
	}

	&.v-enter-from, &.v-leave-to {
		opacity: 0;
	}
}

</style>
