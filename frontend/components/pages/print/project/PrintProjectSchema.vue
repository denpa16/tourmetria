<template>
    <PrintPage v-if="phases && phases.genplan_scheme_display"
               :class="$style.PrintProjectSchema"
               top-vector>
        <PrintCompass :class="$style.compass"
                      :rotate-deg="phases.compass_azimuth" />


        <ProjectGenplanSchema :class="$style.schema"
                              :current-step-data="phases"
                              :current-step="step"
                              :next-step="nextStep"
                              hidden-controls
                              hidden-bottom-overlay
                              hidden-top-overlay
                              rounded-border />
    </PrintPage>
</template>

<script>
    import PrintPage from '~/components/common/print/PrintPage';
    import PrintCompass from '~/components/common/print/PrintCompass';
    import ProjectGenplanSchema
        from '~/components/common/projects/project/genplan/ProjectGenplanScheme';

    export default {
        name: 'PrintProjectSchema',

        components: {
            PrintCompass,
            PrintPage,
            ProjectGenplanSchema,
        },

        props: {
            phases: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            step() {
                return {
                    name: 'phases',
                    type: 'render',
                    filterParams: {project: this.phases.slug},
                    url: {
                        specs: this.$api.phases.specs,
                        facets: this.$api.phases.facets,
                        filter: this.$api.phases.list,
                    },

                    propNames: {
                        items: 'phase',
                        render_preview: 'genplan_preview',
                        render_display: 'genplan_display',
                        render_height: 'genplan_height',
                        render_width: 'genplan_width',
                        render_hover: 'render_hover_point[0].hover',
                        render_point: 'render_hover_point[0].point',
                        scheme_preview: 'genplan_scheme_preview',
                        scheme_display: 'genplan_scheme_display',
                        scheme_height: 'genplan_scheme_height',
                        scheme_width: 'genplan_scheme_width',
                        scheme_hover: 'scheme_hover_point[0].hover',
                        scheme_point: 'scheme_hover_point[0].point',
                    },

                    flatsLinkParams: {
                        project: this.phases.slug,
                        completion_date: '{{completion_year}}-{{completion_quarter}}',
                    }
                };
            },

            nextStep() {
                return {
                    name: 'checkerboard',
                    label: 'очередь',
                    filterParams: {},
                    url: {
                        data: this.$api.buildings.checkerboard(this.currentCheckerboardBuildingId),
                        specs: this.$api.buildings.specs,
                        facets: this.$api.buildings.facets,
                        filter: this.$api.buildings?.checkerboard(this.currentCheckerboardBuildingId),
                    },
                };
            },

            initialData() {
                const phase = this.phases?.phase ? JSON.parse(JSON.stringify(this.phases.phase)) : [];
                const formattedData = {
                    ...this.phases,
                    render_preview: this.phases.genplan_preview,
                    render_height: this.phases.genplan_height,
                    render_display: this.phases.genplan_display,
                    render_width: this.phases.genplan_width,
                    phase: phase.map(phase => {
                        if (
                            (Array.isArray(phase?.render_hover_point) && phase.render_hover_point.length)
                            && (Array.isArray(phase?.scheme_hover_point) && phase.scheme_hover_point.length)
                        ) {
                            phase.phases_render_hover = phase.render_hover_point[0].hover;
                            phase.phases_scheme_hover = phase.scheme_hover_point[0].hover;
                            phase.point = phase.render_hover_point[0].point;
                            phase.scheme_point = phase.scheme_hover_point[0].point;
                        }

                        return phase;
                    }),
                };

                delete formattedData.genplan_preview;
                delete formattedData.genplan_height;
                delete formattedData.genplan_display;
                delete formattedData.genplan_width;

                return formattedData;
            },
        }
    };
</script>

<style lang="scss" module>
    .PrintProjectSchema {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .compass {
        position: absolute;
        top: 86px;
        left: 138px;
        width: 108px;
        height: 108px;
    }

    .schema {
        max-width: 90%;
        max-height: 70%;
    }
</style>
