<template>
    <ul :class="$style.ProjectGenplanCheckerboardLegend">
        <li v-for="item in items"
            :key="item.label"
            :class="$style.legendItem">
            <ProjectGenplanCheckerboardLot :class="$style.lot"
                                           :lot="item.lot" />
            <span class="p5">{{ item.label }}</span>
        </li>
    </ul>
</template>

<script>
    import ProjectGenplanCheckerboardLot from '~/components/common/projects/project/genplan/ProjectGenplanCheckerboardLot';

    export default {
        name: 'ProjectGenplanCheckerboardLegend',
        components: {ProjectGenplanCheckerboardLot},

        data() {
            return {
                items: [
                    {
                        label: 'Продана',
                        lot: {
                            rooms: ' ',
                            status: '1',
                        },
                    },
                    {
                        label: 'Акция',
                        lot: {
                            rooms: ' ',
                            status: '1',
                            has_promotions: true,
                        },
                    },
                    {
                        label: 'Забронирована',
                        lot: {
                            rooms: ' ',
                            status: '2',
                        },
                    },
                ],
            };
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanCheckerboardLegend {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .legendItem {
        display: flex;
        align-items: center;
        margin-right: 2rem;

        @include respond-to(xs) {
            margin-right: 1.2rem;
        }

        &:last-child {
            margin-right: 0;
        }
    }

    .lot {
        pointer-events: none;
        margin-right: 1.2rem;

        @include respond-to(xs) {
            margin-right: .6rem;
        }
    }
</style>
