<template>
	<main class="d-flex flex-column h-100 py-4">
        <TheProfiles />
        <TheAvatar />
        <TheProjects />
	</main>
</template>

<script>
import TheAvatar from '@/components/TheLogo.vue'
import TheProjects from '@/components/TheProjects.vue'
import TheProfiles from '@/components/TheProfiles.vue'

export default {
	name: 'HomePage',
	components: {
		TheAvatar,
		TheProjects,
		TheProfiles
	}
}
</script>
