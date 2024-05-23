import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useUserStore } from './user'

export const useScrollableTrackStore = defineStore('scrollable-track', () => {
	const onReadyCallbacks: (($track: HTMLElement) => void)[] = []
	const $track = ref<HTMLElement>()
	const scrollTop = ref(0)
	const scrollBottom = ref(0)
	const arrivedTop = ref(false)
	const arrivedBottom = ref(true)

	const onReady = (cb: ($track: HTMLElement) => void) => {
		if ($track.value !== undefined) {
			return cb($track.value)
		}

		onReadyCallbacks.push(cb)
	}

	const scrollListener = () => {
		if (!$track.value) {
			throw new Error('Track element is not bind')
		}

		scrollTop.value = $track.value.scrollTop
		scrollBottom.value = $track.value.getBoundingClientRect().bottom - window.innerHeight
		arrivedTop.value = !scrollTop.value
		arrivedBottom.value = !scrollBottom.value
	}

	const scrollTo = (scrollTop: number, smooth: boolean = false) => onReady($track => {
		const opts: ScrollToOptions = { top: scrollTop, behavior: smooth ? 'smooth' : 'instant' }
		const $_track = $track === window.document.body ? window : $track

		$_track.scrollTo(opts)
	})

	const scrollDown = (smooth: boolean = false) => onReady($track => {
		scrollTo($track.scrollHeight, smooth)
	})

	const bindTrackElement = ($element: HTMLElement) => $track.value = $element

	const stopWatchHandler = watch($track, $track => {
		if ($track !== undefined) {
			onReadyCallbacks.forEach(cb => cb($track as HTMLElement))
			stopWatchHandler()
		}
	})

	return {
		$track, scrollTop, scrollBottom, arrivedTop, arrivedBottom,
		scrollTo, scrollDown, bindTrackElement, onReady, scrollListener,
	}
})

export const useChatStore = defineStore('chat', async () => {
	const chamber = ref<string>('')
	const { chamber_participant: chamberParticipant } = await useUserStore().getUser()

	const setChamber = (c: string) => chamber.value = c
	const chamberGetter = computed(() => chamber.value)

	return { setChamber, chamber: chamberGetter, chamberParticipant }
})
