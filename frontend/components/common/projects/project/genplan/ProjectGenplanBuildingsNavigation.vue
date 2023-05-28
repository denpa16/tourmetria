<template>
    <SliderNavigation v-if="buildings"
                      :class="$style.ProjectGenplanBuildingsNavigation"
                      :prev-disabled="currentBuldingIdx === 0"
                      :next-disabled="currentBuldingIdx === (buildings.length - 1)"
                      @next-click="handleNextClick"
                      @prev-click="handlePrevClick">
        <span :class="[$style.label, 'p6']">Литер
            {{ currentBuldingIdx + 1 }}<span class="c-base300">/{{ buildings.length }}</span>
        </span>
    </SliderNavigation>
</template>

<script>
    import SliderNavigation from '~/components/common/SliderNavigation';

    export default {
        name: 'ProjectGenplanBuildingsNavigation',

        components: {
            SliderNavigation,
        },

        props: {
            buildings: {
                type: Array,
                default: () => [],
            },

            activeBuildingId: {
                type: [String, Number],
                default: '',
            },
        },

        computed: {
            currentBuldingIdx() {
                return this.buildings.indexOf(this.activeBuildingId);
            }
        },

        methods: {
            handleNextClick() {
                this.$emit('change-building', this.buildings[this.currentBuldingIdx + 1]);
            },

            handlePrevClick() {
                this.$emit('change-building', this.buildings[this.currentBuldingIdx - 1]);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanBuildingsNavigation {
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .label {
        display: block;
        width: 100%;
        text-align: center;
    }
</style>
