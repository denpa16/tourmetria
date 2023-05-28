<template>
    <TemplateBottomModal
        :class="$style.ProjectInfraMapRouteModal"
        :visible="visible"
        :data="modalData"
        @close="$emit('close')"
    >
        <div :class="$style.wrapper">
            <ProjectInfraMapRoute
                :class="$style.content"
                :project-name="projectName"
                :address="address"
                :route-duration="routeDuration"
                :transport-type="transportType"
                :is-route-loading="isRouteLoading"
                @update-address="$emit('update-address', $event)"
                @build-route="handleBuildRoute"
                @reset-route="handleResetRoute"
                @update-transport-type="$emit('update-transport-type', $event)"
            />
        </div>
    </TemplateBottomModal>
</template>

<script>
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import ProjectInfraMapRoute from '~/components/common/projects/project/ProjectMapRoute';

    export default {
        name: 'ProjectInfraMapRouteModal',

        components: {
            ProjectInfraMapRoute,
            TemplateBottomModal
        },

        props: {
            visible: {
                type: Boolean,
                default: false,
            },

            modalData: {
                type: Object,
                default: () => ({})
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

        methods: {
            handleBuildRoute() {
                this.$emit('build-route');
                this.closeModal();
            },

            handleResetRoute() {
                this.$emit('reset-route');
                this.closeModal();
            },

            closeModal() {
                this.$emit('close');
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraMapRouteModal {
        z-index: 100;
    }

    .wrapper {
        padding-bottom: 2.4rem;

        @include respond-to(xs) {
            padding-bottom: 2.4rem;
        }
    }
</style>
