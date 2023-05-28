<template>
    <div :class="$style.FlatHeroInfo">
        <div :class="$style.top">
            <h1 :class="[$style.title, 'h3']"
                v-html="name"></h1>

            <TagsList :tags="tags"
                      :class="$style.tags" />

            <FlatHeroInfoButtons :class="$style.sharePanel"
                                 :brochure-link="brochureLink"
                                 :plan-link="planLink"
                                 :origin-url="originUrl"
                                 :is-mortgage-loading="isMortgageLoading" />

            <!--            <VSquareButton color="light"-->
            <!--                           :class="$style.favBtn">-->
            <!--                <IconHeart :class="$style.iconHeart" />-->
            <!--            </VSquareButton>-->
        </div>

        <FlatHeroInfoMain :lot="lot"
                          :class="$style.mainInfoDesk" />

        <div :class="$style.wrapper">
            <div :class="$style.additionalInfo">
                <div v-if="lot.completion_year && deadlineText"
                     :class="[$style.additionalCard, {[$style._wide]: !lot.rooms}]">
                    <p class="p6 c-base300">
                        Сдача
                    </p>
                    <p :class="[$style.additionalValue, 'p2']"
                       v-html="deadlineText"></p>
                </div>
                <div v-if="lot.living_area"
                     :class="$style.additionalCard">
                    <p class="p6 c-base300">
                        Жилая площадь
                    </p>
                    <p :class="[$style.additionalValue, 'p2']">
                        {{ lot.living_area }} м<sup>2</sup>
                    </p>
                </div>
                <div v-if="lot.kitchen_area && lot.rooms"
                     :class="$style.additionalCard">
                    <p class="p6 c-base300">
                        Площадь кухни
                    </p>
                    <p :class="[$style.additionalValue, 'p2']">
                        {{ lot.kitchen_area }} м<sup>2</sup>
                    </p>
                </div>
                <div :class="$style.additionalCard">
                    <p class="p6 c-base300">
                        Наличие отделки
                    </p>
                    <div :class="[$style.additionalValue, 'p2']">
                        <span>{{ lot.finish_name || 'Без отделки' }}</span>
                        <VTooltip
                            v-if="lot.finish_description"
                            top-left
                            :activator-offset-x="20"
                            :nudge="11"
                            :class="[$style.tooltipWrapper, $style._furnish]"
                        >
                            <template #activator>
                                <span :class="$style.iconTooltip">
                                    ?
                                </span>
                            </template>
                            <div :class="$style.tooltip">
                                {{ lot.finish_description }}
                            </div>
                        </VTooltip>
                    </div>

                </div>
            </div>

            <FlatHeroInfoMain :lot="lot"
                              :class="$style.mainInfoMobile" />

            <div :class="$style.prices">
                <div :class="$style.pricesColumn">
                    <p class="p6 c-base300">
                        Цена при 100% оплате
                    </p>
                    <div :class="$style.pricesValues">
                        <span v-if="lot.original_price"
                              :class="$style.fullPrice">
                            {{ lot.price | splitThousands }} Р
                        </span>
                        <div v-if="lot.price"
                             :class="[$style.price, 'h4', 'c-blue']">
                            {{ (lot.original_price || lot.price) | splitThousands }} Р
                        </div>
                        <VTooltip
                            v-if="lot.price_additional_info"
                            top-left
                            :activator-offset-x="20"
                            :nudge="11"
                            :class="$style.tooltipWrapper"
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
                </div>
                <div :class="$style.pricesColumn">
                    <p class="p6 c-base300">
                        В ипотеку <span class="c-blue"></span>
                    </p>
                    <div :class="$style.pricesValues">
                        <button :class="[$style.mortgageBtn, 'h4']"
                                :value="`от ${lot.min_mortgage} Р/мес`"
                                @click="scrollToMortgage">
                            от {{ Math.ceil(lot.min_mortgage) | splitThousands }} Р/мес
                            <IconArrowLeft :class="$style.iconArrow" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.buttons">
            <VButton
                :class="$style.button"
                @click="bookOnline"
            >
                Забронировать онлайн
            </VButton>
            <VButton color="light"
                     :class="$style.button"
                     @click="$emit('open-call-modal')">
                Получить консультацию
            </VButton>
        </div>

        <FlatHeroInfoButtonsMobile :class="$style.buttonsMobile"
                                   :brochure-link="brochureLink"
                                   :lot="lot"
                                   :is-mortgage-loading="isMortgageLoading" />
    </div>
</template>

