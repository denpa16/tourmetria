<template>
    <ProjectGenplanScheme :class="$style.ProjectGenplanFloorPlan"
                          :current-step-data="currentStepData"
                          :filtered-items="filteredItems"
                          :current-step="currentStep"
                          :active-lot="activeLot"
                          :is-show-view-modal="isShowViewModal"
                          :is-lot-modal="true"
                          show-empty-step
                          poligon-property-name="floor_plan_hover"
                          point-property-name="floor_point"
                          @change-active-lot="$emit('change-active-lot', $event)">
        <div :class="$style.leftBgPlank"></div>

        <ProjectGenplanSliderFloors :class="$style.floorSlider"
                                    :slides="floors"
                                    :initial-floor-number="currentStepData.number"
                                    @change="$emit('change-floor', $event)" />

        <ProjectGenplanModalFloors :class="$style.floorsMobileModal"
                                   :visible="isShowFloorsModal"
                                   :floors="floors"
                                   :initial-floor-number="currentStepData.number"
                                   @close="$emit('close-floors-modal')"
                                   @change="$emit('change-floor', $event)" />
    </ProjectGenplanScheme>
</template>

<script>
    import ProjectGenplanScheme from '~/components/common/projects/project/genplan/ProjectGenplanScheme';
    import ProjectGenplanSliderFloors from '~/components/common/projects/project/genplan/ProjectGenplanSliderFloors';
    import ProjectGenplanModalFloors from '~/components/common/projects/project/genplan/modal/ProjectGenplanModalFloors';

    export default {
        name: 'ProjectGenplanFloorPlan',

        components: {
            ProjectGenplanScheme,
            ProjectGenplanSliderFloors,
            ProjectGenplanModalFloors,
        },

        props: {
            currentStepData: {
                type: Object,
                default: () => ({}),
            },

            prevStepData: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            filteredItems: {
                type: Array,
                default: null,
            },

            currentStep: {
                type: Object,
                default: () => ({}),
            },

            activeLot: {
                type: Object,
                default: null
            },

            activeFloor: {
                type: Number,
                default: 1,
            },

            isShowFloorsModal: {
                type: Boolean,
                default: false,
            },

            isShowViewModal: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            filteredFloors() {
                return this.facets?.number;
            },

            filteredFlatsOnFloor() {
                return this.filteredFloors.reduce((res, floor) => {
                    res[floor?.value] = floor?.flat_count;
                    return res;
                }, {});
            },

            floors() {
                if (!this.prevStepData?.floors) {
                    return this.filteredFloors?.length ? this.filteredFloors : [];
                }

                return this.prevStepData.floors.map(floor => ({
                        ...floor,
                        value: floor.id,
                        label: floor.number,
                        flat_count: this.filteredFlatsOnFloor[floor.id] || 0,
                }));
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanFloorPlan {
        //
    }

    .leftBgPlank {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 20rem;
        height: 100%;
        background: linear-gradient(90deg, $base-0 66.79%, rgba(255, 255, 255, 0) 100%);

        @include respond-to(sm) {
            display: none;
        }
    }

    .floorSlider {
        position: absolute;
        top: 50%;
        left: 2.4rem;
        z-index: 1;
        transform: translateY(-50%);

        @include respond-to(sm) {
            top: unset;
            bottom: 2.4rem;
            left: 50%;
            width: 100%;
            transform: translateX(-50%) translateY(0);
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .floorsMobileModal {
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }
</style>
