<template>
    <transition
        name="overlay-appear"
        appear
        @after-enter="$emit('after-enter')"
        @before-leave="$emit('before-leave')"
        @after-leave="$emit('after-leave')"
    >
        <div
            v-if="isVisible"
            :class="[$style.ModalWrap, 'modal-wrap-custom', {[$style['_full-screen']] : fullScreen}, {[$style['_without-overlay']]: withoutOverlay}]"
            @mousedown.left.self="close"
        >
            <transition
                name="modal"
                appear
            >
                <div
                    :class="[$style.container, containerClass, {[$style['_without-paddings']]: containerWithoutPaddings}]"
                    @mousedown.left.self="close"
                >
                    <div
                        :class="[$style.modal, 'modal-wrap-container']">
                        <VSquareButton
                            v-show="!hiddenCloseBtn"
                            :class="$style.closeButton"
                            aria-label="Закрыть"
                            color="light"
                            @click="close"
                        >
                            <IconCross :class="$style.iconCross" />
                        </VSquareButton>
                        <slot>
                        </slot>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import VSquareButton from '~/components/ui/buttons/VSquareButton';
    import IconCross from '~/components/icons/IconCross';
    export default {
        name: 'ModalWrap',
        components: {IconCross,
                     VSquareButton},

        props: {
            fullScreen: {
                type: Boolean,
                default: false
            },

            withoutOverlay: {
                type: Boolean,
                default: false
            },

            containerWithoutPaddings: {
                type: Boolean,
                default: false
            },

            isVisible: {
                type: Boolean,
                default: true
            },

            hiddenCloseBtn: {
                type: Boolean,
                default: false
            },

            isLockBody: {
                type: Boolean,
                default: false
            },

            containerClass: {
                type: String,
                default: '',
            },
        },

        data() {
            return {};
        },

        computed: {},

        watch: {
            isVisible(value) {
                if (!this.isLockBody) {
                    return;
                }

                if (value) {
                    lockBody();
                } else {
                    unlockBody();
                }
            },

            isLockBody(value) {
                if (this.isVisible) {
                    if (!value) {
                        unlockBody();
                        return;
                    }

                    lockBody();
                }
            }
        },

        mounted() {
            if (this.isLockBody && this.isVisible) {
                lockBody();
            }
        },

        beforeDestroy() {
            if (this.isLockBody) {
                unlockBody();
            }
        },

        methods: {
            close() {
                this.$emit('close');
            }
        }
    };
</script>

<style lang="scss" module>
    .ModalWrap {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100vw;
        height: 100%;
        background-color: rgba(33, 33, 33, .6);

        &._full-screen {
            .container {
                padding: 0;
            }

            .modal {
                width: 100%;
                max-height: unset;
                border-radius: 0;
            }

            .closeButton {
                top: 2.4rem;
                right: 2.4rem;
            }
        }

        &._without-overlay {
            background: transparent;
        }
    }

    .container {
        display: flex;
        justify-content: end;
        width: 100%;
        height: 100%;
        padding: 2.4rem;

        &._without-paddings {
            padding: 0;
        }

        @include respond-to(sm) {
            align-items: end;
            justify-content: center;
            padding: 0;
        }

        @include respond-to(xs) {
            padding: 0;
        }
    }

    .closeButton {
        position: absolute;
        top: 0;
        right: calc(100% + 1.6rem);
        z-index: 5;

        @include respond-to(sm) {
            left: calc(100% + 1.6rem);
        }

        @include respond-to(xs) {
            top: 1.6rem;
            right: 1.6rem;
            left: unset;
            width: 3.2rem;
            height: 3.2rem;
            margin: 0;
        }
    }

    .iconCross {
        width: .9rem;
        height: .9rem;
    }

    .modal {
        position: relative;
        width: 58rem;
        height: 100%;
        border-radius: .8rem;
        background-color: #fff;

        @include respond-to(sm) {
            width: 54.6rem;
            max-height: calc(100% - 4.5rem);
            border-radius: 1.6rem 1.6rem 0 0;
        }

        @include respond-to(xs) {
            width: 100%;
            max-height: unset;
            border-radius: unset;
        }
    }
</style>
