import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useInfiniteZoneStore = defineStore('infinite-zone', () => {
	const $track = ref<HTMLElement>()
	const onReadyCallbacks: (() => void)[] = []
	const scrollTop = ref(0)

	const scrollBottom = computed(() => {
		if (!$track.value) {
			return 0
		}

		return $track.value.scrollHeight - (scrollTop.value + $track.value.getBoundingClientRect().height)
	})

	const arrivedTop = computed(() => !scrollTop.value)
	const arrivedBottom = computed(() => !scrollBottom.value)

	const onReady = (cb: () => void) => {
		if ($track.value !== undefined) {
			return cb()
		}

		onReadyCallbacks.push(cb)
	}

	const scrollListener = () => scrollTop.value = ($track.value as HTMLElement).scrollTop

	const scrollDown = (smooth: boolean = false) => onReady(() => {
		const _$track = $track.value as HTMLElement

		_$track.scrollTo({
			top: _$track.scrollHeight,
			behavior: smooth ? 'smooth' : 'instant'
		})
	})

	const bindTrackElement = ($element: HTMLElement) => $track.value = $element

	const stopWatchHandler = watch($track, $v => {
		if ($v !== undefined) {
			onReadyCallbacks.forEach(cb => cb())
			stopWatchHandler()
		}
	})

	return {
		scrollTop, scrollBottom, arrivedTop, arrivedBottom,
		scrollDown, bindTrackElement, onReady, scrollListener,
	}
})
