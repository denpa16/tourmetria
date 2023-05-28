<template>
    <ModalWrap :class="$style.ModalOffers"
               @close="close">
        <div :class="$style.modalWrapper">
            <TabBanks
                :class="$style.bankList"
                :bank-list="bankList"
                :chosen-bank="activeBank"
                @chooseBank="chooseBank"
            />
            <h4 :class="[$style.bankName,'h4']">
                {{ activeBank.bank_name }} <span :class="$style.offersCounter">{{ offersCounter }}</span>
            </h4>

            <transition name="fade-content"
                        mode="out-in">
                <VScrollBox :key="activeBank && activeBank.bank_name && innerList.length"
                            :class="$style.offersWrap">
                    <ul :class="$style.offerList">
                        <li
                            v-for="(offer, index) in (innerList.length ? innerList : offerList)"
                            :key="offer.id"
                            :class="$style.offerItem"
                        >
                            <OfferCard
                                :index="index"
                                :offer="offer"
                                :current-program-name="currentProgramName"
                                :current-initial-payment="currentInitialPayment"
                                :current-cost="currentCost"
                                @leftApplication="leftApplication"
                            />
                        </li>
                    </ul>
                </VScrollBox>
            </transition>
        </div>
    </ModalWrap>
</template>

<script>
    import ModalWrap from '~/components/common/ModalWrap';
    import TabBanks from '~/components/common/mortgage/modals/offers/TabBanks';
    import OfferCard from '~/components/common/mortgage/modals/offers/OfferCard';
    import VScrollBox from '~/components/ui/scrollbox/VScrollBox';
    export default {
        name: 'MortgageModalOffers',
        components: {VScrollBox,
                     OfferCard,
                     TabBanks,
                     ModalWrap},

        props: {
            bankList: {
                type: Array,
                default: () => []
            },

            chosenBank: {
                type: Object,
                default: () => ({})
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
                activeBank: {},
                innerList: [],
            };
        },

        computed: {
            offerList() {
                return this.activeBank.offers;
            },

            offersCounter() {
                return this.offerList?.length;
            }
        },

        mounted() {
            if (this.chosenBank) {
                this.activeBank = this.chosenBank;
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },

            chooseBank(bank) {
                this.innerList = [];
                this.activeBank = bank;
            },

            leftApplication(list, offer) {
                if (list) {
                    this.innerList = list;
                    return;
                }

                this.$emit('leftApplication', offer);
            }
        },
    };
</script>

<style lang="scss" module>
    .ModalOffers {
        & :global(.modal-wrap-container) {
            @include respond-to(sm) {
                width: 58.6rem;
            }

            @include respond-to(xs) {
                width: 100%;
            }
        }
    }

    .modalWrapper {
        overflow: hidden;
        display: grid;
        grid-template-areas: "banks name" "banks wrap";
        grid-template-columns: 9.2rem auto;
        grid-template-rows: 9.2rem auto;
        height: 100%;

        @include respond-to(xs) {
            grid-template-areas: "name" "banks" "wrap";
            grid-template-columns: initial;
            grid-template-rows: 6.4rem 7.2rem auto;
        }
    }

    .bankList {
        grid-area: banks;
    }

    .bankName {
        grid-area: name;
        display: flex;
        align-items: center;
        padding: 0 2.4rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            display: flex;
            align-items: center;
            height: 6.4rem;
            padding: 1.6rem;
            font-size: 1.2rem;
            line-height: 1.2rem;
        }
    }

    .offersCounter {
        margin-left: .4rem;
        color: $base-300;
    }

    .offersWrap {
        grid-area: wrap;
    }

    .offerList {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 2.4rem 2.4rem;

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }

    .offerItem {
        margin-bottom: .8rem;

        @include respond-to(xs) {
            margin-bottom: 1.2rem;
        }
    }
</style>
