<template>
	<div class="projects mx-auto text-center">
		<span v-for="project in projects" :key="project.text" class="px-1 px-md-2 d-inline-block py-1">
			<a :href="project.url">
				<img :src="project.img" alt="icon" aria-hidden="true" :class="{'rounded': project.rounded}" />
				&nbsp;{{project.text}}
			</a>
		</span>
	</div>
</template>

<script>
export default {
	name: 'TheProjects',
	data () {
		return {
			projects: [
                // {
				// 	text: 'Squash List',
				// 	url: '//www.squashlist.info',
				// 	img: new URL('./../assets/ghosting.png', import.meta.url).href
				// },
                {
					text: 'Ghosting',
					url: '/ghosting',
					img: new URL('./../assets/ghosting.png', import.meta.url).href
				},
				{
					text: 'WordMap',
					url: '/word-map',
					img: new URL('./../assets/word-map.png', import.meta.url).href,
					rounded: true
				},
				{
					text: 'PhotoViewer',
					url: '/photos',
					img: new URL('./../assets/photo-viewer.png', import.meta.url).href
				},
				{
					text: 'Safe Plants for Cats',
					url: '/safe-plants-for-cats',
					img: new URL('./../assets/safe-plants-for-cats-fff.png', import.meta.url).href
				},
				{
					text: 'Gifstori',
					url: '/gifstori',
					img: new URL('./../assets/gifstori.png', import.meta.url).href
				},
                {
					text: 'Squash List',
					img: new URL('./../assets/squashlist.png', import.meta.url).href,
					url: '//squashlist.github.io',
				},
			],
		}
	}
}
</script>

<style lang="scss" scoped>
img {
	width: 15px;
	filter: grayscale(1);

	a:hover & {
		filter: grayscale(0);
	}
}
</style>
