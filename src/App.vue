<template>
	<div class="app">
		<HomePage />
	</div>
</template>

<script>
import HomePage from './views/Home.vue'
export default {
	name: 'App',
	components: {
		HomePage
	}
}
</script>

<style lang="scss">
body {
	color: #232323;
	background-color: #111213;
	background-image: repeating-linear-gradient(
		0deg,
		rgba(0, 0, 0, 0.18) 0px,
		rgba(0, 0, 0, 0.18) 1px,
		transparent 1px,
		transparent 4px
	);
	font-family: sans-serif;
	transition: background-color 0.25s, background-image 0.25s;

	&.skin-light {
		background-color: #f0ebe4;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.04) 0px,
			rgba(0, 0, 0, 0.04) 1px,
			transparent 1px,
			transparent 4px
		);
	}

	&.skin-matrix {
		background-color: #010701;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(0, 255, 0, 0.04) 0px,
			rgba(0, 255, 0, 0.04) 1px,
			transparent 1px,
			transparent 4px
		);
	}

	&.skin-amber {
		background-color: #0a0400;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(255, 140, 0, 0.05) 0px,
			rgba(255, 140, 0, 0.05) 1px,
			transparent 1px,
			transparent 4px
		);
	}

	&.skin-nord {
		background-color: #1e2430;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.2) 0px,
			rgba(0, 0, 0, 0.2) 1px,
			transparent 1px,
			transparent 4px
		);
	}
}

@keyframes fade-in {
	from { opacity: 0; }
	to   { opacity: 1; }
}

.app {
	overflow-x: hidden;
	min-height: 100vh;
	animation: fade-in 2s;
}

a {
	transition: color 0.3s;
}
</style>
