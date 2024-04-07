<template>
	<div class="message-reactions">
		<TheClickable class="reactions-button absolute z-10 -bottom-3 right-3" @click="showMenu = true">
			<div class="no-reactions flex" :class="{ show: showMenuButton }">
				<div class="emoji z-20">
					<img class="w-4 h-4 object-contain" src="/images/emoji/love.png" alt="">
				</div>
				<div class="emoji z-10">
					<img class="w-4 h-4 object-contain" src="/images/emoji/angry.png" alt="">
				</div>
				<div class="emoji z-0">
					<img class="w-4 h-4 object-contain" src="/images/emoji/lol.png" alt="">
				</div>
			</div>
		</TheClickable>

		<ul class="reactions-list flex flex-wrap text-xs gap-1 pt-2 max-w-80" v-if="!isEmpty(message.reactions)" :class="{ mute: showMenuButton || showMenu }">
			<li
				class="reaction-item flex items-center rounded-full bg-black px-2 h-6" v-for="(count, reactionName) in message.reactions"
				:class="{
					mine: message.my_reaction === reactionName,
					hidden: !(reactionName in reactions)
				}"
			>
				<div class="mr-1">
					<img class="w-4 h-4 object-contain" :src="reactions[reactionName]" alt="">
				</div>
				<div class="count text-gray-500">{{ count }}</div>
			</li>
		</ul>

		<transition>
			<div class="reactions-menu absolute w-[246px] top-full -mt-3 right-3 z-30" v-click-outside="() => showMenu = false" v-if="showMenu">
				<div class="flex flex-wrap text-2xl bg-gray-950 p-0.5 rounded-xl">
					<TheClickable
						class="reaction rounded-full flex items-center justify-center w-10 h-10"
						:class="{ active: reactionName == message.my_reaction }"
						v-for="(reactionImg, reactionName) in reactions"
						@click="selectReaction(reactionName)"
						:key="`reaction-${reactionName}`"
					>
						<img class="w-6 h-6 object-contain" :src="reactionImg" alt="">
					</TheClickable>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">

import type { Message } from '~/store/messages'
import { isEmpty } from 'lodash-es'
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
	like: '/images/emoji/like.png',
	dislike: '/images/emoji/dislike.png',
	lol: '/images/emoji/lol.png',
	sad: '/images/emoji/sad.png',
	crying: '/images/emoji/crying.png',
	angry: '/images/emoji/angry.png',
	wow: '/images/emoji/wow.png',
	please: '/images/emoji/please.png',
	belissimo: '/images/emoji/belissimo.png',
	fuckyou: '/images/emoji/fuckyou.png',
	ok: '/images/emoji/ok.png',
	love: '/images/emoji/love.png',
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
