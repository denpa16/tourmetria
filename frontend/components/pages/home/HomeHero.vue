<template>
    <HeroBlock
        :slides="slides"
        :slider-navigation-attrs="{ color: 'light' }"
        :custom-height-reduction="customHeightReduction"
        home-page
        @open-call-modal="handleOpenModal"
        @scroll-to="$emit('scroll-to')"
    >
        <template #rightBottomPlank>
            <VSquareButton :class="$style.squareBtn"
                           aria-label="Прокрутить начальный экран"
                           color="white"
                           @click="$emit('scroll-to')"
            >
                <IconMouse :class="$style.squareBtnIcon" />
            </VSquareButton>
        </template>
    </HeroBlock>
</template>

<script>
    import {mapGetters} from 'vuex';
    import HeroBlock from '~/components/common/hero/HeroBlock';
    import IconMouse from '~/components/icons/IconMouse';
    import FormModal from '~/components/layout/modals/forms/FormModal';

    export default {
        name: 'ProjectHero',

        components: {
            HeroBlock,
            IconMouse,
        },

        props: {
            slides: {
                type: Array,
                default: () => []
            },

            customHeightReduction: {
                type: Number,
                default: 0,
            },
        },

        computed: {
            ...mapGetters(['getCurrentCity']),
        },

        methods: {
            handleOpenModal() {
                const data = {
                    formTitle: 'Оставить заявку. Основной сайт',
                    formSource: 'На главной: Стартовый экран',
                    formComment: this.getCurrentCity?.label,
                };

                this.$modal.open(FormModal, data);
            },
        },
    };
</script>

<style lang="scss" module>
    .HomeHero {
        //
    }

    .squareBtn {
        &:global(.v-square-button) {
            @include respond-to(sm) {
                display: none;
            }
        }
    }

    .squareBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
    }

</style>
