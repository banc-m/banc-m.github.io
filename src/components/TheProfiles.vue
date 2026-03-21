<template>
    <div class="profiles mx-auto text-center mb-3 mt-lg-5">
        <a
            v-for="profile in profiles"
            :key="profile.text"
            :href="profile.url"
            class="profile-link py-2 mx-2"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span :class="'fa fa-' + profile.icon" aria-hidden="true"></span>
            <span class="profile-label">{{ profile.text }}</span>
        </a>
    </div>
</template>

<script>
export default {
    name: 'TheProfiles',
    data () {
        return {
            profiles: [
                { text: 'GitHub',     url: '//github.com/nuvmo',      icon: 'github'     },
                { text: 'CodePen',    url: '//codepen.io/nuvmo/',     icon: 'codepen'    },
                { text: 'SoundCloud', url: '//soundcloud.com/nuvmo',  icon: 'soundcloud' }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.profile-link {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    color: #dfdfdf;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    min-width: 100px;
    transition: color 0.3s, background 0.25s, transform 0.25s, border-color 0.25s;

    &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.09);
        transform: translateY(-3px);
        border-color: rgba(55, 111, 164, 0.4);
    }

    .fa {
        font-size: 1.3rem;
    }
}

.profile-label {
    font-size: 0.62rem;
    letter-spacing: 0.08rem;
    text-transform: uppercase;
}
</style>
