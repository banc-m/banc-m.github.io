<template>
    <div class="m-auto d-md-flex justify-content-center align-items-center">
        <img src="./../assets/old-dude.jpg" alt="logo" class="logo m-auto d-block d-md-inline-block me-md-4 shadow border border-3 border-secondary" />
        <h1 class="logo-text nx-grey d-md-inline-block">nuxmo</h1>
    </div>
</template>

<script>

export default {
    name: 'TheLogo'
}
</script>

<style lang="scss" scoped>
.logo {
    width: 70px;
    border-radius: 50%;
}

.logo-text {
    font-family: "Zen Dots", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    text-align: center;
    font-size: 3.5rem;
    letter-spacing: 1rem;
    margin-right: -1rem;
    background: -webkit-linear-gradient(315deg, #e1a265 25%, #38bbe4);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
