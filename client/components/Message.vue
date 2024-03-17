<template>
	<div class="flex flex-col items-start">
		<div class="mb-2 text-xs text-gray-600">{{ date }}</div>
		<div class="bg-gray-900 py-3 px-5 rounded-lg leading-normal whitespace-pre-line text-sm">{{ message.text }}</div>
	</div>
</template>

<script setup lang="ts">

import type { Message } from '~/store/messages'
import { timestampToTime } from '~/utils/date'
import { computed } from 'vue'

const props = defineProps<{ message: Message }>()

const date = computed(() => timestampToTime(props.message.created_at))

</script>
