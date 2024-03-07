<template>
	<div class="text-sm">
		<div class="mb-2 text-xs text-gray-600">{{ date }}</div>
		<div class="bg-gray-900 py-3 px-5 rounded-lg leading-normal">{{ message }}</div>
	</div>
</template>

<script setup lang="ts">

defineProps<{
	message: string,
	date: string
}>()

</script>
