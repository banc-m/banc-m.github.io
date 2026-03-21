<template>
    <div class="m-auto text-center mb-4">
        <img src="./../assets/old-dude.jpg" alt="nuvmo" class="avatar m-auto d-none d-md-block shadow border border-3 border-secondary mb-4" />
        <h1 class="logo-text">nuvmo</h1>
        <p class="tagline">web designer &amp; developer</p>
    </div>
</template>

<script>
export default {
    name: 'TheLogo'
}
</script>

<style lang="scss" scoped>
.avatar {
    width: 70px;
    border-radius: 50%;
}

.logo-text {
    font-family: "Zen Dots", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    text-align: center;
    font-size: 4rem;
    letter-spacing: .5rem;
    margin-right: -.5rem;
    margin-bottom: 0.25rem;
    background: linear-gradient(315deg, #e1a265 0%, #38bbe4 50%, #e1a265 100%);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-shift 5s ease infinite;
}

.tagline {
    font-family: monospace;
    font-size: 0.8rem;
    letter-spacing: 0.2rem;
    color: #dfdfdf;
    margin: 0;
}

@keyframes gradient-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>
