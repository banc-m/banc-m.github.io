<template>
	<main class="page d-flex flex-column align-items-center py-3 px-0">
        <TheTerminal />
	</main>
</template>

<script>
import TheTerminal from '@/components/TheTerminal.vue'

export default {
	name: 'HomePage',
	components: { TheTerminal }
}
</script>

<style scoped>
.page {
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
}

@media (min-width: 768px) {
    .page {
        padding-top: clamp(2rem, 8vh, 10rem) !important;
        padding-bottom: clamp(2rem, 8vh, 10rem) !important;
    }
}
</style>
