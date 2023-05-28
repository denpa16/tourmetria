<template>
    <LotCard :class="$style.ProjectGenplanModalContentLot"
             :lot="lot"
             :icon-place="$deviceIs.mobile ? 'info' : 'images'"
             bg-color="white"
             component="div">
        <template #btns>
            <VButton :class="$style.btn"
                     color="primary"
                     @click="$emit('open-form')">
                Забронировать
            </VButton>
            <VButton :class="$style.btn"
                     color="dark"
                     :link="`/selection/flats/${lot.id}`"
                     blank>
                Подробнее
            </VButton>
        </template>
    </LotCard>
</template>

<script>
    import LotCard from '~/components/common/selection/LotCard';

    export default {
        name: 'ProjectGenplanModalContentLot',

        components: {
            LotCard,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({})
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalContentLot {
        border-radius: .8rem;
        box-shadow: 0 0 24px rgba(0, 0, 0, .08), 0 4px 24px rgba(0, 0, 0, .04);
        background: $base-0;

        @include respond-to(sm) {
            padding-bottom: 1.6rem;
            box-shadow: unset;
        }
    }

    .btn {
        flex: 1;
    }
</style>
