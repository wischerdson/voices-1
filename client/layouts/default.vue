<template>
	<div class="min-h-screen flex flex-col relative font-mono">
		<ScreenSize />
		<TheHeader />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">

import { useHead } from '#imports'
import ScreenSize from '~/components/dev/ScreenSize.vue'
import TheHeader from '~/components/Header.vue'
import { useUserStore } from '~/store/user'
import { fetchUser } from '~/repositories/user'

useHead({ htmlAttrs: { lang: 'ru-RU' } })

process.client && useUserStore().setUser(await fetchUser())

</script>
