<template>
	<div class="w-full flex-1 flex flex-col">
		<div class="flex-1 relative">
			<InfiniteScrollZone class="absolute inset-0" @loadMore="loadMore">
				<MessagesSpace class="max-w-3xl mx-auto px-4" />
			</InfiniteScrollZone>
		</div>
		<div class="w-full max-w-3xl mx-auto px-4">
			<WritingArea />
		</div>
	</div>
</template>

<script setup lang="ts">

import { useMessagesStore } from '~/store/messages'
import { useHead } from '#imports'
import WritingArea from '~/components/WritingArea.vue'
import MessagesSpace from '~/components/MessagesSpace.vue'
import InfiniteScrollZone from '~/components/InfiniteScrollZone.vue'

useHead({ title: 'Чат - Voices of the Void' })

const messagesStore = useMessagesStore()

await messagesStore.fetch()

const loadMore = (onBeforeUpdate: () => void, onAfterUpdate: () => void) => {
	messagesStore.loadMore(onBeforeUpdate)?.finally(onAfterUpdate)
}

</script>

<style lang="scss">

body {
	background-color: #000;
	color: #fff;
}

</style>
