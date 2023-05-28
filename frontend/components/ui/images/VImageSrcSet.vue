<template>
    <picture>
        <source
            type="image/webp"
            :data-srcset="imageSetSrcset(image, true, quality.img, false, width, height)"
            data-sizes="(max-width: 767px), (min-width: 768px), (min-width: 1439px)"
        >

        <source
            type="image/png"
            :data-srcset="imageSetSrcset(image, false, quality.img, false, width, height)"
            data-sizes="(max-width: 767px), (min-width: 768px), (min-width: 1439px)"
        >

        <img
            :src="imageSetSrcset(image, isWebpSup, quality.preview, true, width, height)"
            :alt="alt"
            class="lazyload"
            :class="[$style.VImageSrcSet, {[$style._contain]: contain}]"
        >
    </picture>
</template>

<script>
// Vuex
import { mapGetters } from 'vuex';

// Utils
import { imageSetSrcset } from '~/assets/js/utils/image-utils';

export default {
    name: 'VImageSrcSet',

    props: {
        image: {
            type: String,
            default: '',
        },

        alt: {
            type: String,
            default: 'image',
        },

        // качество для изображения \ превью
        quality: {
            type: Object,
            default: () => ({ img: 80, preview: 20 }),
            validator: obj => obj.img && Number.isInteger(obj.img) && obj.preview && Number.isInteger(obj.preview),
        },

        // ширина изображения для image proxy
        width: {
            type: Object,
            default: () => ({ m: 343, t: 768, d: 1920 }),
            validator: obj => obj.m && Number.isInteger(obj.m) && obj.t && Number.isInteger(obj.t) && obj.d && Number.isInteger(obj.d),
        },

        // высота изображения для image proxy
        height: {
            type: Object,
            default: () => ({ m: 343, t: 408, d: 1088 }),
            validator: obj => obj.m && Number.isInteger(obj.m) && obj.t && Number.isInteger(obj.t) && obj.d && Number.isInteger(obj.d),

        },

        // флаг для css object-fit
        contain: Boolean,
    },

    computed: {
        ...mapGetters({
            isWebpSup: 'device/getIsWebpSupported',
        }),
    },

    methods: {
        imageSetSrcset,
    },
};
</script>

<style lang="scss" module>
    .VImageSrcSet {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;

        &._contain {
            object-fit: contain;
        }
    }
</style>
