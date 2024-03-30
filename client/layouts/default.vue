<template>
	<div class="min-h-screen flex flex-col relative font-mono">
		<ScreenSize />
		<TheHeader />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { useHead, useNuxtApp, watchEffect } from '#imports'
import ScreenSize from '~/components/dev/ScreenSize.vue'
import TheHeader from '~/components/Header.vue'
import { useUserStore } from '~/store/user'
import { fetchUser } from '~/repositories/user'
import { storeToRefs } from 'pinia'

useHead({ htmlAttrs: { lang: 'ru-RU' } })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

process.client && userStore.setUser(await fetchUser())
process.client && watchEffect(() => user.value && useNuxtApp().$ratchet.open(user.value))

</script>
