<template>
	<div class="w-full flex-1 flex flex-col">
		<div class="flex-1 relative">
			<div class="absolute inset-0 overflow-auto">
				<MessagesSpace class="max-w-3xl mx-auto px-4" />
			</div>
		</div>
		<div class="w-full max-w-3xl mx-auto px-4">
			<WritingArea />
		</div>
	</div>
</template>

<script setup lang="ts">

import { useHead, ref, onMounted, watch } from '#imports'
import { useScroll } from '@vueuse/core'
import { useMessagesStore } from '~/store/messages'
import WritingArea from '~/components/WritingArea.vue'
import MessagesSpace from '~/components/MessagesSpace.vue'

useHead({ title: 'Чат - Voices of the Void' })

const $document = ref<Document>()

const { arrivedState } = useScroll($document, { offset: { top: 200 } })

const messagesStore = useMessagesStore()

await messagesStore.fetch()

// watch(arrivedState, ({ top }) => top && messagesStore.loadMore())

onMounted(() => $document.value = document)

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

</style>
