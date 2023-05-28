<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.TemplateBottomModal]">

            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="$style.content">
                    <div v-if="!withoutDefaultHead"
                         :class="$style.head">
                        <template v-if="!$slots.head">
                            <h5 v-if="title"
                                :class="$style.title">
                                {{ title }}
                            </h5>
                            <p v-if="subtitle"
                               :class="$style.subtitle">
                                {{ subtitle }}
                            </p>
                        </template>
                        <slot v-else
                              name="head"></slot>
                    </div>

                    <slot></slot>

                    <div :class="$style.closeBtn">
                        <VSquareButton color="light"
                                       :size="!$deviceIs.mobile ? 'medium' : 'small'"
                                       aria-label="Закрыть окно"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';

    export default {
        name: 'TemplateBottomModal',

        components: {
            IconPlus,
        },

        props: {
            visible: Boolean,

            isLockBody: {
                type: Boolean,
                default: false,
            },

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            title() {
                return this.data?.title || '';
            },

            subtitle() {
                return this.data?.subtitle || '';
            },

            withoutDefaultHead() {
                return this.data?.withoutDefaultHead || false;
            },
        },

        watch: {
            visible(value) {
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
                if (this.visible) {
                    if (!value) {
                        unlockBody();
                        return;
                    }

                    lockBody();
                }
            }
        },

        beforeDestroy() {
            if (this.isLockBody) {
                unlockBody();
            }
        }
    };
</script>

<style lang="scss" module>
    .TemplateBottomModal {
        z-index: 200;
    }

    .wrap {
        @include respond-to(sm) {
            right: 50%;
            max-width: 54.6rem;
            transform: translateX(50%);
        }

        @include respond-to(xs) {
            right: 0;
            max-width: 100vw;
            transform: translateX(0);
        }
    }

    .content {
        position: relative;
        margin-top: auto;
        padding-right: 2.4rem;
        padding-left: 2.4rem;
        border-radius: 1.6rem 1.6rem 0 0;
        background-color: $base-0;

        @include respond-to(xs) {
            padding-right: 1.6rem;
            padding-left: 1.6rem;
            border-radius: .8rem .8rem 0 0;
        }
    }

    .head {
        position: relative;
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        @include respond-to(xs) {
            padding-top: 3.4rem;
            padding-bottom: 3.4rem;
        }
    }

    .title {
        text-transform: uppercase;
        font-weight: 600;

        @include respond-to(sm) {
            font-size: 2rem;
            line-height: 2.8rem;
        }

        @include respond-to(xs) {
            font-size: 1.2rem;
        }
    }

    .subtitle {
        text-transform: uppercase;
        font-weight: 600;
        color: $base-300;

        @include respond-to(sm) {
            font-size: 2rem;
            line-height: 2.8rem;
        }

        @include respond-to(xs) {
            font-size: 1.2rem;
        }
    }

    .closeBtn {
        position: absolute;

        @include respond-to(sm) {
            top: 0;
            right: -1.2rem;
            transform: translateX(100%);
        }

        @include respond-to(xs) {
            top: 2.4rem;
            right: 1.6rem;
            transform: translateX(0);
        }
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .options {
        padding: 0 1.6rem 4rem;
    }

    .item {
        display: flex;
        align-items: center;
        height: 4.4rem;
        padding: 0 1.6rem;
        border-radius: .4rem;
        border: 1px solid $base-50;
        transition: all $default-transition;
        cursor: pointer;

        &:not(:last-child) {
            margin-bottom: .8rem;
        }

        &._active {
            border-color: rgba($blue, .32);
            color: $blue;
        }

        @include hover {
            border-color: $blue;
            color: $blue;
        }
    }

    .search {
        padding: 1.6rem;
        border-bottom: 1px solid $base-100;
    }

    .notFound {
        display: block;
        padding: 1.6rem 2.4rem 2.4rem;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-300;
    }

    .tabs {
        margin-bottom: 1.6rem;
        padding: 1.6rem;
        border-bottom: 1px solid $base-100;
    }
</style>
