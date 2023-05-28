<template>
    <ModalWrap @close="close">
        <div :class="$style.ModalFilters">
            <div :class="$style.modalHeader">
                <button
                    :class="[$style.resetButton, 'p6', 'c-blue']"
                    value="Сбросить"
                    @click="resetFilters"
                >
                    Сбросить
                </button>
                <h6 :class="$style.modalTitle">
                    Калькулятор
                </h6>
            </div>
            <VScrollBox :class="$style.filtersScroll">
                <MortgageFilters
                    :class="$style.filters"
                    :values="values"
                    :specs="specs"
                    :facets="facets"
                    @change="handleChangeValue"
                />
            </VScrollBox>
            <div
                v-if="isEmpty && !isLoading"
                :class="$style.emptyBanks"
            >
                <div :class="$style.iconWrapper">
                    <IconBank :class="$style.iconBank" />
                </div>
                <p :class="$style.emptyText">
                    По вашему запросу предложений не найдено
                </p>
            </div>
            <div :class="$style.modalFooter">
                <VButton
                    :loading="isLoading"
                    :spinner="isLoading"
                    :disabled="isEmpty"
                    @click="close"
                >
                    Показать {{ offersCountText }}
                </VButton>
            </div>
        </div>
    </ModalWrap>
</template>

<script>
    import ModalWrap from '~/components/common/ModalWrap';
    import MortgageFilters from '~/components/common/mortgage/MortgageFilters';
    import VButton from '~/components/ui/buttons/VButton';
    import VScrollBox from '~/components/ui/scrollbox/VScrollBox';
    import IconBank from '~/components/icons/IconBank';

    export default {
        name: 'MortgageModalFilters',
        components: {IconBank,
                     VScrollBox,
                     VButton,
                     MortgageFilters,
                     ModalWrap},

        props: {
            values: {
                type: Object,
                default: () => ({})
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            offersCountText: {
                type: String,
                default: ''
            },

            isLoading: {
                type: Boolean,
                default: false
            },
        },

        data() {
            return {};
        },

        computed: {
            isEmpty() {
                return this.offersCountText === '0 предложений';
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },

            handleChangeValue(values) {
                this.$emit('change', values);
            },

            resetFilters() {
                this.$emit('reset');
                this.close();
            }
        },
    };
</script>

<style lang="scss" module>
    .ModalFilters {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
    }

    .modalHeader {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 6.4rem;
        border-bottom: 1px solid $base-100;
    }

    .resetButton {
        display: none;

        @include respond-to(xs) {
            position: absolute;
            top: 2.4rem;
            left: 1.6rem;
            display: block;
        }
    }

    .modalTitle {
        text-transform: uppercase;
        font-weight: 400;
    }

    .filtersScroll {
        flex: auto;
    }

    .filters {
        padding: 1.6rem;
    }

    .emptyBanks {
        display: flex;
        align-items: center;
        width: calc(100% - 3.2rem);
        margin: 0 auto 1.6rem;
        padding: 2.4rem 3rem;
        background-color: $base-50;
    }

    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 4.8rem;
        min-height: 4.8rem;
        margin-right: 2.4rem;
        border-radius: 50%;
        background-color: $base-0;
    }

    .iconBank {
        width: 1.7rem;
        height: 1.7rem;
        color: $blue;
    }

    .emptyText {
        font-size: 1.2rem;
        font-weight: 400;
        line-height: 1.6rem;
    }

    .modalFooter {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 7.6rem;
        padding: 1.6rem;
        border-top: 1px solid $base-100;
    }
</style>
