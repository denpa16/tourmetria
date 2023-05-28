<template>
    <li :class="$style.MortgageBankCard"
        @click="handleCardClick">
        <div :class="$style.bankInfo">
            <img
                :class="$style.bankLogo"
                :src="bankCard.bank_logo"
                :alt="`Логотип банка «${bankCard.bank_name}»`"
            >
            <h4 :class="[$style.bankName, 'h4']">
                <span>{{ bankCard.bank_name }}</span>
                <span :class="[$style.offersCounter, $style._mobile]">
                    Посмотреть
                    {{ offersCounter }}
                    <span :class="$style.counterWord">
                        {{ counterWord }}
                    </span>
                </span>
            </h4>
        </div>
        <div :class="$style.bankFooter">
            <div>
                <VTag
                    v-for="(tab, index) in tagList"
                    :key="index"
                    :class="$style.tag"
                    :label="tab.label"
                    :color="tab.color"
                />
                <span :class="[$style.offersCounter, $style._notMobile]">
                    Посмотреть
                    {{ offersCounter }}
                    <span :class="$style.counterWord">
                        {{ counterWord }}
                    </span>
                </span>
            </div>

            <VSquareButton
                :class="$style.buttonPlus"
                size="xsmall"
                role="presentation"
                tabindex="-1"
            >
                <IconArrowRight :class="$style.icon" />
            </VSquareButton>
        </div>
    </li>
</template>

<script>
    import {plural} from '~/assets/js/utils/textUtils';
    import {splitThousands} from '~/assets/js/utils/numberUtils';

    import VTag from '~/components/ui/tag/VTag';
    import IconArrowRight from '~/components/icons/IconArrowRight';

    export default {
        name: 'MortgageBankCard',
        components: {
            IconArrowRight,
            VTag
        },

        props: {
            bankCard: {
                type: Object,
                default: () => ({})
            },
        },

        computed: {
            offersCounter() {
                if (
                    Array.isArray(this.bankCard.offers)
                    && this.bankCard.offers.length
                    && this.bankCard.offers.some(offer => offer.list)
                ) {
                    return this.bankCard.offers.reduce((res, offer) => res + (offer?.list?.length || 0), 0);
                }
                return this.bankCard.offers.length;
            },

            counterWord() {
                return plural(this.offersCounter, ['предложение', 'предложения', 'предложений']);
            },

            tagList() {
                return [
                    {
                        label: `от ${this.bankCard.rate}%`,
                        color: 'white'
                    },
                    {
                        label: `до ${this.bankCard.term} ${plural(this.bankCard.term, ['год', 'года', 'лет'])}`,
                        color: 'white'
                    },
                    {
                        label: `от ${splitThousands(Math.ceil(this.bankCard.monthly_amount))} ₽/мес.`,
                        color: 'white'
                    }
                ];
            },
        },

        methods: {
            handleCardClick() {
                this.$emit('openModal', this.bankCard);
            },
        },
    };
</script>

<style lang="scss" module>
    .MortgageBankCard {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 16.4rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
        transition: background-color $default-transition;
        cursor: pointer;

        @include hover {
            background-color: $base-110;
        }

        @include respond-to(xs) {
            height: 11.4rem;
        }
    }

    .bankInfo {
        display: flex;
        align-items: center;
    }

    .bankLogo {
        width: 4.4rem;
        height: 4.4rem;
        margin-right: 1.6rem;

        :global(.image-lazy__image) {
            position: static;
        }

        @include respond-to(xs) {
            width: 4rem;
            height: 4rem;
        }
    }

    .bankName {
        margin-right: .6rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0;
            font-size: 1.6rem;
            line-height: 1.6rem;
        }

        & > * {
            @include respond-to(xs) {
                margin-bottom: .4rem;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .offersCounter {
        display: block;
        margin-top: .8rem;
        text-transform: uppercase;
        font-size: 1.2rem;
        line-height: 1.2rem;
        color: $base-300;

        @include respond-to(xs) {
            display: inline;
            margin-top: 0;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: inline;
            }
        }

        &._notMobile {
            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .bankFooter {
        display: flex;
        align-items: flex-end;

        @include respond-to(xs) {
            align-items: center;
        }
    }

    .tag {
        margin-right: .4rem;

        &:last-of-type {
            margin-right: 0;
        }
    }

    .buttonPlus {
        margin-left: auto;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }
</style>
