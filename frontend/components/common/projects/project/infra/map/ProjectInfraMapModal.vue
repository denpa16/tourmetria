<template>
    <transition name="fade-slow">
        <div :class="['modal', $style.ProjectInfraMapModal]">
            <div :class="['modal-wrap', $style.wrap]">
                <ProjectInfraMap :project="project"
                                 :infras="infras"
                                 :infras-categories="infrasCategories"
                                 :initial-categories="initialCategories"
                                 @change="$emit('change', $event)" />
                <div :class="$style.closeBtn">
                    <VSquareButton color="white"
                                   aria-label="Закрыть"
                                   @click="$emit('close')">
                        <IconCross :class="$style.icon" />
                    </VSquareButton>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import ProjectInfraMap from '~/components/common/projects/project/infra/map/ProjectInfraMap';
    import IconCross from '~/components/icons/IconCross';

    export default {
        name: 'ProjectInfraMapModal',

        components: {
            ProjectInfraMap,
            IconCross,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },

            infras: {
                type: Array,
                default: () => []
            },

            infrasCategories: {
                type: Array,
                default: () => []
            },

            initialCategories: {
                type: Array,
                default: () => []
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraMapModal {
        z-index: 95;

        &:global(.modal) {
            height: 100vh;

            @include respond-to(sm) {
                height: var(--vh-full-page);
            }
        }
    }

    .wrap {
        align-items: flex-end;
    }

    .closeBtn {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 1;

        @include respond-to(xs) {
            top: 1.6rem;
            right: 1.6rem;

            & :global(.v-square-button--medium) {
                width: 4rem;
                height: 4rem;
            }
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }
</style>
