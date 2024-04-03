<template>
	<div class="message-reactions">
		<TheClickable class="reactions-button absolute z-10 -bottom-3 right-3" @click="showMenu = true">
			<div class="no-reactions flex" :class="{ show: showMenuButton }">
				<div class="emoji z-20">🩷</div>
				<div class="emoji z-10">🤬</div>
				<div class="emoji z-0">😂</div>
			</div>
		</TheClickable>

		<ul class="reactions-list flex flex-wrap text-xs gap-1 pt-2 max-w-80" :class="{ mute: showMenuButton || showMenu }">
			<li
				class="reaction-item flex items-center rounded-full bg-black px-2 h-6" v-for="(count, reactionName) in message.reactions"
				:class="{ mine: message.my_reaction === reactionName }"
			>
				<div class="mr-1">{{ reactions[reactionName] }}</div>
				<div class="count text-gray-500">{{ count }}</div>
			</li>
		</ul>

		<transition>
			<div class="reactions-menu absolute w-[246px] top-full -mt-3 right-3 z-30" v-click-outside="() => showMenu = false" v-if="showMenu">
				<div class="flex flex-wrap text-2xl bg-gray-950 p-0.5 rounded-xl">
					<TheClickable
						class="reaction rounded-full flex items-center justify-center w-10 h-10"
						:class="{ active: reactionName == message.my_reaction }"
						v-for="(reaction, reactionName) in reactions"
						@click="selectReaction(reactionName)"
						:key="`reaction-${reactionName}`"
					>{{ reaction }}</TheClickable>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">

import type { Message } from '~/store/messages'
import { ref } from 'vue'
import TheClickable from '~/components/Clickable.vue'

defineProps<{
	showMenuButton: boolean
	message: Message
}>()

const emit = defineEmits<{
	(e: 'reacted', reaction: string): void
}>()

const showMenu = ref(false)

const reactions: { [key: string]: string } = {
	like: '👍',
	dislike: '👎',
	lol: '😂',
	sad: '😢',
	crying: '😭',
	fuck: '🤬',
	wow: '🤯',
	please: '🙏',
	belissimo: '🤌',
	fuckyou: '🖕',
	ok: '✅',
	love: '🩷'
}

const selectReaction = (reactionName: string | number) => {
	showMenu.value = false
	emit('reacted', `${reactionName}`)
}

</script>

<style scoped lang="scss">

.message-reactions {
	justify-content: flex-end;
}

.reactions-list {
	.reaction-item {
		&.mine {
			background-color: theme('colors.gray.700');

			.count {
				color: #fff;
			}
		}
	}
}

.no-reactions {
	transition: opacity .25s ease;
	opacity: 0;

	.emoji {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: theme('colors.gray.950');
		position: relative;
		transition: transform .25s ease;

		&:nth-child(1) {
			transform: translateX(16px);
		}
		&:nth-child(2) {
			transform: translateX(8px);
		}
	}

	&.show {
		opacity: 1;

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
	&.v-enter-from, &.v-leave-to {
		opacity: 0;
		transform: scale(.75) translateX(48px) translateY(-20px);
	}

	&.v-enter-active, &.v-leave-active {
		transition: opacity .15s ease, transform .15s ease;
	}

	.reaction.active {
		background-color: theme('colors.gray.800');
	}
}

</style>
