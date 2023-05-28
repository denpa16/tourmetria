<template>
    <div :class="$style.ProjectGenplanModalInfra">
        <transition name="fade-content">
            <div v-if="visible"
                 key="desktop"
                 :class="[$style.modal, $style._desktop]">
                <ProjectGenplanModalContentInfra :item="item"
                                                 :infras-categories="infrasCategories"
                                                 :point-property-name="pointPropertyName"
                                                 @close="$emit('close')" />
            </div>
        </transition>

        <TemplateBottomModal key="mobile"
                             :class="[$style.modal, $style._mobile]"
                             :visible="visible"
                             :is-lock-body="!$deviceIs.pc"
                             :data="{withoutDefaultHead: true}"
                             @close="$emit('close')">
            <ProjectGenplanModalContentInfra :item="item"
                                             :infras-categories="infrasCategories"
                                             :point-property-name="pointPropertyName"
                                             @close="$emit('close')" />
        </TemplateBottomModal>

        <transition name="overlay-appear">
            <Overlay v-if="visible"
                     :class="$style.overlay"
                     @click="$emit('close')" />
        </transition>
    </div>
</template>

<script>
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import Overlay from '~/components/layout/modals/Overlay';
    import ProjectGenplanModalContentInfra
        from '~/components/common/projects/project/genplan/modal/content/ProjectGenplanModalContentInfra';

    export default {
        name: 'ProjectGenplanModalInfra',
        components: {
            ProjectGenplanModalContentInfra,
            Overlay,
            TemplateBottomModal,
        },

        props: {
            item: {
                type: Object,
                default: () => ({}),
            },

            visible: {
                type: Boolean,
                default: false,
            },

            infrasCategories: {
                type: Array,
                default: () => [],
            },

            pointPropertyName: {
                type: String,
                default: '',
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalInfra {
        width: 36.4rem;

        @include respond-to(sm) {
            width: unset;
        }
    }

    .modal {
        &._desktop {
            min-width: 36.4rem;
            padding: 1.6rem 2rem;
            border-radius: .8rem;
            background-color: $base-0;
            box-shadow: 0 0 24px rgba(0, 0, 0, .08), 0 4px 24px rgba(0, 0, 0, .04);

            @include respond-to(sm) {
                display: none;
            }
        }

        &._mobile {
            display: none;

            @include respond-to(sm) {
                display: block;
            }
        }
    }

    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
