<template>
    <div :class="$style.PaymentBlock">
        <h2 :class="[$style.title, 'h3']">
            {{ title }}
            <span class="c-base300">
                {{ count || paymentsList.length }}
            </span>
        </h2>

        <transition name="fade-content">
            <div v-show="isLoaded"
                 ref="slider"
                 class="swiper"
                 :class="$style.swiper"
            >
                <div class="swiper-wrapper">
                    <div v-for="(card, idx) in paymentsList"
                         :key="idx"
                         :class="$style.slide"
                         class="swiper-slide"
                    >
                        <PaymentCard
                            :class="$style.card"
                            :card="card"
                        />
                    </div>
                </div>
                <div
                    class="swiper-pagination"
                    :class="$style.pagination"
                >
                </div>
            </div>
        </transition>

        <div v-show="isLoaded"
             :class="$style.controls">
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

            <VButton
                :class="$style.btn"
                color="light"
                link="/how-buy"
                blank
            >
                Смотреть все
            </VButton>

            <SliderPagination
                :class="$style.fractionPagination"
                :nums="paginationInfo"
                color="gray"
            />
        </div>
    </div>
</template>

<script>
    import PaymentCard from '~/components/common/payment/PaymentCard';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import SliderPagination from '~/components/common/SliderPagination';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    export default {
        name: 'PaymentBlock',
        components: {
            SliderNavigation,
            SliderPagination,
            PaymentCard
        },

        props: {
            title: {
                type: String,
                default: 'Способы оплаты',
            },

            paymentsList: {
                type: Array,
                default: () => []
            },

            count: {
                type: Number,
                default: 0,
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
            paginationInfo() {
                return [this.activeSlide, this.totalSlides];
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
                        slidesPerView: this.paymentsList?.length >= 4 ? 4 : this.paymentsList.length,
                        spaceBetween: 24,
                        allowTouchMove: true,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false
                            },

                            768: {
                                slidesPerView: this.paymentsList?.length >= 2 ? 2 : 1,
                            },

                            320: {
                                spaceBetween: 16,
                                slidesPerView: 1.0005
                            }
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
        }
    };
</script>


<style lang="scss" module>
    .PaymentBlock {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        max-width: $container-width;
        margin-right: auto;
        margin-left: auto;
        padding: 4rem 0 6.4rem;

        @include respond-to(sm) {
            padding: 4.8rem 0 6.4rem;
        }

        @include respond-to(xs) {
            padding: 2.4rem 0 4rem;
        }
    }

    .title {
        margin-bottom: 6.4rem;
        padding-right: 2.4rem;
        padding-left: 2.4rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-size: 2rem;
            line-height: 1.2;
        }
    }

    .swiper {
        width: 100%;
        height: 100%;

        &:global(.swiper) {
            padding-right: 2.4rem;
            padding-left: 2.4rem;

            @include respond-to(xs) {
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

    .card {
        width: 100%;
        height: 37.4rem;

        @include respond-to(xs) {
            height: 19.9rem;
        }
    }

    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: 2.4rem;
        padding-right: 2.4rem;
        padding-left: 2.4rem;

        @include respond-to(sm) {
            flex-direction: column-reverse;
            margin-top: 1.6rem;
        }

        @include respond-to(xs) {
            margin-top: 0;
        }

        .fractionPagination {
            @include respond-to(sm) {
                display: none;
            }
        }
    }

    .nav {
        @include respond-to(sm) {
            width: 100%;
            margin-top: 1.6rem;
        }

        @include respond-to(xs) {
            display: none;
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

    .btn {
        padding-right: 2.4rem;
        padding-left: 2.4rem;

        @include respond-to(sm) {
            width: 100%;
        }
    }
</style>
