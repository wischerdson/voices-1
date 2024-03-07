<template>
	<div class="h-screen flex flex-col max-w-3xl mx-auto font-mono">
		<div class="py-4 flex justify-between">
			<TheLogo />
			<div class="h-full flex items-center">
				<div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
				<div class="text-sm">
					<span class="text-gray-600">Онлайн: </span>
					<span>5</span>
				</div>
			</div>
		</div>
		<div class="flex-1 relative overflow-hidden">
			<div class="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
			<div class="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
			<div class="overflow-auto h-full">
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
		</div>
		<div class="py-6">
			<TextArea
				class="w-full resize-none max-h-72 bg-gray-900 px-5 py-2.5 leading-normal h-[46px] rounded-lg"
				:allow-shrink="true"
				placeholder="Сообщение..."
			></TextArea>
		</div>
	</div>
</template>

<script setup lang="ts">

import { useHead } from '#imports'
import TheLogo from '~/components/Logo.vue'
import TheMessage from '~/components/Message.vue'
import TextArea from '~/components/TextArea.vue'

useHead({ title: 'Чат - Voices of the Void' })

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

</style>
