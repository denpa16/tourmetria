<template>
    <PrintPage v-if="isShowComponent"
               :class="$style.PrintProjectInfra"
               top-vector>
        <div ref="head"
             :class="$style.head">
            <div>
                <img v-if="project.logo"
                     :class="$style.logo"
                     :src="project.logo"
                     alt="project logo">
                <p :class="$style.address">
                    <span :class="$style.addressCity">{{ project.city ? project.city.name : '' }},</span>
                    {{ project.address || '' }}
                </p>
            </div>

            <ul :class="$style.specs">
                <li v-for="spec in specsList"
                    v-show="spec.text"
                    :key="spec.icon + spec.text"
                    :class="$style.specsItem">
                    <img :src="spec.icon"
                         :class="$style.specIcon"
                         alt="icon">
                    <span :class="$style.specText">{{ spec.text }}</span>
                </li>
            </ul>
        </div>

        <ProjectGenplan v-if="phases || buildings"
                        :class="$style.genplan"
                        :phases="phases"
                        :buildings="buildings"
                        :style="imageHeight"
                        hide-controls
                        hide-overlay />

        <div v-if="project.infra_map_for_pdf_display"
             :class="$style.infra">
            <div :class="$style.mapContainer"
                 :style="imageHeight">
                <img :class="$style.infraMap"
                     :src="project.infra_map_for_pdf_display"
                     alt="map">
            </div>

            <ul v-if="infrasCategories && infrasCategories.length"
                :class="$style.infras"
                :style="imageHeight">
                <li v-for="infraCategory in infrasCategories"
                    :key="infraCategory.id"
                    :class="$style.infraItem"
                    :style="{color: infraCategory.color }">
                    {{ infraCategory.name }}
                </li>
            </ul>
        </div>
    </PrintPage>
</template>

<script>
    import {getCorrectEnding} from '~/assets/js/utils/numberUtils';
    import PrintPage from '~/components/common/print/PrintPage';
    import ProjectGenplan from '~/components/pages/project/ProjectGenplan';

    export default {
        name: 'PrintProjectInfra',

        components: {
            PrintPage,
            ProjectGenplan,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },

            phases: {
                type: Object,
                default: () => ({}),
            },

            buildings: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            infrasCategories: {
                type: Array,
                default: () => [],
            },
        },

        computed: {
            isShowComponent() {
                return this.phases || this.buildings || this.project?.infra_map_for_pdf_display;
            },

            imageHeight() {
                return {
                    height: 'calc((1122px - 200px - 24px - 16px) / 2)',
                    minHeight: 'calc((1122px - 200px - 24px - 16px) / 2)',
                };
            },

            specsData() {
                const initialData = {
                    buildings: 0,
                    floors: [0, 0],
                };

                if (Array.isArray(this.buildings?.buildings) && this.buildings.buildings.length) {
                    const floors = this.buildings.buildings.reduce((res, building) => [
                        !res[0] && building.total_floor_min ? building.total_floor_min : Math.min(res[0], building.total_floor_min),
                        Math.max(res[1], building.total_floor_max)
                    ], [0, 0]);

                    return {
                        buildings: this.buildings.buildings.length,
                        floors,
                    };
                }

                if (Array.isArray(this.phases?.phase) && this.phases.phase.length) {
                    return this.phases.phase.reduce((res, phase) => {
                        res.buildings += phase.buildings.length;
                        res.floors = [
                            !res.floors[0] && phase.total_floor_min ? phase.total_floor_min : Math.min(res.floors[0], phase.total_floor_min),
                            Math.max(res.floors[1], phase.total_floor_max)
                        ];
                        return res;
                    }, initialData);
                }

                return initialData;
            },

            floorsStr() {
                if (!Array.isArray(this.specsData?.floors) || !this.specsData?.floors?.length) {
                    return '';
                }

                if (this.specsData.floors[0] === this.specsData.floors[1]) {
                    return this.specsData?.floors[0] ? `${this.specsData?.floors[0]} ${getCorrectEnding('этаж', this.specsData?.floors[0])}` : '';
                }

                if (!this.specsData.floors[0] || !this.specsData.floors[1]) {
                    const max = Math.max(...this.specsData.floors);
                    return `${max} ${getCorrectEnding('этаж', max)}`;
                }

                return `${this.specsData.floors[0]}-${this.specsData.floors[1]} ${getCorrectEnding('этаж', this.specsData.floors[1])}`;
            },

            areaStr() {
                if (!this.facets?.facets) {
                    return '';
                }

                const area = this.facets.facets.find(({name}) => name === 'area');
                if (area) {
                    if (area?.range?.min === area?.range?.max) {
                        return `${area.range.min} м²`;
                    }

                    return `от ${area.range.min} м² до ${area.range.max} м²`;
                }

                return '';
            },

            specsList() {
                return [
                    {
                        icon: '/images/print/lot/buildings.png',
                        text: `${this.specsData.buildings} ${getCorrectEnding('дом', this.specsData.buildings)}`
                    },
                    {
                        icon: '/images/print/lot/floors.png',
                        text: this.floorsStr,
                    },
                    {
                        icon: '/images/print/lot/deadline.png',
                        text: `${this.project?.deadline_quarter} квартал ${this.project?.deadline_year}`,
                    },
                    {
                        icon: '/images/print/lot/area.png',
                        text: this.areaStr,
                    }
                ];
            }
        },
    };
</script>

<style lang="scss" module>
    .PrintProjectInfra {
        //
    }

    .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 38px 70px;
    }

    .logo {
        max-width: 300px;
        height: 60px;
    }

    .address {
        width: 200px;
        margin-top: 16px;
        font-size: 18px;
        line-height: 1.2;
    }

    .addressCity {
        display: block;
    }

    .specsItem {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .specIcon {
        width: 26px;
        height: 26px;
        margin-right: 12px;
        object-fit: contain;
    }

    .specText {
        font-size: 16px;
        line-height: 1;
    }

    .genplan {
        width: 100%;
    }

    .infra {
        display: flex;
        margin: 24px 36px 12px;
    }

    .mapContainer {
        position: relative;
        width: 70%;
    }

    .infraMap {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
    }

    .infras {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 30%;
        height: 100%;
        padding-left: 30px;
    }

    .infraItem {
        margin-bottom: 8px;
        list-style: disc;
        font-size: 16px;
        line-height: 1;

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
