<template>
	<div class="message-reactions flex relative mt-1" :class="[isMine ? 'align-right' : 'align-left' ]">
		<TheClickable class="reactions-button" @click="showReactions = true">
			<div class="no-reactions flex" :class="{ show: showNoReactionsButton }">
				<div class="emoji z-20">🩷</div>
				<div class="emoji z-10">🤬</div>
				<div class="emoji z-0">😂</div>
			</div>
			<!-- <div class="existing-reactions h-7 flex items-start text-xs space-x-2">
				<div class="flex items-center">
					<div class="mr-1">👍</div>
					<div class="text-gray-500">5</div>
				</div>
				<div class="flex items-center">
					<div class="mr-1">🤬</div>
					<div class="text-gray-500">2</div>
				</div>
			</div> -->
		</TheClickable>

		<transition>
			<div class="reactions-menu absolute w-[246px] top-0 z-30" v-click-outside="() => showReactions = false" v-if="showReactions">
				<div class="flex flex-wrap text-2xl bg-black border border-white/10 p-0.5 rounded-xl">
					<TheClickable
						class="reaction rounded-full flex items-center justify-center w-10 h-10"
						:class="{ active: key == 'fuck' }"
						v-for="(reaction, key) in reactions"
					>{{ reaction }}</TheClickable>
				</div>
			</div>
		</transition>
	</div>
	<!-- <div class="message-reactions">
		<TheClickable class="reactions-button text-sm">
			<div class="flex">
				<div class="bg-gray-900 border-2 border-black relative flex items-center justify-center w-7 h-7 z-20 translate-x-[1.7rem] rounded-full">🩷</div>
				<div class="bg-gray-900 border-2 border-black relative flex items-center justify-center w-7 h-7 z-10 translate-x-[.8rem] rounded-full">🤬</div>
				<div class="bg-gray-900 border-2 border-black relative flex items-center justify-center w-7 h-7 translate-x-0 rounded-full">😂</div>
			</div>

		</TheClickable>

	</div> -->
</template>

<script setup lang="ts">

import { ref } from 'vue'
import TheClickable from '~/components/Clickable.vue'

defineProps<{
	isMine: boolean
	showNoReactionsButton: boolean
}>()

const showReactions = ref(false)

const reactions = {
	like: '👍',
	dislike: '👎',
	lol: '😂',
	sad: '😢',
	crying: '😭',
	fuck: '🤬',
	nyam: '😋',
	please: '🙏',
	belissimo: '🤌',
	fuckyou: '🖕',
	ok: '✅',
	love: '🩷',
}

</script>

<style scoped lang="scss">

.message-reactions {
	&.align-left {
		justify-content: flex-start;

		.no-reactions {
			.emoji {
				&:nth-child(2) {
					transform: translateX(-8px);
				}
				&:nth-child(3) {
					transform: translateX(-16px);
				}
			}

			&.show {
				.emoji {
					&:nth-child(2) {
						transform: translateX(-12px);
					}
					&:nth-child(3) {
						transform: translateX(-24px);
					}
				}
			}
		}

		.reactions-menu {
			left: 0;

			&.v-enter-from, &.v-leave-to {
				opacity: 0;
				transform: scale(.75) translateX(-48px) translateY(-20px);
			}
		}
	}

	&.align-right {
		justify-content: flex-end;

		.no-reactions {
			.emoji {
				&:nth-child(1) {
					transform: translateX(16px);
				}
				&:nth-child(2) {
					transform: translateX(8px);
				}
			}

			&.show {
				.emoji {
					&:nth-child(1) {
						transform: translateX(24px);
					}
					&:nth-child(2) {
						transform: translateX(12px);
					}
				}
			}
		}

		.reactions-menu {
			right: 0;

			&.v-enter-from, &.v-leave-to {
				opacity: 0;
				transform: scale(.75) translateX(48px) translateY(-20px);
			}
		}
	}
}

.no-reactions {
	transition: opacity .25s ease;
	opacity: 0;

	&.show {
		opacity: 1;
	}

	.emoji {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: theme('colors.gray.800');
		border: 2px solid #000;
		position: relative;
		transition: transform .25s ease;
	}
}

.reactions-menu {
	&.v-enter-active, &.v-leave-active {
		transition: opacity .15s ease, transform .15s ease;
	}

	.reaction.active {
		// border: 1px solid theme('colors.gray.600');
		background-color: theme('colors.gray.800');
	}
}

// .suggest-reactions {
// 		opacity: 0;
// 		transition: opacity .2s ease;
// 		cursor: pointer;

// 		&.active {
// 			opacity: .8;
// 		}
// 	}

// 	&:hover {
// 		.suggest-reactions {
// 			transform: translateX(0);
// 			opacity: .8;
// 		}
// 	}



// .reaction {
// 	border-radius: 999px;
// 	transition: background-color .15s ease, filter .15s ease;

// 	&:hover {
// 		background-color: rgba(#fff, 10%);
// 		filter: grayscale(0);
// 	}
// }

</style>
