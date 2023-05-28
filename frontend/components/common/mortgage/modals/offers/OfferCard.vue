<template>
    <article
        :class="[$style.OfferCard, {[$style._notAvailable]: isNotEnoughInitialPayment || (offer.list && index === 0)}]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="leftApplication"
    >
        <div :class="$style.cardWrapper">
            <div :class="$style.offerInfo">
                <ul :class="$style.offerConditions">
                    <li
                        v-for="(condition,i) in conditionList"
                        :key="i"
                        :class="[$style.condition, 'p3']"
                    >
                        {{ condition }}
                        <VTooltip
                            v-if="i === 0 && offer.subsidy_monthly_amount"
                            :class="$style.tooltipWrapper"
                            top
                            :nudge="12"
                        >
                            <template #activator>
                                <IconInfo :class="$style.iconInfo" />
                            </template>
                            <div :class="[$style.tooltip, 'p6', 'c-base400']">
                                <p>
                                    Ежемесячный платеж:<br>
                                    <span :class="$style.tooltipLine">• {{ firstTooltipLine }};</span>
                                    <span :class="$style.tooltipLine">• далее — {{ offer.monthly_amount | splitThousands }} руб.</span>
                                </p>
                            </div>
                        </VTooltip>
                    </li>
                </ul>
                <div :class="$style.offerTypes">
                    <p :class="[$style.type, 'p6', 'c-blue']">
                        {{ currentProgramName }}
                    </p>
                    <span
                        v-if="offer.program_name"
                        :class="$style.dot"
                    >
                    </span>
                    <p :class="[$style.program, 'p6', 'c-base300']">
                        {{ offer.program_name }}
                    </p>
                </div>
            </div>
            <VButton
                :class="$style.button"
                size="medium"
                :color="buttonColor"
            >
                {{ buttonText }}
            </VButton>
        </div>

        <div v-if="offer.list && index === 0"
             :class="$style.plank">
            <span :class="['p5', 'c-base0']">Доступны субсидированные ипотечные программы</span>
        </div>
        <div v-else-if="isNotEnoughInitialPayment"
             :class="$style.plank">
            <IconArrowUpIntoCircle :class="$style.arrowIcon" />
            <span :class="['p5', 'c-base0']">Доступно при повышении первоначального взноса на {{ differenceBetweenInitialPayments }}%</span>
        </div>
    </article>
</template>

<script>
    import {plural} from '~/assets/js/utils/textUtils';
    import {splitThousands} from '~/assets/js/utils/numberUtils';

    import VButton from '~/components/ui/buttons/VButton';
    import IconArrowUpIntoCircle from '~/components/icons/IconArrowUpIntoCircle';
    import IconInfo from '~/components/icons/IconInfo';
    export default {
        name: 'OfferCard',
        components: {IconInfo, IconArrowUpIntoCircle, VButton},
        props: {
            offer: {
                type: Object,
                default: () => ({})
            },

            index: {
                type: Number,
                default: 0
            },

            currentProgramName: {
                type: String,
                default: ''
            },

            currentInitialPayment: {
                type: Number,
                default: 0
            },

            currentCost: {
                type: Number,
                default: 0
            },
        },

        data() {
            return {
                isMouseEntered: false
            };
        },

        computed: {
            buttonColor() {
                return this.isMouseEntered ? 'primary' : 'white-additional';
            },

            buttonText() {
                if (this.offer?.list) {
                    return `Посмотреть ${this.offer.list.length} ${plural(this.offer.list.length, ['предложениe', 'предложения', 'предложений'])}`;
                }

                return this.isNotEnoughInitialPayment ? 'Узнать подробнее' : 'Оставить заявку';
            },

            termText() {
                return `до ${this.offer.term} ${plural(this.offer.term, ['года', 'лет', 'лет'])}`;
            },

            conditionList() {
                return [
                    `${splitThousands(Math.ceil(this.offer.monthly_amount))} ₽/мес.`,
                    `до ${this.offer.term} ${plural(this.offer.term, ['года', 'лет', 'лет'])}`,
                    `от ${this.offer.rate}%`
                ];
            },

            differenceBetweenInitialPayments() {
                return Math.ceil(((this.offer?.deposit - this.currentInitialPayment) / this.currentCost) * 100);
            },

            isNotEnoughInitialPayment() {
                return this.differenceBetweenInitialPayments > 0;
            },

            firstTooltipLine() {
                const startLine = this.offer?.subsidy_period === 1
                    ? 'на первый год'
                    : `на первые ${this.offer?.subsidy_period} ${plural(this.offer?.subsidy_period, ['год', 'года', 'лет'])}`;
                return `${startLine} — ${splitThousands(Math.ceil(this.offer?.subsidy_monthly_amount))} руб`;
            },
        },

        methods: {
            leftApplication() {
                this.$emit('leftApplication', this.offer?.list, this.offer);
            },

            onMouseEnter() {
                this.isMouseEntered = true;
            },

            onMouseLeave() {
                this.isMouseEntered = false;
            }
        },
    };
</script>

<style lang="scss" module>
    .OfferCard {
        overflow: hidden;
        border-radius: .8rem;
        cursor: pointer;

        &._notAvailable {
            border: .1rem solid $blue;
            background-color: $blue;
        }
    }

    .cardWrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 14.8rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(xs) {
            height: fit-content;
        }
    }

    .offerInfo {
        @include respond-to(xs) {
            display: flex;
            flex-direction: column-reverse;
        }
    }

    .offerConditions {
        position: relative;
        display: flex;
        margin-bottom: 1.2rem;
    }

    .condition {
        display: flex;
        margin-right: 3.2rem;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        &:last-child {
            margin-right: 0;
        }
    }

    .tooltipWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .iconInfo {
        width: 1.6rem;
        height: 1.6rem;
        margin-left: .6rem;
        color: $blue;
    }

    .tooltip {
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        padding: 1.6rem 2rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        &:before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 0;
            height: 0;
            border-color: $base-0 transparent transparent transparent;
            border-style: solid;
            border-width: .6rem .6rem 0 .6rem;
            transform: translateX(-50%);
        }
    }

    .tooltipLine {
        display: block;
        white-space: nowrap;
    }

    .offerTypes {
        display: flex;
        align-items: center;

        @include respond-to(xs) {
            flex-direction: column;
            align-items: start;
        }
    }

    .type {
        @include respond-to(xs) {
            margin-bottom: .8rem;
            text-transform: uppercase;
            font-size: 1.2rem;
            line-height: 1.4rem;
            color: $base-800;
        }
    }

    .program {
        @include respond-to(xs) {
            margin-bottom: 1.6rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .button {
        margin: auto 0 0 auto;

        @include respond-to(xs) {
            min-width: 14.5rem;
            height: 3.2rem;
            margin: auto auto 0 0;
        }
    }

    .dot {
        width: .4rem;
        height: .4rem;
        margin: 0 .8rem -.3rem;
        border-radius: 50%;
        background-color: $base-200;
    }

    .plank {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: .9rem;
        padding-bottom: .7rem;
    }

    .arrowIcon {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: .8rem;
        color: $base-0;
    }
</style>