<script>
    import {getFlatTitle, isDeadlinePassed, quaterToRoman} from '~/assets/js/utils/numberUtils';
    import {scrollTo} from '~/assets/js/utils/commonUtils';
    import {plural} from '~/assets/js/utils/textUtils';
    import variables from '~/assets/scss/shared/_variables.scss';

    import VTooltip from '~/components/ui/tooltip/VTooltip';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import FlatHeroInfoButtons from '~/components/pages/selection/flats/flat/hero/FlatHeroInfoButtons';
    import FlatHeroInfoMain from '~/components/pages/selection/flats/flat/hero/FlatHeroInfoMain';
    import FlatHeroInfoButtonsMobile from '~/components/pages/selection/flats/flat/hero/FlatHeroInfoButtonsMobile';
    // import IconHeart from '~/components/icons/IconHeart';
    import TagsList from '~/components/common/TagsList';
    import BookingModal from '~/components/common/selection/flats/flat/booking/BookingModal';

    export default {
        name: 'FlatHeroInfo',

        components: {
            VTooltip,
            IconArrowLeft,
            FlatHeroInfoButtons,
            FlatHeroInfoMain,
            FlatHeroInfoButtonsMobile,
            // IconHeart,
            TagsList,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            originUrl: {
                type: String,
                default: '',
            },

            planLink: {
                type: String,
                default: '',
            },

            isMortgageLoading: {
                type: Boolean,
                default: false,
            },

            minRate: {
                type: [String, Number],
                default: '',
            },
        },

        computed: {
            name() {
                const area = this.lot?.area ? `, ${this.lot.area}&nbsp;м<sup>2</sup>` : '';
                const rooms = this.lot?.rooms ? this.lot.rooms : 0;
                return rooms === 0 ? 'квартира ' + String(getFlatTitle(rooms).fullNumber) + area : String(getFlatTitle(rooms).fullNumber) + ' квартира' + area;
            },

            tags() {
                const tags = [];
                if (this.lot.days_before_start_sales) {
                    tags.push({label: `До старта продаж ${this.lot.days_before_start_sales} ${plural(this.lot.days_before_start_sales, ['день', 'дня', 'дней'])}`, color: 'primary'});
                }

                if (this.lot.special_promotion) {
                    tags.push({label: `Ипотека ${this.lot.special_promotion}`, color: 'primary'});
                }

                if (this.lot.has_promotions) {
                    tags.push({
                        label: 'Акция',
                        color: 'light',
                        link: {
                            path: '/blog/promotions',
                            query: {flat: `${this.lot.project_slug},${this.lot.id}`},
                        },
                        blank: true,
                    });
                }

                return tags;
            },

            brochureLink() {
                const path = this.$route.fullPath.split('/');
                const lastIdx = path.length ? path.length - 1 : 0;
                return `/pdf/print/${path[lastIdx - 1]}/${path[lastIdx]}?rate=${this.minRate}&format=a4`;
            },

            deadlineText() {
                const quarter = this.lot.completion_quarter;
                const year = this.lot.completion_year;

                if (isDeadlinePassed(year, quarter)) {
                    return 'Объект сдан';
                }

                const quarterLabel = `&nbsp;${this.$deviceIs.mobile ? 'кв.' : 'квартал'}`;
                const yearLabel = `&nbsp;${quarter ? 'года' : 'год'}`;

                if (year) {
                    return `${quaterToRoman(quarter)}${quarterLabel} ${year}${yearLabel}`;
                }

                return '';
            },
        },

        methods: {
            bookOnline() {
                this.$modal.open(BookingModal, {
                    flat: this.lot
                });
            },

            scrollToMortgage() {
                let headerHeight = this.$deviceIs.mobile ? variables['header-mobile-h'] : variables['header-h'];

                if (headerHeight.includes('rem')) {
                    headerHeight = parseFloat(headerHeight) * 10;
                } else {
                    headerHeight = parseFloat(headerHeight);
                }

                scrollTo('mortgage', headerHeight);
            },
        }

    };
</script>

