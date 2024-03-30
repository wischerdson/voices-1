import { defineNuxtPlugin } from '#imports'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

export default defineNuxtPlugin(app => {
	const pusher = new Pusher('app-key', {
		wsHost: app.$config.public.pusherHost,
		wsPort: +app.$config.public.pusherPort,
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
