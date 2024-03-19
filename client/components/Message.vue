<template>
	<div class="flex flex-col items-start">
		<div class="relative">
			<div class="message bg-gray-900 py-3 pl-5 rounded-lg leading-normal whitespace-pre-line text-sm relative pr-14" >
				<span>{{ message.text }}</span>
				<div class="absolute inset-y-0 flex items-end pb-4 bottom-0 right-0 pr-2.5">
					<span class="text-xs text-gray-700 font-light">{{ date }}</span>
					<div
						class="suggest-reactions text-2xs absolute bottom-0 right-0 opacity-80 p-1"
						:class="{ active: showReactions }"
						@click.stop="showReactions = true"
					>👍👎</div>
				</div>
			</div>
			<transition>
				<div class="reactions absolute top-full right-0 z-10" v-if="showReactions">
					<div class="absolute -translate-x-1/2 bg-black border border-white/10 p-0.5 rounded-full" ref="$reactions">
						<div class="flex items-center text-2xl">
							<TheClickable class="reaction flex items-center justify-center w-10 h-10" v-for="reaction in reactions">{{ reaction }}</TheClickable>
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div class="flex items-center text-xs space-x-2 mt-1 mb-2">
			<div class="flex items-center">
				<div class="mr-1">👍</div>
				<div class="text-gray-500">5</div>
			</div>
			<div class="flex items-center">
				<div class="mr-1">🤬</div>
				<div class="text-gray-500">2</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import type { Message } from '~/store/messages'
import { timestampToTime } from '~/utils/date'
import { computed, ref, onUnmounted } from 'vue'
import TheClickable from '~/components/Clickable.vue'
import { clickOutside } from '~/utils/helpers'

const props = defineProps<{ message: Message }>()

const showReactions = ref(false)
const $reactions = ref<HTMLElement>()
const date = computed(() => timestampToTime(props.message.created_at))

const destroyClickOutside = clickOutside($reactions, () => showReactions.value = false).destroy

onUnmounted(() => {
	destroyClickOutside()
})

const reactions = {
	like: '👍',
	dislike: '👎',
	lol: '😂',
	crying: '😭',
	fuck: '🤬',
	please: '🙏',
	belissimo: '🤌',
	love: '🩷'
}

</script>

<style scoped lang="scss">

.message {
	.suggest-reactions {
		opacity: 0;
		transition: opacity .2s ease;
		cursor: pointer;

		&.active {
			opacity: .8;
		}
	}

	&:hover {
		.suggest-reactions {
			transform: translateX(0);
			opacity: .8;
		}
	}
}

.reactions {
	&.v-enter-active, &.v-leave-active {
		transition: opacity .15s ease, transform .15s ease;
	}

	&.v-enter-from, &.v-leave-to {
		opacity: 0;
		transform: scale(.75);
	}
}

.reaction {
	border-radius: 999px;
	transition: background-color .15s ease, filter .15s ease;

	&:hover {
		background-color: rgba(#fff, 10%);
		filter: grayscale(0);
	}
}

</style>
