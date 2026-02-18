<template>
	<div id="app">
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
	background: #252424 url("./assets/triangles-inverted.png");
	background-size: cover;
	background-position: center;
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

#app {
	overflow-x: hidden;
	height: 100vh;
	animation: fade-in 2s;
}

a {
	transition: color 0.3s;
}

a,
.bm-blue {
	color: #376fa4;
}

.bm-grey {
	color: #dfdfdf;
}

.bm-bg-grey {
	background: #979797;
}

.bm-light-grey {
	color: #e0e0e0;
}

.bm-bg-light-grey {
	background: #e0e0e0;
}

.bm-bg-dark-grey {
	background: #5e5e5e;
}

.bm-dark-grey {
	color: #5e5e5e;
}

.bm-white {
	color: #fff;
}

.bm-bg-white {
	background: #e9eef3;
}

.bm-max-width {
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
	.bm-blue {
		font-size: 90%;
	}
	a {
		text-decoration: none;
	}
}

.projects {
	@extend .bm-grey;

	max-width: 240px;
	.hide-on-mobile {
		display: none;
	}

	@media (min-width: 500px) {
		max-width: 700px;
		.hide-on-mobile {
			display: initial;
		}
	}

	a {
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.3s;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
		&:hover {
			@extend .bm-white;
		}
		@extend .bm-grey;
	}
}

.profiles {
	max-width: 300px;
	font-size: 1.3rem;

	a {
		text-decoration: none;
		&:hover {
			@extend .bm-white;
		}
		@extend .bm-grey;
	}

	.sr-only {
		color: #232323;
	}
}
</style>
