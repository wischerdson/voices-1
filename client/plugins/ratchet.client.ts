import type { User } from '~/store/user'
import { defineNuxtPlugin } from '#imports'

type ListenerCb<T> = (payload: T) => void

export default defineNuxtPlugin((app) => {
	const RATCHET_URL = app.$config.public.ratchetUrl

	let socket: WebSocket
	let pingPongInterval: NodeJS.Timeout | undefined = undefined
	const onMessageListeners: { [type: string]: ListenerCb<any>[] } = {}
	const onOpenListeners: ListenerCb<void>[] = []
	const onCloseListeners: ListenerCb<void>[] = []

	const ratchet = {
		listen<T = void>(type: string, callback: ListenerCb<T>) {
			if (!(type in onMessageListeners)) {
				onMessageListeners[type] = []
			}

			onMessageListeners[type].push(callback)
		},
		onOpen(callback: ListenerCb<void>) {
			onOpenListeners.push(callback)
		},
		onClose(callback: ListenerCb<void>) {
			onCloseListeners.push(callback)
		},
		send(type: string, payload?: unknown) {
			if (socket.readyState !== socket.OPEN) {
				throw new Error('Websocket connection is not open')
			}

			socket.send(JSON.stringify({ type, payload }))
		},
		open({ id: userId, token: userToken }: User) {
			if (socket && socket.readyState !== socket.CLOSED) {
				return
			}

			socket = new WebSocket(`${RATCHET_URL}/client/${userId}:${userToken}`)

			socket.onerror = error => {
				console.error('Какое-то говно в вебсокетах, чек: ', error)
			}

			socket.onmessage = event => {
				const data = JSON.parse(event.data)

				if ('type' in data && data.type in onMessageListeners) {
					onMessageListeners[data.type].forEach(
						// @ts-ignore
						l => 'payload' in data ? l(data.payload) : l()
					)
				}
			}

			socket.onopen = () => onOpenListeners.forEach(l => l())
			socket.onclose = () => onCloseListeners.forEach(l => l())

			pingPongInterval = setInterval(() => ratchet.send('ping'), 26000)
			ratchet.onClose(() => clearInterval(pingPongInterval))
		},
		close() {
			socket.close()
		}
	}

	return {
		provide: { ratchet }
	}
})
