<template>
    <PrintPage :class="$style.PrintLot">
        <PrintLotHero :class="$style.hero"
                      :lot="lot"
                      :project="project" />
        <PrintLotBenefits :class="$style.benefits"
                          :lot="lot" />
        <PrintLotPayments :payments="payments" />

        <FlatHeroFloor v-if="lot && lot.layout_on_floor && lot.layout_on_floor.plan_on_floor"
                       :class="$style.floorPlan"
                       :lot="lot" />
        <PrintLotPromo :class="$style.promo"
                       :lot="lot" />
    </PrintPage>
</template>

<script>
    import PrintPage from '~/components/common/print/PrintPage';
    import PrintLotHero from '~/components/common/print/lot/PrintLotHero';
    import PrintLotBenefits from '~/components/common/print/lot/PrintLotBenefits';
    import PrintLotPayments from '~/components/common/print/lot/PrintLotPayments';
    import FlatHeroFloor from '~/components/pages/selection/flats/flat/hero/FlatHeroFloor';
    import PrintLotPromo from '~/components/common/print/lot/PrintLotPromo';

    export default {
        name: 'PrintLot',
        components: {
            PrintLotPromo,
            FlatHeroFloor,
            PrintLotPayments,
            PrintLotBenefits,
            PrintLotHero,
            PrintPage,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            project: {
                type: Object,
                default: () => ({}),
            },

            payments: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>

<style lang="scss" module>
    .PrintLot {
        padding: 38px 38px 18px;
    }

    .hero {
        margin-bottom: 20px;
    }

    .benefits {
        margin-bottom: 8px;
    }

    .floorPlan {
        width: 100%;
        height: 320px;
    }

    .promo {
        flex: 1;
    }
</style>
