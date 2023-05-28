<template>
    <ProjectGenplanScheme v-if="activeBuilding && activeBuilding.sections && activeBuilding.sections.length"
                          ref="wrapper"
                          :class="$style.ProjectGenplanCheckerboard"
                          :current-step-data="currentStepSchemeData"
                          :active-lot="activeLot"
                          :is-lot-modal="true"
                          :info-modal-btn-text="infoModalBtnText"
                          :current-step="currentStepScheme"
                          :next-step="{label: 'литер'}"
                          :first-zoom="1.5"
                          :zoom-step=".5"
                          :initial-zoom="initialZoom"
                          :force-scroll-zoombox-to-top="forceScrollZoomboxToTop"
                          :is-loading="isLoading"
                          :is-disabled-mobile-auto-zoom="true"
                          @change-active-lot="$emit('change-active-lot', $event)"
                          @modal-info-click="handleModalBtnClick">
        <template #scheme="schemeProps">
            <div ref="checkerboard"
                 :class="$style.checkerboard"
                 :style="{transform: `scale(${scaleValue})`}">
                <ProjectGenplanPin :class="$style.pin"
                                   :is-active="Boolean(schemeProps.activeItem)"
                                   :pin-info="buildingPinData"
                                   :data-item-id="buildingPinData.id"
                                   @click="schemeProps.handleClickInfoItem(activeBuildingCard, true)" />

                <transition :name="isSectionsMoveForward ? 'scroll-right' : 'scroll-left'"
                            mode="out-in">
                    <div :key="sections && sections[0].id"
                         :class="$style.sections">
                        <template v-for="section in sections">
                            <div v-if="section && section.floors && section.floors.length"
                                 :key="section.id"
                                 :class="$style.checkerboardSection">
                                <template v-for="floor in section.floors">
                                    <div v-if="floor && floor.property_set && floor.property_set.length"
                                         :key="floor.id"
                                         :class="$style.floor">
                                        <span v-if="floor.number"
                                              :class="[$style.floorNumber, 'p7', 'c-base200']">{{ floor.number }}</span>
                                        <ProjectGenplanCheckerboardLot
                                            v-for="lot in floor.property_set"
                                            :key="lot.id"
                                            :lot="lot"
                                            :disabled="Boolean(filteredFlatsId && !filteredFlatsId[lot.id])"
                                            @click="schemeProps.handleClickLot(lot)"
                                        />
                                    </div>
                                </template>

                                <span v-if="section.number"
                                      :class="[$style.sectionNumber, 'p7', 'c-base200']">
                                    {{ section.number }} подъезд
                                </span>
                            </div>
                        </template>
                    </div>
                </transition>
            </div>
        </template>

        <template #default>
            <ProjectGenplanCheckerboardLegend :class="$style.legend" />
        </template>
    </ProjectGenplanScheme>
</template>

