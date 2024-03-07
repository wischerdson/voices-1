<template>
	<div class="fixed top-0 inset-x-0 z-20 bg-black">
		<div class="py-4 flex justify-between max-w-3xl mx-auto">
			<TheLogo />
			<div class="h-full flex items-center">
				<div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
				<div class="text-sm">
					<span class="text-gray-600">Онлайн: </span>
					<span>5</span>
				</div>
			</div>
		</div>
		<div class="absolute top-full inset-x-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
	</div>
</template>

<script setup lang="ts">

import TheLogo from '~/components/Logo.vue'

</script>
