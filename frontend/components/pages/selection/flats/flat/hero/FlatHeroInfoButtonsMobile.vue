<template>
    <div :class="$style.FlatHeroInfoButtonsMobile">
        <div :class="$style.wrapper">
            <VButton color="text"
                     icon-first
                     @click="handleShareClick">
                <template #icon>
                    <IconShare :class="$style.icon" />
                </template>
                Поделиться
            </VButton>
            <span :class="$style.line"></span>
            <VButton color="text"
                     icon-first
                     target="_blank"
                     :disabled="isMortgageLoading"
                     :link="brochureLink"
                     @click="handlePdfClick">
                <template #icon>
                    <IconPrint v-if="!isMortgageLoading"
                               :class="$style.icon" />
                    <VSpinner v-else
                              size="small" />
                </template>
                Сохранить в PDF
            </VButton>
        </div>
    </div>
</template>

<script>
    import IconShare from '~/components/icons/IconShare';
    import IconPrint from '~/components/icons/IconPrint';
    import SharingModal from '~/components/layout/modals/SharingModal';
    import PdfModal from '~/components/layout/modals/PdfModal';
    import VSpinner from '~/components/ui/spinner/VSpinner';

    export default {
        name: 'FlatHeroInfoButtonsMobile',

        components: {
            VSpinner,
            IconShare,
            IconPrint,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            brochureLink: {
                type: String,
                default: '',
            },

            isMortgageLoading: {
                type: Boolean,
                default: false,
            },
        },

        methods: {
            handleShareClick() {
                this.$modal.open(SharingModal);
            },

            handlePdfClick() {
                this.$modal.open(PdfModal);
            },
        }
    };
</script>

<style lang="scss" module>
    .FlatHeroInfoButtonsMobile {
        width: 100%;
        border-radius: .4rem;
        background-color: $base-50;
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;
    }

    .line {
        width: 1px;
        height: 1.2rem;
        background-color: $base-200;
    }
</style>
