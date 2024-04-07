<template>
	<div class="min-h-screen flex flex-col relative font-mono">
		<ScreenSize />
		<TheHeader />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { useHead, useNuxtApp, watch } from '#imports'
import ScreenSize from '~/components/dev/ScreenSize.vue'
import TheHeader from '~/components/Header.vue'
import { useAfkDetection } from '~/composables/use-afk-detection'
import { useUserStore } from '~/store/user'

useHead({ htmlAttrs: { lang: 'ru-RU' } })

const userStore = useUserStore()

if (process.client) {
	const user = await userStore.getUser()
	const ratchet = useNuxtApp().$ratchet

	watch(
		useAfkDetection(),
		v => v ? ratchet.close() : ratchet.open(user),
		{ immediate: true }
	)
}

</script>
