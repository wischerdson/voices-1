<template>
	<div class="text-black">
		<div v-if="pending">
			<icon name="svg-spinners:90-ring-with-bg" :size="`26px`" />
		</div>
		<div class="space-y-6" v-else>
			<div v-for="post in data">
				{{ post.title }} <br> {{ post.body }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { useGetFetch } from '~/composables/use-request'

const { data, pending } = await useGetFetch('https://jsonplaceholder.typicode.com/posts', 'posts', {
	server: false
}).send()

</script>
