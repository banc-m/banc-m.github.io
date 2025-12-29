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
	background: #252424;
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
.nx-blue {
	color: #376fa4;
}

.nx-grey {
	color: #dfdfdf;
}

.nx-bg-grey {
	background: #979797;
}

.nx-light-grey {
	color: #e0e0e0;
}

.nx-bg-light-grey {
	background: #e0e0e0;
}

.nx-bg-dark-grey {
	background: #5e5e5e;
}

.nx-dark-grey {
	color: #5e5e5e;
}

.nx-white {
	color: #fff;
}

.nx-bg-white {
	background: #e9eef3;
}

.nx-max-width {
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
	.nx-blue {
		font-size: 90%;
	}
	a {
		text-decoration: none;
	}
}

.projects {
	@extend .nx-grey;

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
			@extend .nx-white;
		}
		@extend .nx-grey;
	}
}

.profiles {
	max-width: 300px;
	font-size: 1.3rem;

	a {
		text-decoration: none;
		&:hover {
			@extend .nx-white;
		}
		@extend .nx-grey;
	}

	.sr-only {
		color: #232323;
	}
}
</style>
