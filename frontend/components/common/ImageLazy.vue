<template>
    <div :style="[preview ? {backgroundImage: `url(${preview})`} : '']"
         :class="['image-lazy', classes]"
    >
        <template v-if="tag === 'img'">
            <img v-if="image"
                 v-lazy="image"
                 class="image-lazy__image"
                 :alt="alt || 'photo'"
            >
        </template>
        <template v-else>
            <div v-if="isSwiperSlider"
                 :data-background-image="image"
                 class="image-lazy__image swiper-lazy"
            >
            </div>
            <div v-else
                 v-lazy:background-image="image"
                 class="image-lazy__image"
            >
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'ImageLazy',

        props: {
            preview: {
                type: String,
                default: '',
            },

            image: {
                type: String,
                default: '',
            },

            full: {
                type: String,
                default: '',
            },

            alt: {
                type: String,
                default: '',
            },

            relative: {
                type: Boolean,
                default: false,
            },

            absolute: {
                type: Boolean,
                default: false,
            },

            contain: {
                type: Boolean,
                default: false,
            },

            cover: {
                type: Boolean,
                default: false,
            },

            right: {
                type: Boolean,
                default: false,
            },

            left: {
                type: Boolean,
                default: false,
            },

            bottom: {
                type: Boolean,
                default: false,
            },

            initial: {
                type: Boolean,
                default: false,
            },

            tag: {
                type: String,
                default: 'div',
                validator(val) {
                    return ['div', 'img'].includes(val);
                },
            },

            isSwiperSlider: Boolean,
        },

        computed: {
            classes() {
                return {
                    'is-relative': this.relative,
                    'is-absolute': this.absolute,
                    'is-contain': this.contain,
                    'is-cover': this.cover,
                    'is-right': this.right,
                    'is-left': this.left,
                    'is-bottom': this.bottom,
                    'is-initial': this.initial,
                };
            },
        },
    };
</script>

<style lang="scss">
    .image-lazy {
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        &.is-relative {
            position: relative;
        }

        &.is-absolute {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }

        &.is-initial {
            .image-lazy__image {
                background-position: initial;
            }
        }

        &.is-contain {
            background-size: contain;

            .image-lazy__image {
                background-size: contain;
            }
        }

        &.is-cover {
            img {
                object-fit: cover;
            }
        }

        &.is-right {
            background-position-x: right;

            .image-lazy__image {
                background-position-x: right;
            }
        }

        &.is-left {
            background-position-x: left;

            .image-lazy__image {
                background-position-x: left;
            }
        }

        &.is-bottom {
            background-position-y: bottom;

            .image-lazy__image {
                background-position-y: bottom;
            }
        }

        &__image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            opacity: 0;
            transform: translate3d(0, 0, 0);
            will-change: transform;
            transition: opacity .3s ease .1s;

            &[lazy="loaded"] {
                opacity: 1;
            }

            &.swiper-lazy-loaded {
                opacity: 1;
            }
        }
    }
</style>
