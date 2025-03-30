<template>
    <div class="profiles mx-auto">
        <span v-for="profile in profiles" :key="profile.text">
            <a :href="profile.url" class="mx-3">
                <span :class="'fa fa-' + profile.icon"></span>
                <span class="sr-only">{{ profile.text }}</span>
            </a>
        </span>
    </div>
</template>

<script>
export default {
	name: 'TheProfiles',
	data () {
		return {
			profiles: [
				{
					text: 'GitHub',
					url: '//github.com/nuxmo',
					icon: 'github'
				},
				{
					text: 'CodePen',
					url: '//codepen.io/nuxmo/',
					icon: 'codepen'
				},
				{
					text: 'SoundCloud',
					url: '//soundcloud.com/nuxmo',
					icon: 'soundcloud'
				}
			]
		}
	}
}
</script>
