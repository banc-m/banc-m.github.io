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
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.app {
	overflow-x: hidden;
	min-height: 100vh;
	animation: fade-in 2s;
}

main {
    min-height: 100vh;
}

a {
	transition: color 0.3s;
}

.nv-blue {
	color: #376fa4;
}

.nv-grey {
	color: #dfdfdf;
}

.nv-bg-grey {
	background: #979797;
}

.nv-light-grey {
	color: #e0e0e0;
}

.nv-bg-light-grey {
	background: #e0e0e0;
}

.nv-bg-dark-grey {
	background: #5e5e5e;
}

.nv-dark-grey {
	color: #5e5e5e;
}

.nv-white {
	color: #fff;
}

.nv-bg-white {
	background: #e9eef3;
}

.nv-max-width {
	max-width: 600px;
	margin: 50px auto 100px;
}

h1,
h2,
h3,
h4,
h5,
h6,
.logo {
	font-family: monospace;
}

.logo {
	font-size: 2.75rem;
	.nv-blue {
		font-size: 90%;
	}
	a {
		text-decoration: none;
	}
}

.projects {
	max-width: 360px;

	@media (min-width: 500px) {
		max-width: 700px;
	}
}

.profiles {
	max-width: 400px;
}
</style>
