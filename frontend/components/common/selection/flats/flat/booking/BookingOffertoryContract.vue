<template>
    <div :class="$style.OffertoryContract">
        <VScrollBox
            :class="[$style.containerScroll, {[$style._end]: isEndScroll}, {[$style._top]: isTopScroll}]"
            resizable
            @scroll-top="handleScrollTop"
            @scroll-end="handleScrollEnd"
        >
            <div :class="$style.offertoryWrapper">
                <BookingFlatInfo
                    :class="$style.flatInfo"
                    :flat="flat"
                />
                <div
                    :class="$style.offerAgreement"
                    v-html="offerAgreement"
                >
                </div>
            </div>
        </VScrollBox>
        <div :class="$style.buttons">
            <VButton
                color="light"
                @click="back"
            >
                Назад
            </VButton>
            <VButton
                responsive
                :disabled="!isEndScroll"
                @click="onButtonClick"
            >
                Принять условия и оплатить бронирование
            </VButton>
        </div>
    </div>
</template>

<script>
    import BookingFlatInfo from '~/components/common/selection/flats/flat/booking/BookingFlatInfo';
    import VButton from '~/components/ui/buttons/VButton';

    export default {
        name: 'BookingOffertoryContract',
        components: {VButton,
                     BookingFlatInfo},

        props: {
            flat: {
                type: Object,
                default: () => ({})
            },

            offerAgreement: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                isEndScroll: false,
                isTopScroll: true
            };
        },

        computed: {},
        methods: {
            handleScrollEnd(value) {
                this.isEndScroll = value;
            },

            handleScrollTop(value) {
                this.isTopScroll = value;
            },

            back() {
                this.$emit('back');
            },

            onButtonClick() {
                this.$emit('agreed');
            }
        },
    };
</script>

<style lang="scss" module>
    .OffertoryContract {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .offertoryWrapper {
        padding: 2.4rem;

        @include respond-to(xs) {
            padding: 1.2rem 1.6rem 0;
        }
    }

    .flatInfo {
        margin-bottom: 2.4rem;
    }

    .containerScroll {
        position: relative;
        flex: auto;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 4rem;
            background: linear-gradient(to bottom, #fff, transparent);
            opacity: 1;
            transition: opacity $default-transition;
        }

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 4rem;
            background: linear-gradient(to top, #fff, transparent);
            opacity: 1;
            transition: opacity $default-transition;
        }

        &._top {
            &:before {
                opacity: 0;
            }
        }

        &._end {
            &:after {
                opacity: 0;
            }
        }
    }

    .offerAgreement {
        ol {
            padding-left: 1.8rem;
        }

        table {
            /* stylelint-disable */
            width: 100% !important;
            /* stylelint-enable */
            margin-top: 1.6rem;

            td {
                /* stylelint-disable */
                border-color: $base-300 !important;
                /* stylelint-enable */
            }
        }

        ol > li::marker {
            font-family: $base-font;
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.6rem;
            letter-spacing: -.02em;
            color: $base-300;
        }

        li:has(strong)::marker {
            color: $base-800;
        }

        u {
            text-decoration: none;
            color: $blue;
            opacity: 1;
            transition: opacity $default-transition;

            @include hover {
                opacity: .8;
            }
        }

        h6,
        strong {
            margin-bottom: 1.6rem;
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.6rem;
            letter-spacing: -.02em;
            color: $base-800;

            ol > li::marker {
                color: $base-800;
            }
        }

        p {
            margin-bottom: 1.6rem;
            /* stylelint-disable */
            margin-left: 0 !important;
            /* stylelint-enable */
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 2rem;
            color: $base-300;
        }

        span {
            /* stylelint-disable */
            font-family: $accent-font-family;
            font-size: 1.4rem !important;
            font-weight: 500 !important;
            line-height: 1.95rem !important;
            color: $base-300 !important;
            /* stylelint-enable */
        }

        table span {
            /* stylelint-disable */
            font-size: 1.2rem !important;
            font-weight: 500 !important;
            line-height: 1.6rem !important;
            color: $base-400 !important;
            /* stylelint-enable */
        }
    }

    .buttons {
        display: flex;
        padding: 0 2.4rem;

        & > *:not(:last-child) {
            margin-right: 1.6rem;
        }
    }
</style>
