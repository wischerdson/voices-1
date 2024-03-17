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

useHead({ htmlAttrs: { lang: 'ru-RU' } })

</script>
