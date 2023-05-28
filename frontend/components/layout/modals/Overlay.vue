<template>
    <div :class="$style.Overlay"
         @click.self="$emit('click')"></div>
</template>

<script>
    export default {
        name: 'Overlay',
    };
</script>

<style lang="scss" module>
    .Overlay {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 98;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: rgba($base-1000, .6);
        color: #000;
    }
</style>
