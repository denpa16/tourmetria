<template>
    <div v-if="flats && flats.length"
         :class="[$style.FlatSimilar, 'container']">
        <h2 :class="[$style.title, 'h3']">
            Похожие квартиры
            <span class="c-base300">
                {{ flats.length }}
            </span>
        </h2>

        <ul :class="$style.flatList">
            <li v-for="flat in relatedFlats"
                :key="flat.id"
                :class="$style.flatItem">
                <LotCard :lot="flat" />
            </li>
        </ul>

        <transition name="fade-content">
            <div v-if="flats.length > 1"
                 :class="$style.slider">
                <div v-show="isLoaded"
                     ref="slider"
                     class="swiper"
                >
                    <div class="swiper-wrapper">
                        <LotCard v-for="flat in relatedFlats"
                                 :key="flat.id"
                                 :class="$style.flatSlide"
                                 class="swiper-slide"
                                 :lot="flat" />
                    </div>

                    <div
                        class="related-swiper-pagination"
                        :class="$style.pagination"
                    >
                    </div>
                </div>
            </div>

            <LotCard v-else
                     :key="relatedFlats[0].id"
                     :class="$style.onlyOneLot"
                     class="swiper-slide"
                     :lot="relatedFlats[0]" />
        </transition>

        <VButton :class="$style.btn"
                 color="light"
                 :link="btnLink">
            Смотреть все
        </VButton>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import LotCard from '~/components/common/selection/LotCard';

    export default {
        name: 'FlatSimilar',
        components: {LotCard},
        props: {
            flats: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                isLoaded: false,
                slider: null,
                btnLink: this.$route.path,
            };
        },

        computed: {
            relatedFlats() {
                if (this.flats.length > 4) {
                    return this.flats.slice(0, 4);
                }

                return this.flats;
            }
        },

        beforeMount() {
            const route = this.$route;
            this.btnLink = route.path.split(`/${route.params.id}`)[0];
        },

        mounted() {
            if (this.$refs.slider) {
                addResizeListener(this.$refs.slider, this.updateSwiper);
                this.isLoaded = true;
            }
        },

        beforeDestroy() {
            if (this.$refs.slider) {
                removeResizeListener(this.$refs.slider, this.updateSwiper);
                this.slider?.destroy();
            }
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1.3,
                        allowTouchMove: true,
                        spaceBetween: 12,
                        pagination: {
                            el: '.related-swiper-pagination',
                            type: 'bullets',
                            clickable: true,
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);
                }
            },

            updateSwiper() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },
        }
    };
</script>

<style lang="scss" module>
    .FlatSimilar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 4rem;
        padding-bottom: 6.4rem;

        @include respond-to(sm) {
            padding-bottom: 4rem;
        }

        @include respond-to(xs) {
            padding-top: 2.4rem;
        }
    }

    .onlyOneLot {
        &:global(.swiper-slide) {
            display: none;
            width: 100%;

            @include respond-to(xs) {
                display: flex;
            }
        }
    }

    .slider {
        & :global(.swiper) {
            display: none;
            width: 100vw;
            height: 47.4rem;
            margin-right: -1.6rem;
            margin-left: -1.6rem;
            padding-bottom: 3rem;
            padding-left: 1.6rem;

            @include respond-to(xs) {
                display: block;
            }
        }
    }

    .title {
        margin-bottom: 6.4rem;
        text-transform: uppercase;

        @include respond-to(sm) {
            margin-bottom: 4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-size: 2rem;
            line-height: 1.2;
        }
    }

    .flatList {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.6rem;
        width: 100%;

        @include respond-to(sm) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .pagination {
        position: absolute;
        z-index: 2;
        text-align: center;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 0;
            transform: translateY(-100%);

            @include respond-to(xs) {
                transform: unset;
            }
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $white-40;
            opacity: unset;

            @include respond-to(xs) {
                background-color: $base-400;
                opacity: .4;
            }
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: $base-0;

            @include respond-to(xs) {
                background-color: $black;
                opacity: unset;
            }
        }
    }

    .btn {
        margin-top: 7.2rem;

        @include respond-to(sm) {
            width: 100%;
            margin-top: 4.8rem;
        }

        @include respond-to(xs) {
            margin-top: 2.4rem;
        }
    }
</style>
