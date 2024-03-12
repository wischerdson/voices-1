<template>
	<div class="flex flex-col items-start">
		<div class="mb-2 text-xs text-gray-600">{{ message.created_at }}</div>
		<div class="bg-gray-900 py-3 px-5 rounded-lg leading-normal">{{ message.text }}</div>
	</div>
</template>

<script setup lang="ts">

// import type { Message } from '~/components/MessagesSpace.vue'

defineProps<{ message: Message }>()

</script>
