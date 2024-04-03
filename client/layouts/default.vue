<template>
	<div class="min-h-screen flex flex-col relative font-mono">
		<ScreenSize />
		<TheHeader />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { useHead, useNuxtApp } from '#imports'
import ScreenSize from '~/components/dev/ScreenSize.vue'
import TheHeader from '~/components/Header.vue'
import { useUserStore } from '~/store/user'

useHead({ htmlAttrs: { lang: 'ru-RU' } })

const userStore = useUserStore()

if (process.client) {
	const user = await userStore.getUser()
	useNuxtApp().$ratchet.open(user)
}

</script>
