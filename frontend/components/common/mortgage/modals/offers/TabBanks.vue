<template>
    <div :class="$style.TabBanks">
        <ul :class="$style.bankList">
            <li
                v-for="bank in bankList"
                :key="bank.id"
                :class="$style.bankItem"
                @click="chooseBank(bank)"
            >

                <!--                <BankTab-->
                <!--                    :icon="bank.icon_content"-->
                <!--                    :is-active="bank.id === chosenBank.id"-->
                <!--                />-->
                <img
                    :class="[$style.bankLogo, {[$style._active]: chosenBank.bank_name === bank.bank_name}]"
                    :src="bank.bank_logo"
                    :alt="`Логотип банка «${bank.bank_name}»`"
                >
            </li>
        </ul>
    </div>
</template>

<script>
    // import BankTab from '~/components/common/mortgage/modals/offers/BankTab';
    export default {
        name: 'TabBanks',
        components: {
            // BankTab
        },

        props: {
            bankList: {
                type: Array,
                default: () => []
            },

            chosenBank: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {};
        },

        computed: {},
        methods: {
            chooseBank(bank) {
                this.$emit('chooseBank', bank);
            }
        },
    };
</script>

<style lang="scss" module>
    .TabBanks {
        overflow: auto;
        width: 9.2rem;
        height: 100%;
        border-right: 1px solid $base-100;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        @include respond-to(xs) {
            width: 100%;
            height: fit-content;
            border-right: unset;
            border-bottom: 1px solid $base-100;
        }
    }

    .bankList {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        padding: 2.4rem;

        @include respond-to(xs) {
            flex-direction: row;
            width: fit-content;
            padding: 0 1.6rem 1.6rem;
        }
    }

    .bankItem {
        width: 4.4rem;
        height: 4.4rem;
        margin-bottom: 2.4rem;
        cursor: pointer;

        @include respond-to(xs) {
            width: 4rem;
            height: 4rem;
            margin-right: 1.6rem;
            margin-bottom: 0;
        }

        &:last-child {
            margin-right: 0;
            margin-bottom: 0;
        }
    }

    .bankLogo {
        width: 100%;
        height: 100%;
        transition: all $default-transition;
        filter: grayscale(1);

        &._active {
            filter: grayscale(0);
        }
    }
</style>
