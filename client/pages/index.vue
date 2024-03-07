<template>
	<div class="max-w-3xl mx-auto font-mono">
		<div class="py-6 pr-10 flex flex-col justify-end items-start space-y-4">
			<TheMessage date="11 апреля, 15:14" message="Lorem, ipsum dolor sit" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
			<TheMessage date="12 апреля, 15:14" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad rerum saepe possimus esse ratione voluptatem exercitationem voluptatum nisi quod, eum eius dicta ducimus voluptate amet ipsa temporibus totam, corporis iste?" />
		</div>
	</div>
</template>

<script setup lang="ts">

import { useHead } from '#imports'

import TheMessage from '~/components/Message.vue'

useHead({ title: 'Чат - Voices of the Void' })

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

</style>
