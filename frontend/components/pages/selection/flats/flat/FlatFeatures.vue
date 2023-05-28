<template>
    <section :class="$style.FlatFeatures">
        <transition name="fade-content">
            <div
                v-show="isLoaded"
                ref="slider"
                :class="[$style.slider, 'swiper']"
            >
                <ul :class="[$style.sliderWrapper, 'swiper-wrapper']">
                    <li
                        v-for="feature in featureList"
                        :key="feature.id"
                        :class="[$style.slide, 'swiper-slide']"
                    >
                        <FlatFeatureCard :feature="feature" />
                    </li>
                </ul>
                <div :class="[$style.pagination, 'swiper-pagination']"></div>

                <div :class="$style.sliderControls">
                    <SliderNavigation
                        ref="nav"
                        :class="$style.nav"
                        :prev-disabled="activeSlide <= 1"
                        :next-disabled="activeSlide >= totalSlides"
                        color="gray"
                    />
                    <SliderPagination
                        :class="$style.slidePagination"
                        :nums="paginationNumbers"
                    />
                </div>
            </div>
        </transition>
    </section>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    import FlatFeatureCard from '~/components/common/selection/flats/flat/FlatFeatureCard';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import SliderPagination from '~/components/common/SliderPagination';
    export default {
        name: 'FlatFeatures',
        components: {FlatFeatureCard, SliderNavigation, SliderPagination},
        props: {
            featureList: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                isLoaded: false,
                totalSlides: 1,
                activeSlide: 1,
                slider: null,
            };
        },

        computed: {
            paginationNumbers() {
                return [this.activeSlide, this.totalSlides];
            },
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.updateSwiper);
            this.isLoaded = true;
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 4,
                        spaceBetween: 8,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false
                            },

                            768: {
                                allowTouchMove: true,
                                slidesPerView: 2.2,
                            },

                            0: {
                                slidesPerView: 1.2,
                                spaceBetween: 12,
                            },
                        },

                        pagination: {
                            el: `.${this.$style.pagination}`,
                            type: 'bullets',
                            clickable: true,
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || this.$refs.nav.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || this.$refs.nav.$refs.prev || false,
                        },

                        on: {
                            init: () => {
                                this.activeSlide = 1;
                                this.totalSlides = Math.ceil(this.$refs.slider.swiper.slides.length - this.$refs.slider.swiper.params.slidesPerView + 1);
                                if (this.totalSlides < 1) {
                                    this.totalSlides = 1;
                                }
                            },
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        this.activeSlide = this.$refs.slider.swiper.realIndex + 1;
                    });
                }
            },

            updateSwiper() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },
        },
    };
</script>

<style lang="scss" module>
    .FlatFeatures {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: $container-width;
        margin: 0 auto;
        padding: 4rem 0;

        @include respond-to(sm) {
            padding: 2.4rem 0 3.2rem;
        }

        @include respond-to(sm) {
            padding: 2.4rem 0 4rem;
        }
    }

    .slider {
        width: 100%;

        &:global(.swiper) {
            padding: 0 2.4rem;

            @include respond-to(xs) {
                padding: 0 1.6rem;
            }
        }

        .sliderWrapper {
            height: auto;
            margin-bottom: 1.6rem;

            @include respond-to(xs) {
                margin-bottom: 2.4rem;
            }
        }

        .slide {
            height: auto;
            min-height: 20.2rem;

            @include respond-to(sm) {
                min-height: 23.7rem;
            }
        }

        .sliderControls {
            display: flex;
            justify-content: space-between;

            @include respond-to(xs) {
                display: none;
            }
        }

        .pagination {
            display: none;

            @include respond-to(xs) {
                position: static;
                display: flex;
                justify-content: center;
                width: 100%;
            }

            &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
                width: .6rem;
                height: .6rem;
                border-radius: 50%;
                background-color: $base-400;
                opacity: .4;
            }

            &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
                background-color: #000;
                opacity: 1;
            }
        }
    }
</style>
