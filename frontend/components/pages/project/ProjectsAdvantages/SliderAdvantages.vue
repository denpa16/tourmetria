<template>
    <div :class="$style.SliderAdvantages">
        <transition name="fade-content">
            <div
                v-show="isLoaded"
                ref="slider"
                class="swiper"
                :class="$style.swiper"
            >
                <div class="swiper-wrapper">
                    <div
                        v-for="(card, idx) in slidesModify"
                        :key="idx"
                        :class="[$style.slide, {[$style.slideIsDisabled]: slideIsDisabled(idx)}]"
                        class="swiper-slide"
                    >
                        <component
                            :is="slide"
                            :slide="card"
                        />
                    </div>
                </div>
                <div
                    class="swiper-pagination"
                    :class="$style.pagination"
                ></div>
            </div>
        </transition>

        <div
            v-show="isLoaded"
            :class="$style.controls"
        >

            <SliderPagination
                :class="$style.fractionPagination"
                :nums="paginationInfo"
                color="gray"
            />


            <div :class="$style.buttons">
                <VButton
                    color="primary"
                    :link="flatsLink"
                >
                    Смотреть апартаменты
                </VButton>

                <VButton
                    :class="$style.btn"
                    color="light"
                    @click="$emit('open-form')"
                >
                    {{ $deviceIs.mobile ? 'Консультация' : 'Заказать консультацию' }}
                </VButton>
            </div>

            <SliderNavigation
                ref="nav"
                :class="$style.nav"
                color="gray"
                :prev-disabled="activeSlide === 1"
                :next-disabled="activeSlide === totalSlides"
            >
                <div :class="[$style.slideCount, 'p6', 'c-base300']">
                    {{ activeSlide }}/{{ totalSlides }}
                </div>
            </SliderNavigation>
        </div>
    </div>
</template>

<script>
    import PaymentCard from '~/components/common/payment/PaymentCard';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import SliderPagination from '~/components/common/SliderPagination';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {objectToQuery} from '~/assets/js/utils/queryUtils';

    export default {
        name: 'SliderAdvantages',
        components: {
            SliderNavigation,
            SliderPagination,
            PaymentCard,
        },

        props: {
            slide: {
                type: [Object, String],
                default: () => 'div',
            },

            slides: {
                type: Array,
                default: () => [],
            },

            slug: {
                type: String,
                default: () => ''
            }
        },

        data() {
            return {
                isLoaded: false,
                totalSlides: 1,
                activeSlide: 1,
            };
        },

        computed: {
            flatsLink() {
                return `/selection/flats?${objectToQuery({
                    project: this.slug,
                })}`;
            },

            paginationInfo() {
                return [this.activeSlide, this.totalSlides];
            },

            slidesModify() {
                if (this.$deviceIs.desktop || this.$deviceIs.laptop) {
                    return [{}, ...this.slides, {}];
                }
                return this.slides;
            }
        },

        watch: {
            slides() {
                this.updateSwiper();
            }
        },

        mounted() {
            this.isLoaded = true;
            addResizeListener(this.$refs.slider, this.updateSwiper);
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        methods: {
            slideIsDisabled(idx) {
                if (this.$deviceIs.desktop || this.$deviceIs.laptop) {
                    return idx - this.activeSlide > 2 || idx - this.activeSlide < 0;
                }

                return false;
            },

            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 5,
                        spaceBetween: 16,
                        breakpoints: {
                            1280: {
                                slidesPerView: 5,
                            },

                            1180: {
                                slidesPerView: 4,
                            },

                            960: {
                                slidesPerView: 3,
                            },

                            768: {
                                slidesPerView: 3,
                            },

                            560: {
                                slidesPerView: 2,
                            },

                            320: {
                                slidesPerView: 1.3,
                                spaceBetween: 12,
                            },
                        },

                        pagination: {
                            el: '.swiper-pagination',
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
    .SliderAdvantages {
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        max-width: $container-width;
    }

    .swiper {
        width: calc(100% + 6rem);
        height: 100%;
        margin-bottom: 13rem;
        transform: translateX(-3rem);

        @include respond-to(sm) {
            transform: unset;
        }

        @include respond-to(xs) {
            margin-bottom: 0;
            transform: translateX(1.6rem);
        }

        &:global(.swiper) {
            @include respond-to(sm) {
                margin-left: 2.4rem;
            }

            @include respond-to(xs) {
                margin-left: 0;
                padding-bottom: 5.4rem;
            }
        }
    }

    .pagination {
        position: absolute;
        bottom: -2.4rem;
        z-index: 1;
        display: none;
        text-align: center;
        opacity: 0;
        transition: opacity .3s linear, background-color .3s linear;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 2.4rem;

            @include respond-to(xs) {
                bottom: 1.8rem;
                transform: translateX(-5rem);
            }
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $base-400;
            opacity: .4;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: $base-900;
            opacity: unset;
        }

        @include respond-to(xs) {
            display: block;
            opacity: 1;
        }
    }

    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-right: 2.4rem;
        padding-left: 2.4rem;

        @include respond-to(xs) {
            justify-content: center;
        }

        .fractionPagination {
            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .slideCount {
        display: none;
        width: 100%;
        text-align: center;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .slide {
        overflow: hidden;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            border-radius: .8rem;
            background-color: $base-250;
            opacity: 0;
            transition-duration: .3s;
            transition-property: opacity;
        }

        &:first-child {
            opacity: 0;

            @include respond-to(sm) {
                opacity: 1;
            }
        }

        &:last-child {
            opacity: 0;

            @include respond-to(xs) {
                opacity: 1;
            }
        }
    }

    .slideIsDisabled {
        &:before {
            z-index: 10;
            opacity: .4;
        }
    }

    .btn {
        margin: 0 auto;
        padding-right: 2.4rem;
        padding-left: 2.4rem;
        background-color: $base-0;

        @include respond-to(xs) {
            width: 100%;
        }
    }

    .buttons {
        display: flex;
        justify-content: center;
        column-gap: .8rem;
    }

    .nav {
        @include respond-to(xs) {
            display: none;
        }
    }
</style>
