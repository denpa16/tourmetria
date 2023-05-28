<template>
    <div :class="$style.FlatHeroGalleryMobile">
        <div ref="slider"
             class="swiper"
             :class="$style.swiper"
        >
            <div class="swiper-wrapper">
                <div :class="$style.slide"
                     class="swiper-slide"
                >
                    <FlatHeroPlan :lot="lot"
                                  @open-plan="$emit('open-plan')" />
                </div>
                <div v-if="floorPlan"
                     :class="$style.slide"
                     class="swiper-slide"
                >
                    <FlatHeroFloor :lot="lot"
                                   :class="$style.floor" />
                </div>
                <div v-if="lot.genplan_display"
                     :class="$style.slide"
                     class="swiper-slide"
                >
                    <FlatHeroGenplan :lot="lot"
                                     :class="$style.floor" />
                </div>
                <div v-if="lot.window_view"
                     :class="$style.slide"
                     class="swiper-slide"
                >
                    <div :class="$style.view">
                        <div :class="$style.image"></div>
                        <VButton responsive
                                 :class="$style.viewBtn"
                                 :link="{ path: '/view', query: { link: lot.window_view, backLink: $route.path }}"
                                 target="_blank">
                            Открыть просмотр вида из окна
                        </VButton>
                    </div>
                </div>

                <div v-if="lot.tour_link"
                     :class="$style.slide"
                     class="swiper-slide"
                >
                    <div :class="$style.view">
                        <div :class="$style.image"></div>
                        <VButton responsive
                                 :class="$style.viewBtn"
                                 :link="{ path: '/view', query: { link: lot.tour_link, backLink: $route.path }}"
                                 target="_blank">
                            Открыть 3D-тур
                        </VButton>
                    </div>
                </div>
            </div>
        </div>

        <div class="swiper-pagination-hero"
             :class="$style.pagination"
        >
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import FlatHeroPlan from '~/components/pages/selection/flats/flat/hero/FlatHeroPlan';
    import FlatHeroFloor from '~/components/pages/selection/flats/flat/hero/FlatHeroFloor';
    import FlatHeroGenplan from '~/components/pages/selection/flats/flat/hero/FlatHeroGenplan';

    export default {
        name: 'FlatHeroGalleryMobile',

        components: {
            FlatHeroPlan,
            FlatHeroFloor,
            FlatHeroGenplan,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                activeSlide: 0,
            };
        },

        computed: {
            floorPlan() {
                return this.lot?.layout_on_floor?.plan_on_floor;
            }
        },

        watch: {
            activeSlide(value) {
                if (this.slider) {
                    this.$nextTick(() => {
                        this.slider.slideToLoop(value);
                        this.slider.lazy.load();
                    });
                }
            },
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.update);
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.update);
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 16,
                        allowTouchMove: true,
                        loop: true,
                        pagination: {
                            el: '.swiper-pagination-hero',
                            type: 'bullets',
                            clickable: true,
                        },

                        breakpoints: {
                            768: {
                                spaceBetween: 0
                            },
                        }
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        if (!this.slider) {
                            return;
                        }

                        this.activeSlide = this.slider.realIndex;
                        this.slider.lazy.load();
                    });
                }
            },

            update() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },
        }
    };
</script>

<style lang="scss" module>
    .FlatHeroGalleryMobile {
        position: relative;
    }

    .swiper {
        width: 100%;
        height: 100%;
    }

    .slide {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .floor {
        width: 100%;
        height: 100%;
    }

    .pagination {
        position: absolute;
        z-index: 0;
        text-align: center;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 2.4rem;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $base-400;
            opacity: unset;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: $black;
        }
    }

    .view {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-top: 3.1rem;
        padding-bottom: 3.7rem;
    }

    .image {
        width: 25rem;
        height: 25rem;
        margin: 0 auto;
        background-image: url('/images/flat/flatView.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .viewBtn {
        margin-top: auto;
    }
</style>
