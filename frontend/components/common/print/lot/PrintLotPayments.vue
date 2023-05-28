<template>
    <div v-if="payments.length"
         :class="$style.PrintLotPayments">
        <IconWallet :class="$style.icon" />
        <ul :class="$style.paymentsList">
            <li v-for="(payment, i) in payments"
                :key="payment.id"
                :class="[$style.paymentsItem, {[$style._odd]: (i + 1) % 2}]">
                {{ payment.type }}
            </li>
        </ul>
    </div>
</template>

<script>
    import IconWallet from '~/components/icons/IconWallet';
    export default {
        name: 'PrintLotPayments',
        components: {IconWallet},
        props: {
            payments: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>

<style lang="scss" module>
    .PrintLotPayments {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 40px;
        background-color: $blue;
    }

    .icon {
        height: 70px;
        margin-right: 4px;
        color: $base-0;
    }

    .paymentsList {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin: -2px -12px;

        & > * {
            margin: 2px 12px;
        }
    }

    .paymentsItem {
        list-style: disc;
        text-transform: uppercase;
        font-size: 20px;
        line-height: 1;
        color: $base-0;

        &._odd {
            list-style: none;
        }
    }
</style>
