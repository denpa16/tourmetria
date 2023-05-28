<template>
    <section :class="[$style.FlatBenefits, 'container']">
        <ul :class="$style.benefitList">
            <li
                v-for="benefit in benefitList"
                :key="benefit.id"
                :class="$style.benefitItem"
            >
                <FlatBenefitCard
                    :benefit="benefit"
                    @cardClicked="openBenefitModal(benefit)"
                />
            </li>
        </ul>
        <BenefitModal v-if="isBenefitModalShown"
                      :benefit-list="benefitList"
                      :chosen-benefit="chosenBenefit"
                      @close="closeBenefitModal" />
    </section>
</template>

<script>
    import FlatBenefitCard from '~/components/common/selection/flats/flat/FlatBenefitCard';
    import BenefitModal from '~/components/common/projects/project/benefits/BenefitModal';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    export default {
        name: 'FlatBenefits',
        components: {BenefitModal,
                     FlatBenefitCard},

        props: {
            benefitList: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                isBenefitModalShown: false,
                chosenBenefit: {}
            };
        },

        computed: {},
        methods: {
            openBenefitModal(benefit) {
                this.chosenBenefit = benefit;
                lockBody();
                this.isBenefitModalShown = true;
            },

            closeBenefitModal() {
                unlockBody();
                this.isBenefitModalShown = false;
            },
        },
    };
</script>

<style lang="scss" module>

    .FlatBenefits {
        padding-top: 1.6rem;
        padding-bottom: 1.6rem;

        @include respond-to(sm) {
            padding-top: 2.4rem;
            padding-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            padding-bottom: 4rem;
        }
    }

    .benefitList {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1.6rem;

        @include respond-to(xs) {
            column-gap: 1.2rem;
            row-gap: 1.6rem;
        }
    }

    .benefitItem {
        height: 37.4rem;

        @include respond-to(xs) {
            height: unset;
        }
    }
</style>