<script>
    import ProjectGenplanScheme from '~/components/common/projects/project/genplan/ProjectGenplanScheme';
    import ProjectGenplanPin from '~/components/common/projects/project/genplan/ProjectGenplanPin';
    import ProjectGenplanCheckerboardLot from '~/components/common/projects/project/genplan/ProjectGenplanCheckerboardLot';
    import ProjectGenplanCheckerboardLegend from '~/components/common/projects/project/genplan/ProjectGenplanCheckerboardLegend';

    export default {
        name: 'ProjectGenplanCheckerboard',

        components: {
            ProjectGenplanCheckerboardLegend,
            ProjectGenplanCheckerboardLot,
            ProjectGenplanPin,
            ProjectGenplanScheme,
        },

        props: {
            activeLot: {
                type: Object,
                default: null
            },

            activeBuilding: {
                type: Object,
                default: () => ({}),
            },

            sections: {
                type: Array,
                default: () => [],
            },

            filteredItems: {
                type: Array,
                default: null,
            },

            isShowViewModal: {
                type: Boolean,
                default: false,
            },

            isSectionsMoveForward: {
                type: Boolean,
                default: true,
            },

            isLoading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                wrapperEl: null,
                checkerboardEl: null,
                scaleValue: 1,
                activeBuildingCard: {},
                forceScrollZoomboxToTop: 1,
            };
        },

        computed: {
            buildingPinData() {
                return {
                    id: this.activeBuilding.id,
                    pinLabel: `${this.activeBuilding.number} литер`,
                };
            },

            infoModalBtnText() {
                return `${this.activeBuildingCard?.flat_count} квартиры списком`;
            },

            currentStepScheme() {
                return {
                    propNames: {
                        items: 'items',
                    }
                };
            },

            currentStepSchemeData() {
                return {
                    items: this.activeBuildingCard ? [this.activeBuildingCard] : [],
                    completion_quarter: this.activeBuildingCard?.completion_quarter,
                    completion_year: this.activeBuildingCard?.completion_year,
                };
            },

            filteredFlatsId() {
                if (!Array.isArray(this.filteredItems) || !this.filteredItems.length) {
                    return null;
                }

                return this.filteredItems.reduce((res, section) => {
                    if (!section.floors?.length) {
                        return res;
                    }

                    const idList = section.floors.reduce((res, floor) => {
                        if (!floor.property_set?.length) {
                            return res;
                        }

                        const ids = floor.property_set.reduce((res, item) => {
                            res[item.id] = true;
                            return res;
                        }, {});

                        return {...res, ...ids};
                    }, {});

                    return {...res, ...idList};
                }, {});
            },

            initialZoom() {
                return this.scaleValue >= 1 ? 1 : Math.round((1 / this.scaleValue) * 10) / 10;
            },
        },

        watch: {
            scaleValue() {
                this.forceScrollZoomboxToTop += 1;
            }
        },

        beforeMount() {
            this.getCheckerboardCard();
        },

        mounted() {
            if (this.$refs.wrapper?.$el && this.$refs.checkerboard) {
                this.checkerboardEl = this.$refs.checkerboard;
                this.wrapperEl = this.$refs.wrapper.$el;
                window.addEventListener('resize', this.onResize);
                this.updateScaleValue();
            }
        },


        beforeDestroy() {
            if (this.checkerboardEl) {
                window.removeEventListener('resize', this.onResize);
            }
        },

        methods: {
            onResize() {
                this.updateScaleValue();
            },

            updateScaleValue() {
                const heightScale = (this.wrapperEl.offsetHeight - 280) / this.checkerboardEl.offsetHeight;
                const widthScale = this.wrapperEl.offsetWidth / this.checkerboardEl.offsetWidth;
                this.scaleValue = Math.min(heightScale, widthScale, 1);
            },

            async getCheckerboardCard() {
                try {
                    this.activeBuildingCard = await this.$axios.$get(this.$api.buildings?.checkerboardCard(this.activeBuilding.id));
                } catch (e) {
                    console.error(`[getCheckerboardCard]: ${e}`);
                }
            },

            handleModalBtnClick() {
                const routeData = this.$router.resolve({
                    path: '/selection/flats',
                    query: {building: this.activeBuilding.id}
                });
                window.open(routeData.href, '_blank');
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanCheckerboard {
        width: 100%;
        height: 100%;

        &:after {
            height: 15rem;
            background: linear-gradient(0deg, $base-0 90%, rgba(255, 255, 255, 0) 100%);
        }
    }

    .checkerboard {
        position: relative;
        overflow: hidden;
        padding: 5.4rem 1.2rem 1.2rem;
    }

    .pin {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    .sections {
        display: flex;
        align-items: flex-end;
    }

    .checkerboardSection {
        display: flex;
        flex-direction: column-reverse;
        margin-right: 1.2rem;

        &:last-child {
            margin-right: 0;
        }

        &:first-child {
            .sectionNumber {
                padding-left: 4rem;
            }
        }
    }

    .floor {
        display: flex;
        margin-top: .4rem;

        &:last-of-type {
            margin-top: 0;
        }

        & > * {
            margin-right: .4rem;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .floorNumber {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.6rem;
        height: 2.4rem;
        padding: .5rem .2rem .3rem;
    }

    .sectionNumber {
        margin-bottom: 1.2rem;
        text-align: center;
    }

    .legend {
        position: absolute;
        bottom: 9.4rem;
        left: 50%;
        z-index: 1;
        transform: translateX(-50%);

        @include respond-to(xs) {
            bottom: 8.4rem;
        }
    }
</style>
