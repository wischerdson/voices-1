import { useRuntimeConfig } from '#app'
import { useWsServerDataStore } from '~/store/ws-server-data'

export const useWsConnection = () => {
	const url = useRuntimeConfig().public.wsServerUrl
	const store = useWsServerDataStore()

	const socket = new WebSocket(url)

	socket.onopen = (event) => {
		store.setSocket(socket)
		// store.setOnOpenEvent(event)

		socket.send(JSON.stringify({
			action: 'get_online'
		}))
	}

	socket.onmessage = (event) => {
		store.setOnMessageEvent(event)
		// console.log(event)
	}

	socket.onclose = () => {
		store.setSocket(null)
	}

	socket.onerror = (error) => {
		console.error('Какое-то говно в вебсокетах, чек: ', error)
	}

	const closeConnection = () => socket.close()

	return closeConnection
}
