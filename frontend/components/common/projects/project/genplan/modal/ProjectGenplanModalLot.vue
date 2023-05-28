<template>
    <div :class="$style.ProjectGenplanModalLot"
         @mouseenter="$emit('mouseenter', $event)"
         @mouseleave="$emit('mouseleave', $event)"
         @click.stop>
        <transition name="fade-content">
            <ProjectGenplanModalContentLot v-if="visible"
                                           :class="[$style.modal, $style._desktop]"
                                           :lot="lot"
                                           @open-form="$emit('open-form')" />
        </transition>

        <TemplateBottomModal :class="[$style.modal, $style._mobile]"
                             :visible="visible"
                             :is-lock-body="$deviceIs.tablet || $deviceIs.mobile"
                             :data="modalData"
                             @close="$emit('close')">
            <ProjectGenplanModalContentLot v-if="lot && visible"
                                           :class="$style.content"
                                           :lot="lot"
                                           @open-form="$emit('open-form')" />
        </TemplateBottomModal>

        <transition name="overlay-appear">
            <Overlay v-if="visible"
                     :class="$style.overlay"
                     @click="$emit('close')" />
        </transition>
    </div>
</template>

<script>
    import ProjectGenplanModalContentLot
        from '~/components/common/projects/project/genplan/modal/content/ProjectGenplanModalContentLot';
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import Overlay from '~/components/layout/modals/Overlay';

    export default {
        name: 'ProjectGenplanModalLot',

        components: {
            ProjectGenplanModalContentLot,
            TemplateBottomModal,
            Overlay,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({})
            },
        },

        computed: {
            modalData() {
                return {
                    withoutDefaultHead: true,
                };
            },

            visible() {
                return Boolean(this.lot && Object.keys(this.lot).length);
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalLot {
        width: 33.7rem;

        @include respond-to(sm) {
            width: 100%;
        }
    }

    .modal {
        &._desktop {
            display: block;
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

    .content {
        @include respond-to(sm) {
            height: 49.2rem;
        }
    }

    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
