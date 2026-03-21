<template>
    <div class="projects mx-auto mt-auto mb-lg-5 px-3">
        <!-- Projects grid -->
        <div class="projects-grid">
            <a
                v-for="(project, index) in projects"
                :key="project.text"
                :href="project.url"
                class="project-card"
                :style="{ animationDelay: ((index + 1) * 0.1) + 's' }"
                :target="project.external ? '_blank' : undefined"
                :rel="project.external ? 'noopener noreferrer' : undefined"
            >
                <img :src="project.img" :alt="project.text" :class="{ 'rounded-icon': project.rounded }" />
                <div class="card-info">
                    <span class="card-name">{{ project.text }}</span>
                    <span class="card-desc">{{ project.description }}</span>
                </div>
            </a>
        </div>

    </div>
</template>

<script>
export default {
    name: 'TheProjects',
    data () {
        return {
            projects: [
                {
                    text: 'Ghosting',
                    description: 'Squash ghosting training app',
                    url: '/ghosting',
                    img: new URL('./../assets/ghosting.svg', import.meta.url).href
                },
                {
                    text: 'WordMap',
                    description: 'See how any word translates across every country in Europe',
                    url: '/word-map',
                    img: new URL('./../assets/word-map.svg', import.meta.url).href,
                    rounded: true
                },
                {
                    text: 'PhotoViewer',
                    description: 'A clean, minimal photo gallery',
                    url: '/photos',
                    img: new URL('./../assets/photo-viewer.svg', import.meta.url).href
                },
                {
                    text: 'Safe Plants for Cats',
                    description: 'Browse houseplants safe for your cats',
                    url: '/safe-plants-for-cats',
                    img: new URL('./../assets/safe-plants-for-cats.svg', import.meta.url).href
                },
                {
                    text: 'Gifstori',
                    description: 'Create and share stories with GIFs',
                    url: '/gifstori',
                    img: new URL('./../assets/gifstori.svg', import.meta.url).href
                },
                {
                    text: 'Squash List',
                    description: 'List of squash-related resources',
                    url: '//squashlist.github.io',
                    img: new URL('./../assets/squashlist.svg', import.meta.url).href,
                    external: true
                },
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ── Projects grid ── */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    @media (min-width: 500px) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.project-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 16px 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    text-decoration: none;
    transition: background 0.25s, translate 0.25s, border-color 0.25s;
    animation: slide-up 0.5s both;

    &:hover {
        background: rgba(255, 255, 255, 0.09);
        translate: 0 -3px;
        border-color: rgba(55, 111, 164, 0.4);

        img { filter: grayscale(0) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4)); }
        .card-name { color: #fff; }
    }

    img {
        width: 36px;
        height: 36px;
        object-fit: contain;
        filter: grayscale(0.5);
        transition: filter 0.25s;
    }

    .rounded-icon {
        border-radius: 8px;
    }
}

.card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    text-align: center;
}

.card-name {
    color: #dfdfdf;
    font-size: 0.82rem;
    font-family: monospace;
    transition: color 0.25s;
}

.card-desc {
    color: #dfdfdf;
    font-size: 0.68rem;
    line-height: 1.3;
}
</style>
