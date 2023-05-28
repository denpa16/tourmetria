<template>
    <div :class="$style.ProjectInfraMapControlBox">
        <div :class="$style.wrapper">
            <TheAccordion :class="$style.accordion"
                          :value="tabs.infra"
                          title="Инфраструктура"
                          :title-class="$style.accordionTitle"
                          @change="handleChange($event, 'infra')"
            >
                <ProjectInfraMapFilterCategory
                    :class="$style.accordionInner"
                    :filter-values="filters.category.values"
                    :infras-categories="infrasCategories"
                    @change="updateFilters('category', $event)"
                />
            </TheAccordion>
            <TheAccordion :class="$style.accordion"
                          :value="tabs.transport"
                          title="Транспорт"
                          :title-class="$style.accordionTitle"
                          @change="handleChange($event, 'transport')"
            >
                <ProjectMapRoute
                    :class="$style.accordionInner"
                    title="Проложите маршрут"
                    :address="address"
                    :project-name="projectName"
                    :route-duration="routeDuration"
                    :transport-type="transportType"
                    :is-route-loading="isRouteLoading"
                    @update-address="$emit('update-address', $event)"
                    @build-route="$emit('build-route')"
                    @reset-route="$emit('reset-route')"
                    @update-transport-type="$emit('update-transport-type', $event)"
                />
            </TheAccordion>
        </div>
        <ProjectInfraMapFilterTime
            :disabled="Boolean(tabs.transport)"
            :class="$style.timeFilter"
            :filter-values="filters.time.values"
            :time-specs="timeSpecs"
            @change="updateFilters('time', $event)"
        />
    </div>
</template>

<script>
    import variables from '~/assets/scss/shared/_variables.scss';
    import TheAccordion from '~/components/common/TheAccordion';
    import ProjectInfraMapFilterCategory from '~/components/common/projects/project/infra/map/filter/ProjectInfraMapFilterCategory';
    import ProjectInfraMapFilterTime from '~/components/common/projects/project/infra/map/filter/ProjectInfraMapFilterTime';
    import ProjectMapRoute from '~/components/common/projects/project/ProjectMapRoute';

    export default {
        name: 'ProjectInfraMapControlBox',
        components: {
            TheAccordion,
            ProjectInfraMapFilterCategory,
            ProjectInfraMapFilterTime,
            ProjectMapRoute
        },

        props: {
            infrasCategories: {
                type: Array,
                default: () => []
            },

            filters: {
                type: Object,
                default: () => ({})
            },

            timeSpecs: {
                type: Array,
                default: () => []
            },

            address: {
                type: String,
                default: ''
            },

            projectName: {
                type: String,
                default: ''
            },

            routeDuration: {
                type: String,
                default: ''
            },

            transportType: {
                type: String,
                default: ''
            },

            isRouteLoading: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                colorVars: variables,
                tabs: {
                    infra: true,
                    transport: false,
                }
            };
        },

        computed: {
            isAll() {
                return !this.value?.length;
            }
        },

        watch: {
            'tabs.transport'(newValue) {
                if (newValue) {
                    this.$emit('transport-activated');
                }
            },
        },

        methods: {
            updateFilters(filterName, value) {
                this.$emit('update-filters', filterName, value);
            },

            handleChange(value, tab) {
                let isAnyOpenedTabs = false;
                if (value) {
                    Object.entries(this.tabs).forEach(([tabName, currentValue]) => {
                        if (currentValue) {
                            isAnyOpenedTabs = true;
                            this.tabs[tabName] = false;
                        }
                    });
                }

                if (isAnyOpenedTabs) {
                    setTimeout(() => {
                        this.tabs[tab] = value;
                    }, 100);
                    return;
                }

                this.tabs[tab] = value;
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraMapControlBox {
        position: relative;
        min-width: 32rem;
        padding: 2.4rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(sm) {
            display: none;
        }
    }

    .accordion {
        margin-bottom: 2.4rem;
        padding-bottom: 2.4rem;
        border-bottom: .1rem solid $base-100;

        &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
    }

    .accordionTitle {
        text-transform: uppercase;
        font-weight: 600;
        line-height: 2.4rem;
        color: $base-800;
    }

    .accordionInner {
        padding-top: 2.4rem;
    }

    .timeFilter {
        position: absolute;
        top: 0;
        right: -1.6rem;
        transform: translateX(100%);
    }
</style>
