<template>
    <div class="m-auto">
        <img src="./../assets/old-dude.jpg" alt="logo" class="logo m-auto d-none d-md-block shadow border border-3 border-secondary mb-4" />
        <h1 class="logo-text nx-grey">bancm</h1>
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
    font-size: 4rem;
    letter-spacing: .5rem;
    margin-right: -.5rem;
    background: -webkit-linear-gradient(315deg, #e1a265 25%, #38bbe4);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
