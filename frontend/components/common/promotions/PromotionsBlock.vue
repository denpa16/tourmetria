<template>
    <div :class="[$style.PromotionsBlock, 'promotions-block']">
        <h3 :class="[$style.promotionsTitle, 'h3']">
            <span v-if="!title.length">
                Акции и скидки
                <span :class="$style.promotionsCounter">
                    {{ promoCount }}
                </span>
            </span>
            <span v-else>
                {{ title }}
            </span>
        </h3>
        <transition name="fade-content">
            <div
                v-show="isLoaded"
                ref="slider"
                :class="[$style.promotionList,'swiper']"
            >
                <ul :class="[$style.promotionListWrap, 'swiper-wrapper']">
                    <li
                        v-for="promo in promoListToShow"
                        :key="promo.id"
                        :class="[$style.promotionsItem, 'swiper-slide']"
                    >
                        <PromotionCard :promotion="promo"
                                       :preferred-project-name="preferredProjectName" />
                    </li>
                </ul>
                <div
                    class="swiper-pagination"
                    :class="$style.sliderPagination"
                >
                </div>
            </div>
        </transition>
        <VButton
            :class="$style.promotionsBtn"
            color="light"
            :link="btnLink"
        >
            Смотреть все
        </VButton>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import PromotionCard from '~/components/common/promotions/PromotionCard';

    export default {
        name: 'PromotionsBlock',
        components: {PromotionCard},
        mixins: [breakpointCheck],
        props: {
            promoList: {
                type: Array,
                default: () => []
            },

            promoCount: {
                type: [Number, String],
                default: 0
            },

            title: {
                type: String,
                default: ''
            },

            preferredProjectName: {
                type: String,
                default: '',
            },

            preferredProjectSlug: {
                type: String,
                default: '',
            },


            // Используется для создания ссылки на странцу акций с включенным фильтром по проекту
            projectFilter: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                windowWidth: 0,
                isLoaded: false
            };
        },

        computed: {
            promoListToShow() {
                return this.breakpoint === 'sm' ? this.promoList.slice(0, 2) : this.promoList.slice(0, 3);
            },

            btnLink() {
                return this.projectFilter ? `/blog/promotions?projects=${this.projectFilter}` : '/blog/promotions';
            }
        },

        watch: {
            promoList() {
                this.updateSlider();
            }
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.updateSlider);
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSlider);
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        spaceBetween: 12,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false,
                                slidesPerView: 3,
                            },

                            768: {
                                allowTouchMove: false,
                                slidesPerView: 2
                            },

                            320: {
                                allowTouchMove: true,
                                slidesPerView: 1.0005
                            }
                        },

                        pagination: {
                            el: '.swiper-pagination',
                            type: 'bullets',
                            clickable: true,
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);
                }
            },

            updateSlider() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },
        }
    };
</script>

<style lang="scss" module>
    .PromotionsBlock {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 6.4rem 2.4rem;

        @include respond-to(sm) {
            padding: 9.6rem 2.4rem;
        }

        @include respond-to(xs) {
            padding: 1.6rem 0 4rem;
        }
    }

    .promotionsTitle {
        margin-bottom: 6.4rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-size: 2rem;
        }
    }

    .promotionsCounter {
        color: $base-300;
    }

    .promotionList {
        width: 100%;
        max-width: 139.1rem;

        &:global(.swiper) {
            @include respond-to(xs) {
                padding: 0 1.6rem;
            }
        }

        .promotionListWrap {
            max-width: 139.1rem;
            height: 58.4rem;
            margin-bottom: 6.4rem;

            @include respond-to(sm) {
                height: 52.6rem;
                margin-bottom: 2.4rem;
            }

            @include respond-to(xs) {
                height: 20.6rem;
                margin-bottom: 2.4rem;
            }
        }

        .sliderPagination {
            position: static;
            display: none;
            margin-bottom: 2.4rem;

            @include respond-to(xs) {
                display: block;
            }

            :global(.swiper-pagination-bullet) {
                width: 6px;
                height: 6px;
                background-color: $base-400;
            }

            :global(.swiper-pagination-bullet-active) {
                background-color: #000;
            }
        }
    }

    .promotionsItem {
        height: 100%;

        &:last-child {
            @include respond-to(xs) {
                margin-right: 3.2rem;
            }
        }
    }

    .promotionsBtn {
        @include respond-to(sm) {
            width: 100%;
        }

        @include respond-to(xs) {
            width: calc(100% - 32px);
        }
    }
</style>
