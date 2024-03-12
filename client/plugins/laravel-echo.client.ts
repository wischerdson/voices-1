import { defineNuxtPlugin } from '#imports'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

export default defineNuxtPlugin(() => {
	const pusher = new Pusher('app-key', {
		wsHost: 'localhost',
		wsPort: 2007,
		forceTLS: false,
		disableStats: true,
		cluster: '',
		enabledTransports: ['ws']
	})

	const echo = new Echo({
		client: pusher,
		broadcaster: 'pusher'
	})

	return {
		provide: { echo }
	}
})
