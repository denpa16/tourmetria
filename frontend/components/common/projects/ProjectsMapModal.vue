<template>
    <transition name="fade-slow">
        <div :class="['modal', $style.ProjectsMapModal]">
            <div :class="['modal-wrap', $style.wrap]">
                <ProjectsMap :project-list="projectList"
                             :values="values"
                             :specs="specs"
                             :facets="facets"
                             :cities="cities"
                             @change="$emit('change', $event)"
                             @open-filters="$emit('open-filters')" />
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
    import ProjectsMap from '~/components/common/projects/ProjectsMap';
    import IconCross from '~/components/icons/IconCross';

    export default {
        name: 'ProjectsMapModal',

        components: {
            ProjectsMap,
            IconCross,
        },

        props: {
            projectList: {
                type: Array,
                default: () => [],
            },

            values: {
                type: Object,
                default: () => ({}),
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            cities: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectsMapModal {
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
        height: 100vh;

        @include respond-to(sm) {
            height: 100%;
        }
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
