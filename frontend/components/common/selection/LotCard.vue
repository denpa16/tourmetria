<template>
    <div :class="[$style.LotCard, ...classes]">
        <div :class="$style.lotTags">
            <VTag
                v-if="lot.special_promotion"
                :label="`Ипотека ${lot.special_promotion}`"
                color="primary"
            />
            <VTag
                v-if="lot.has_promotions"
                label="Акция"
                :color="bgColor === 'white' ? 'light' : 'white'"
                :link="{path: '/blog/promotions', query: {flat: `${lot.project_slug},${lot.id}`}}"
                blank
                @click.native.stop
            />
            <VTag
                v-if="lotNumberLabel"
                :label="lotNumberLabel"
                :color="bgColor === 'white' ? 'light' : 'white'"
            />
            <VTag
                v-if="lot.finish_name"
                :label="lot.finish_name"
                color="primary"
            />
        </div>
        <!--        <span-->
        <!--            v-show="iconPlace === 'images'"-->
        <!--            :class="$style.favBtn"-->
        <!--            @click.prevent="toggleHeart"-->
        <!--        >-->
        <!--            <IconHeartFilled :class="[$style.iconHeart, activeClass]" />-->
        <!--        </span>-->
        <component
            :is="component"
            v-if="images && images.length"
            ref="slider"
            class="swiper"
            :class="$style.lotImages"
            :to="href"
            :target="target"
        >
            <div class="swiper-wrapper">
                <div
                    v-for="(image, index) in images"
                    :key="index"
                    class="swiper-slide"
                    :class="$style.slide"
                >
                    <ImageLazy
                        :image="image"
                        relative
                        contain
                    />
                </div>
            </div>
            <div
                v-if="isSlider"
                :class="$style.navigation"
            >
                <div
                    ref="prev"
                    :class="$style.navBtnWrapper"
                >
                    <VSquareButton
                        :class="$style.navBtn"
                        size="custom"
                        color="white"
                        aria-label="Предыдущий слайд"
                    >
                        <IconArrowLeft :class="$style.navIcon" />
                    </VSquareButton>
                </div>
                <div
                    ref="next"
                    :class="$style.navBtnWrapper"
                >
                    <VSquareButton
                        :class="[$style.navBtn, $style._right]"
                        size="custom"
                        color="white"
                        aria-label="Следующий слайд"
                    >
                        <IconArrowLeft :class="$style.navIcon" />
                    </VSquareButton>
                </div>
            </div>
        </component>
        <component :is="component"
                   v-else
                   :class="$style.emptyImage"
                   :to="href || '/'"
                   :target="target">
            <img :class="[$style.planEmpty]"
                 src="/images/flat/emptyPlan.svg"
                 alt="Планировка отсутствует"
            >

            <p :class="$style.textEmpty"
            >
                на данный момент <br> планировка отсутствует
            </p>
        </component>
        <div :class="[$style.pagination, `swiper-pagination-${lot.id}`]"></div>
        <component :is="component"
                   :class="[$style.lotInfo, ...classes]"
                   :to="href || '/'"
                   :target="target">
            <h5
                :class="[$style.lotArea, $style._withIcon, 'h5']"
                v-html="name"
            ></h5>
            <!--            <span-->
            <!--                v-show="iconPlace === 'info'"-->
            <!--                :class="[$style.favBtn, $style._info]"-->
            <!--                @click.prevent="toggleHeart"-->
            <!--            >-->
            <!--                <IconHeartFilled :class="[$style.iconHeart, activeClass]" />-->
            <!--            </span>-->
            <div :class="$style.lotContainer">
                <h5 :class="[$style.lotPrice, 'h5']">
                    {{ lot.original_price ? formattedOriginalPrice : formattedPrice }} ₽
                    <span v-if="lot.original_price"
                          :class="$style._original"
                    >
                        {{ formattedPrice }} ₽
                    </span>
                </h5>
                <VTooltip
                    v-if="lot.price_additional_info"
                    top-left
                >
                    <template #activator>
                        <span :class="$style.iconTooltip">
                            ?
                        </span>
                    </template>
                    <div :class="$style.tooltip">
                        {{ lot.price_additional_info }}
                    </div>
                </VTooltip>
            </div>
            <ul :class="$style.lotDetails">
                <li :class="[$style.lotDetail,'p6', 'c-base400']">
                    {{ lot.project_name }}
                </li>
                <li :class="[$style.lotDetail,'p6', 'c-base400']">
                    Литер {{ lot.building }}
                </li>
                <li v-if="lot.floor"
                    :class="[$style.lotDetail,'p6', 'c-base400']">
                    {{ lot.floor }} этаж
                </li>
            </ul>
        </component>
        <div
            v-if="$slots.btns"
            :class="$style.btns"
        >
            <slot name="btns"></slot>
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {getFlatTitle, splitThousands} from '~/assets/js/utils/numberUtils';

    import VTag from '~/components/ui/tag/VTag';
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    // import IconHeartFilled from '~/components/icons/IconHeartFilled';
    import VTooltip from '~/components/ui/tooltip/VTooltip';
    import {mapState} from 'vuex';

    export default {
        name: 'LotCard',

        components: {VTooltip,
                     // IconHeartFilled,
                     ImageLazy,
                     VTag,
                     IconArrowLeft},

        props: {
            lot: {
                type: Object,
                default: () => ({})
            },

            lotType: {
                type: String,
                default: 'flat',
            },

            bgColor: {
                type: String,
                default: 'light',
                validator(value) {
                    return ['light', 'white'].indexOf(value) !== -1;
                },
            },

            iconPlace: {
                type: String,
                default: 'images',
                validator(value) {
                    return ['images', 'info'].indexOf(value) !== -1;
                },
            }
        },

        data() {
            return {
                slider: null,
                sliderRef: null,
                activeSlide: 0,
                isTooltipShown: false,
                isFavorite: false
            };
        },

        computed: {
            ...mapState('domain', ['isHideLayout']),

            classes() {
                return [this.$style[`is-color-${this.bgColor}`]];
            },

            target() {
                return this.isHideLayout ? '_self' : '_blank';
            },

            images() {
                const images = [];
                if (this.lot.plan) {
                    images.push(this.lot.plan);
                }
                return images;
            },

            isSlider() {
                return this.images.length > 1;
            },

            activeClass() {
                return this.isFavorite ? this.$style._active : '';
            },

            name() {
                const area = this.lot?.area ? `, ${this.lot.area}&nbsp;м<sup>2</sup>` : '';
                const rooms = this.lot?.rooms ? this.lot.rooms : 0;
                return rooms === 0 ? 'квартира ' + String(getFlatTitle(rooms).fullNumber) + area : String(getFlatTitle(rooms).fullNumber) + ' квартира' + area;
            },

            component() {
                return this.href && !this.$slots.btns ? 'nuxt-link' : 'div';
            },

            href() {
                switch (this.lotType) {
                    case 'flat':
                        return this.lot?.id ? `/selection/flats/${this.lot.id}` : '';
                    case 'parking':
                        return '';
                    case 'commercial':
                        return '';
                    case 'storage':
                        return '';
                    default:
                        return '';
                }
            },

            formattedPrice() {
                return this.formatPrice(this.lot?.price);
            },

            formattedOriginalPrice() {
                return this.formatPrice(this.lot?.original_price);
            },

            lotNumberLabel() {
                return this.lot?.number ? `${this.lot.number} кв` : '';
            },
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

        beforeDestroy() {
            if (this.sliderRef) {
                removeResizeListener(this.sliderRef, this.update);
            }
            this.slider?.destroy();
        },

        mounted() {
            this.sliderRef = this.$refs.slider?.$el || this.$refs.slider;
            if (this.sliderRef) {
                addResizeListener(this.sliderRef, this.update);
            }
        },

        methods: {
            initSlider() {
                if (this.sliderRef && this.isSlider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        allowTouchMove: true,
                        loop: true,
                        pagination: {
                            el: `.swiper-pagination-${this.lot.id}`,
                            type: 'bullets',
                            clickable: true,
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || false,
                        },
                    };

                    this.slider = new this.$Swiper(this.sliderRef, options);
                    this.$nextTick(() => {
                        this.slider.lazy.load();
                    });

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

            toggleHeart() {
                this.isFavorite = !this.isFavorite;
            },

            formatPrice(price) {
                switch (typeof price) {
                    case 'number':
                        return splitThousands(price);
                    case 'string':
                        return splitThousands(parseFloat(price.trim()));
                    default:
                        return price;
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .LotCard {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        min-height: 44.8rem;
        padding-top: 6.7rem;
        border-radius: .8rem;
        transition: background-color $default-transition;

        &.is-color-light {
            background-color: $base-50;

            @include hover {
                background-color: $base-110;
            }
        }

        &.is-color-white {
            background-color: $base-0;
        }

        @include hover {
            .navigation,
            .pagination {
                opacity: 1;
            }
        }
    }

    .lotTags {
        position: absolute;
        top: 1.6rem;
        left: 1.6rem;
        display: flex;

        & > *:not(:last-child) {
            margin-right: .4rem;
        }
    }

    .favBtn {
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        padding: .6rem;

        &_info {
            top: 1.6rem;
            right: 1.6rem;
        }
    }

    .iconHeart {
        width: 1.6rem;
        height: 1.4rem;
        cursor: pointer;

        @include hover {
            :global(path) {
                stroke: $blue;
                stroke-width: .15rem;
                fill: transparent;
            }
        }

        :global(path) {
            stroke: $base-400;
            stroke-width: .15rem;
            fill: transparent;
            transition: all $default-transition;
        }

        &._active {
            :global(path) {
                fill: $blue;
                stroke: $blue;
            }
        }
    }

    .lotImages {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 21.4rem;

        .slide {
            padding: 0 1.6rem;
        }
    }

    .lotInfo {
        position: relative;
        display: block;
        width: calc(100% - 1.6rem);
        margin: auto auto .8rem;
        padding: 1.6rem;
        border-radius: .8rem;

        &.is-color-light {
            background-color: $base-0;
        }

        &.is-color-white {
            background-color: $base-50;
        }
    }

    .lotArea {
        text-transform: uppercase;
        line-height: 2.4rem;

        &._withIcon {
            padding-right: 2.8rem;
        }
    }

    .lotContainer {
        display: flex;
        align-items: center;
        margin-bottom: 1.2rem;
    }

    .lotPrice {
        margin-right: .6rem;
        color: $primary-500;

        ._original {
            position: relative;
            margin: 0 .4rem;
            font-size: 1.4rem;
            font-weight: 400;
            color: $base-600;

            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: $primary-500;
                transform: translateY(-50%);
            }
        }
    }

    .iconTooltip {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        border: 1px solid $base-100;
        font-size: .9rem;
        font-weight: 600;
        color: $base-800;
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            border-color: $base-800;
        }
    }

    .tooltip {
        max-width: 22.5rem;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-400;
    }

    .lotDetails {
        display: flex;
        align-items: center;

        & > *:not(:last-child) {
            margin-right: 2rem;
        }
    }

    .lotDetail {
        position: relative;

        &:not(&:last-child) {
            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: calc(100% + .8rem);
                width: .4rem;
                height: .4rem;
                border-radius: 50%;
                background-color: $primary-500;
                transform: translateY(-50%);
            }
        }
    }

    .pagination {
        width: 100%;
        margin-top: 2.4rem;
        text-align: center;
        opacity: 0;
        transition: opacity .3s linear;

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $base-200;
            opacity: unset;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: $primary-500;
        }

        @include respond-to(sm) {
            opacity: 1;
        }
    }

    .emptyImage {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 21.4rem;
        margin: 0 auto;
    }

    .planEmpty {
        width: 75%;
        height: 75%;
        object-fit: contain;
        opacity: .4;
    }

    .textEmpty {
        margin-top: 1rem;
        text-align: center;
        text-transform: uppercase;
        font-size: 1.4rem;
        font-weight: 700;
        line-height: 1.6rem;
        color: $base-300;
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
        opacity: 0;
        transform: translateY(-50%);
        transition: opacity .3s linear;
    }

    .navBtnWrapper {
        padding: .7rem;
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

    .btns {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        padding: .8rem;

        & > *:not(:last-child) {
            margin-right: .8rem;
        }
    }
</style>
