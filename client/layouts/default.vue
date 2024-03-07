<template>
	<div class="min-h-screen flex flex-col justify-end relative pt-14 pb-24 font-mono">
		<ScreenSize />
		<TheHeader />
		<slot></slot>
		<TheFooter />
	</div>
</template>

<script setup lang="ts">

import { useHead } from '#imports'
import ScreenSize from '~/components/dev/ScreenSize.vue'
import TheHeader from '~/components/Header.vue'
import TheFooter from '~/components/Footer.vue'

useHead({ htmlAttrs: { lang: 'ru-RU' } })

</script>
