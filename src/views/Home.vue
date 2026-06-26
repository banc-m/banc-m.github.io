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
    overflow: hidden;
}
</style>
