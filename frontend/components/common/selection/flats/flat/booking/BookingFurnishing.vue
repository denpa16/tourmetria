<template>
    <div :class="$style.BookingFurnishing">
        <VScrollBox>
            <div :class="$style.furnishingWrapper">
                <BookingFlatInfo
                    :class="$style.flatInfo"
                    :flat="flat"
                />

                <ul :class="$style.steps">
                    <li
                        v-for="step in steps"
                        :key="step.number"
                        :class="$style.step"
                    >
                        <p :class="$style.stepNumber">
                            {{ step.number }}
                        </p>
                        <p :class="$style.stepDescription">
                            {{ step.description }}
                        </p>
                    </li>
                </ul>

                <ul :class="$style.payment">
                    <li
                        v-for="(payment,index) in paymentList"
                        :key="index"
                        :class="$style.paymentItem"
                    >
                        <p :class="$style.paymentLabel">
                            {{ payment.label }}
                        </p>
                        <div :class="$style.dashedLine"></div>
                        <p :class="[$style.paymentPrice, {[$style['_blue']] : payment.type === 'discount'}]">
                            {{ payment.price }}
                        </p>
                    </li>
                </ul>
                <div :class="$style.currentPayment">
                    <p :class="$style.paymentText">
                        К оплате сейчас
                    </p>
                    <div :class="$style.dashedLine"></div>
                    <p :class="$style.paymentText">
                        {{ amountInRubles }} ₽
                    </p>
                </div>
            </div>
        </VScrollBox>
        <div :class="$style.payButton">
            <VButton
                responsive
                @click="onButtonClick"
            >
                Оплатить
            </VButton>
        </div>
    </div>
</template>

<script>
    import {splitThousands} from '~/assets/js/utils/numberUtils';

    import BookingFlatInfo from '~/components/common/selection/flats/flat/booking/BookingFlatInfo';
    import VScrollBox from '~/components/ui/scrollbox/VScrollBox';
    import VButton from '~/components/ui/buttons/VButton';
    export default {
        name: 'BookingFurnishing',
        components: {VButton,
                     VScrollBox,
                     BookingFlatInfo},

        props: {
            flat: {
                type: Object,
                default: () => ({})
            },

            amount: {
                type: Number,
                default: 10000
            }
        },

        data() {
            return {};
        },

        computed: {
            amountInRubles() {
                return splitThousands(this.amount);
            },

            steps() {
                return [
                    {
                        number: '01',
                        description: 'Перед оплатой вам необходимо заполнить паспортные данные'
                    },
                    {
                        number: '02',
                        description: 'Далее вам будет предложено ознакомиться с договором оферты и перейти на страницу оплаты'
                    },
                    {
                        number: '03',
                        description: 'После оплаты мы заморозим сумму в качестве подтверждения бронирования'
                    },
                    {
                        number: '04',
                        description: `Далее эта сумма (${this.amountInRubles}) будет учтена в стоимости покупки квартиры`
                    },
                ];
            },

            paymentList() {
                return [
                    {
                        label: 'Квартира с опциями',
                        price: `${splitThousands(this.flat.original_price || this.flat.price)} ₽`
                    },
                    {
                        type: 'discount',
                        label: 'Скидка при оплате онлайн',
                        price: `- ${this.amountInRubles} ₽`
                    },
                    {
                        label: 'Бронирование',
                        price: `${this.amountInRubles} ₽`
                    },
                ];
            }
        },

        methods: {
            onButtonClick() {
                this.$emit('pay');
            }
        },
    };
</script>

<style lang="scss" module>
    .BookingFurnishing {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .furnishingWrapper {
        padding: 2.4rem 2.4rem 1.6rem;

        @include respond-to(xs) {
            padding: 1.2rem 1.6rem 1.6rem;
        }
    }

    .flatInfo {
        margin-bottom: 2.4rem;
    }

    .steps {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: .8rem;
        width: 100%;
        margin-bottom: 4.4rem;

        @include respond-to(sm) {
            margin-bottom: 2.4rem;
        }
    }

    .step {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 13.1rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(sm) {
            height: 13.6rem;
        }

        @include respond-to(xs) {
            height: 140px;
        }
    }

    .stepNumber {
        font-size: 1.2rem;
        font-weight: 400;
        line-height: 1.6rem;
        color: $base-300;
    }

    .stepDescription {
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.6rem;
        color: $base-800;
    }

    .payment {
        display: flex;
        flex-direction: column;
        gap: 2.4rem;
        margin-bottom: 4.4rem;
        padding: 4.4rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(sm) {
            margin-bottom: 2.4rem;
            padding: 2.4rem 0;
        }
    }

    .paymentItem {
        display: flex;
        justify-content: space-between;
    }

    .dashedLine {
        flex: auto;
        margin: 0 .8rem;
        border-bottom: 1px dashed $base-100;
        transform: translateY(-.2rem);
    }

    .paymentLabel {
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.6rem;
        color: $base-300;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .paymentPrice {
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.6rem;
        color: $base-600;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        &._blue {
            color: $blue;
        }
    }

    .currentPayment {
        display: flex;
        width: 100%;
    }

    .paymentText {
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.6rem;
        color: $base-800;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .payButton {
        margin-top: auto;
        padding: 1.6rem 2.4rem 0;

        @include respond-to(xs) {
            padding: 1.6rem 1.6rem 0;
        }
    }
</style>
