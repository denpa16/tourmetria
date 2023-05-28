<template>
    <transition name="fade-content">
        <div v-show="isLoaded"
             ref="slider"
             class="swiper"
             :class="$style.ProjectOfficeSlider"
        >
            <div class="swiper-wrapper">
                <ImageLazy v-for="slide in slides"
                           :key="slide.id"
                           :class="$style.slide"
                           class="swiper-slide"
                           :image="slide.image_display"
                           :preview="slide.image_preview"
                           relative
                />
            </div>
            <div v-if="slides.length > 1"
                 :class="$style.navigation">
                <VSquareButton ref="prev"
                               :class="$style.navBtn"
                               size="custom"
                               color="white"
                               aria-label="Предыдущий слайд"
                               :disabled="activeSlide === 0"
                >
                    <IconArrowLeft :class="$style.navIcon" />
                </VSquareButton>
                <VSquareButton ref="next"
                               :class="[$style.navBtn, $style._right]"
                               size="custom"
                               color="white"
                               aria-label="Следующий слайд"
                               :disabled="activeSlide === slides.length - 1"
                >
                    <IconArrowLeft :class="$style.navIcon" />
                </VSquareButton>
            </div>

            <div
                class="swiper-pagination"
                :class="$style.pagination"
                :style="paginationStyles"
            >
            </div>
        </div>
    </transition>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';

    export default {
        name: 'ProjectOfficeSlider',

        components: {
            ImageLazy,
            IconArrowLeft,
        },

        mixins: [breakpointCheck],

        props: {
            slides: {
                type: Array,
                default: () => []
            },

            sliderBottom: {
                type: Number,
                default: 0
            }
        },

        data() {
            return {
                slider: null,
                isLoaded: false,
                activeSlide: 0
            };
        },

        computed: {
            paginationStyles() {
                return {
                    top: this.breakpoint === 'xs' ? 'unset' : `${this.sliderBottom - 12}px`,
                    bottom: this.breakpoint === 'xs' ? '0' : 'unset',
                };
            }
        },

        watch: {
            slides() {
                this.updateSwiper();
            }
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.updateSwiper);
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        allowTouchMove: true,
                        spaceBetween: 16,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false,
                                spaceBetween: 0,
                            },

                            768: {
                                spaceBetween: 0,
                            }
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || false,
                        },

                        pagination: {
                            el: '.swiper-pagination',
                            type: 'bullets',
                            clickable: true,
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        if (!this.slider) {
                            return;
                        }

                        this.activeSlide = this.slider.realIndex;
                    });
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
    .ProjectOfficeSlider {
        width: 100%;
        height: 100%;
    }

    .slide {
        width: 100%;
        height: 100%;

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            display: block;
            width: 100%;
            height: 14.2rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, $base-900 100%);

            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .navigation {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 1.6rem;
        transform: translateY(-50%);

        @include respond-to(xs) {
            display: none;
        }
    }

    .navBtn {
        width: 2.4rem;
        height: 2.4rem;

        &._right {
            .navIcon {
                transform: rotate(180deg);
            }
        }
    }

    .navIcon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .pagination {
        position: absolute;
        z-index: 2;
        text-align: center;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 5rem;
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
</style>
