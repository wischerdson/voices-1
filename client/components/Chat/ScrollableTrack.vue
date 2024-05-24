<template>
	<div ref="$track">
		<slot></slot>

		<transition>
			<div class="to-down-btn fixed bottom-20 z-10 inset-x-0 max-w-3xl mx-auto px-4 pointer-events-none flex justify-end pr-6 pb-6" v-if="store.scrollBottom > 200">
				<TheClickable class="w-7 h-7 bg-gray-300 text-black rounded-full flex items-center justify-center pointer-events-auto" @click="store.scrollDown(true)">
					<icon name="material-symbols:arrow-downward-rounded" />
				</TheClickable>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">

import { nextTick, onMounted, ref, watch } from 'vue'
import { useScrollableTrackStore } from '~/store/chat'
import TheClickable from '~/components/Clickable.vue'

const props = defineProps<{ loader: () => false | Promise<unknown> }>()

const TRIGGER_MARGIN = 1000
const store = useScrollableTrackStore()
const $track = ref<HTMLElement>()

let observer: MutationObserver

watch(() => store.scrollTop, async scrollTop => {
	if (scrollTop > TRIGGER_MARGIN) {
		return
	}

	const $track = store.$track as HTMLElement

	await props.loader()

	const scrollTopBefore = $track.scrollTop
	const scrollHeightBefore = $track.scrollHeight

	await nextTick()

	store.scrollTo(scrollTopBefore + $track.scrollHeight - scrollHeightBefore)
})

onMounted(() => {
	store.bindTrackElement(window.document.documentElement)
	store.scrollDown()

	window.document.addEventListener('scroll', store.scrollListener)

	observer = new MutationObserver(() => store.arrivedBottom && store.scrollDown(true))
	observer.observe($track.value as HTMLElement, { childList: true })
})

</script>

<style scoped lang="scss">

.to-down-btn {
	&.v-enter-from, &.v-leave-to {
		opacity: 0;
		transform: translateY(20px);
	}

	&.v-enter-active, &.v-leave-active {
		transition: opacity .25s ease, transform .25s ease;
	}
}

</style>
