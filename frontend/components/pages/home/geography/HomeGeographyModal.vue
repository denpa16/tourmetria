<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.HomeGeographyModal]">
            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <VSquareButton color="white"
                               :class="$style.btn"
                               aria-label="Закрыть"
                               @click="$emit('close')">
                    <IconCross :class="$style.icon" />
                </VSquareButton>
                <HomeGeographySubjects :district-image="districtImage"
                                       :district-preview="districtPreview"
                                       :regions="regions"
                                       is-modal />
                <HintOverlay :text="overlayText"
                             animation="horizontal">
                    <template #icon>
                        <IconFinger />
                    </template>
                </HintOverlay>
            </div>
        </div>
    </transition>
</template>

<script>
    import HomeGeographySubjects from '~/components/pages/home/geography/HomeGeographySubjects';
    import IconCross from '~/components/icons/IconCross';
    import HintOverlay from '~/components/common/HintOverlay';
    import IconFinger from '~/components/icons/IconFinger';

    export default {
        name: 'HomeGeographyModal',

        components: {
            HomeGeographySubjects,
            IconCross,
            HintOverlay,
            IconFinger,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                overlayText: 'Двигайте горизонтально карту пальцем.<br> Выберите интересующую для вас область'
            };
        },

        computed: {
            title() {
                return this.data?.title ?? '';
            },

            districtImage() {
                return this.data?.districtImage ?? '';
            },

            districtPreview() {
                return this.data?.districtPreview ?? '';
            },

            regions() {
                return this.data?.regions ?? [];
            },
        },

    };
</script>

<style lang="scss" module>
    .HomeGeographyModal {
        z-index: 100;
        background-color: $base-100;
    }

    .wrap {
        overflow: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
        //scrollbar-width: thin;
        //scrollbar-color: $base-200;
        //
        //::-webkit-scrollbar {
        //    height: .4rem;
        //}
        //
        //::-webkit-scrollbar-track {
        //    background: #545554;
        //}
        //
        //::-webkit-scrollbar-thumb {
        //    border-radius: .4rem;
        //    background-color: $base-200;
        //}
    }

    .btn {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 1;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }
</style>