<style lang="scss" module>
    .FlatHeroInfo {
        display: flex;
        flex-direction: column;
        padding: 4rem 2.4rem 2rem;
        border-radius: 1.6rem;
        background-color: $base-0;

        @include respond-to(sm) {
            padding: 2.4rem;
        }

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }

    .top {
        position: relative;
        padding-right: 16.8rem;

        @include respond-to(sm) {
            padding-right: 32rem;
        }

        @include respond-to(xs) {
            padding-right: 6rem;
        }
    }

    .sharePanel {
        position: absolute;
        top: 0;
        right: 0;

        @include respond-to(xs) {
            &:global(.share-panel) {
                display: none;
            }
        }
    }

    .favBtn {
        position: absolute;
        top: 0;
        right: 0;
        display: none;
        opacity: 0;
        transform: opacity $default-transition;

        @include respond-to(xs) {
            display: block;
            opacity: 1;
        }
    }

    .iconHeart {
        width: 1.2rem;
        height: 1.2rem;
    }

    .title {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }

    .tags {
        margin-top: 1.2rem;
    }

    .mainInfoDesk {
        @include respond-to(xs) {
            display: none;
        }
    }

    .mainInfoMobile {
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .wrapper {
        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            flex-direction: column-reverse;
            margin-top: 2.4rem;
        }
    }

    .additionalInfo {
        display: flex;
        margin: 0 -.4rem;

        @include respond-to(sm) {
            flex: 1;
            flex-wrap: wrap;
            margin: -.4rem;
        }
    }

    .additionalCard {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 10.7rem;
        margin: 0 .4rem;
        padding: 1.56rem 1.5rem;
        border-radius: 1rem;
        background-color: $base-50;

        @include respond-to(sm) {
            flex: unset;
            width: calc(50% - .8rem);
            margin: .4rem;
            padding: 1.6rem;
        }

        @include respond-to(xs) {
            height: 7.2rem;
        }

        &._wide {
            @include respond-to(sm) {
                width: calc(100%);
            }
        }
    }

    .additionalValue {
        position: relative;
        margin-top: auto;
        padding-right: 1rem;

        @include respond-to(md) {
            padding-right: 2.4rem;
        }
    }

    .prices {
        display: flex;
        width: 100%;
        height: 11.6rem;
        margin-top: 1.4rem;
        margin-bottom: 1.9rem;
        border-radius: 1rem;
        background-color: $base-50;

        @include respond-to(sm) {
            flex: 1;
            flex-direction: column;
            height: unset;
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 1.6rem;
            background-color: $base-0;
        }

        @include respond-to(xs) {
            margin-left: 0;
        }
    }

    .pricesColumn {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 1.6rem 1.6rem 1rem;

        @include respond-to(sm) {
            height: 10.7rem;
            border-radius: .8rem;
            background-color: $base-50;

            &:not(:last-child) {
                margin-bottom: .8rem;
            }
        }

        @include respond-to(xs) {
            height: 8rem;
            min-height: 8rem;
        }
    }

    .pricesValues {
        position: relative;
        margin-top: auto;

        @include respond-to(xs) {
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-start;
            justify-content: flex-end;
        }
    }

    .fullPrice {
        position: relative;
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 2.8rem;

        &:before {
            content: '';
            position: absolute;
            top: 45%;
            left: 50%;
            width: 104%;
            height: 2px;
            background-color: $blue;
            transform: translate(-50%, -50%);
        }

        @include respond-to(xs) {
            margin-left: 1.4rem;
            font-size: 1.4rem;
            line-height: 2.8rem;
        }
    }

    .price {
        @include respond-to(xs) {
            font-size: 1.8rem;
            line-height: 2.8rem;
        }
    }

    .tooltipWrapper {
        position: absolute;
        right: 0;
        bottom: .5rem;

        @include respond-to(xs) {
            top: 50%;
            bottom: unset;
            transform: translateY(-50%);
        }

        &._furnish {
            right: -.5rem;
            bottom: 0;

            @include respond-to(xs) {
                top: unset;
                bottom: 0;
                transform: unset;
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
        border: 1px solid $base-800;
        background-color: $base-0;
        font-size: .9rem;
        font-weight: 600;
        line-height: 1;
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

        &:before {
            content: '';
            position: absolute;
            top: 100%;
            right: 21px;
            width: 0;
            height: 0;
            border-color: $base-0 transparent transparent transparent;
            border-style: solid;
            border-width: .6rem .6rem 0 .6rem;
        }
    }

    .iconArrow {
        width: 1.6rem;
        height: 1.6rem;
        transform: translateY(-2px) rotate(180deg);
    }

    .mortgageBtn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        text-transform: uppercase;
        color: $base-950;
        transition: $default-color-transition;
        cursor: pointer;

        @include hover {
            color: $blue;
        }

        @include respond-to(xs) {
            font-size: 1.8rem;
            line-height: 2.8rem;
        }
    }

    .buttons {
        display: flex;
        width: 100%;
        margin-top: auto;

        @include respond-to(sm) {
            margin-top: 2.4rem;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .button {
        flex: 1;

        &:not(:last-child) {
            margin-right: .8rem;
        }
    }

    .buttonsMobile {
        display: none;
        margin-top: 1.6rem;

        @include respond-to(xs) {
            display: block;
        }
    }
</style>
