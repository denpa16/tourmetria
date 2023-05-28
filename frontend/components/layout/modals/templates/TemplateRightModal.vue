<template>
    <transition :name="($deviceIs.tablet || $deviceIs.mobile) ? 'modal' : 'form-appear'"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.TemplateRightModal]">
            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="$style.content">
                    <div :class="$style.closeBtn">
                        <VSquareButton color="white"
                                       aria-label="Закрыть окно"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>

                    <div :class="$style.mobilePanel">
                        <h3 :class="$style.titleAdditional"
                            v-html="additionalTitle"></h3>
                        <VSquareButton color="white"
                                       size="small"
                                       aria-label="Закрыть окно"
                                       :class="$style.closeBtnMobile"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>

                    <div :class="$style.head">
                        <h2 :class="[$style.title, 'h4']"
                            v-html="title"></h2>
                        <p v-if="subtitle"
                           :class="[$style.subtitle, 'h4', 'c-blue']"
                           v-html="subtitle"></p>
                        <slot v-else
                              name="subtitle"></slot>
                    </div>

                    <slot></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';

    export default {
        name: 'TemplateRightModal',

        components: {
            IconPlus,
        },

        props: {
            visible: Boolean,

            title: {
                type: String,
                default: '',
            },

            subtitle: {
                type: String,
                default: '',
            },

            additionalTitle: {
                type: String,
                default: '',
            }
        },
    };
</script>

<style lang="scss" module>
    .TemplateRightModal {
        z-index: 100;
    }

    .wrap {
        overflow: auto;
        padding: 2.4rem 0;

        @include respond-to(sm) {
            align-items: center;
            padding: unset;
        }

        @include respond-to(xs) {
            align-items: unset;
            justify-content: flex-end;
        }
    }

    .content {
        position: absolute;
        right: 2.5rem;
        display: flex;
        flex-direction: column;
        width: 56.8rem;
        min-height: calc(100% - 5rem);
        padding: 2.4rem;
        border-radius: .8rem;
        background-color: $base-0;

        @include respond-to(sm) {
            position: relative;
            top: unset;
            right: unset;
            width: 54.6rem;
            margin-top: auto;
            border-radius: 1.6rem 1.6rem 0 0;
            transform: unset;
        }

        @include respond-to(xs) {
            width: 100%;
            height: 100%;
            margin-top: unset;
            padding: 1.6rem;
            border-radius: unset;
        }
    }

    .closeBtn {
        position: absolute;
        top: 0;
        right: calc(100% + 1.2rem);

        @include respond-to(sm) {
            left: calc(100% + 1.2rem);
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .head {
        margin-bottom: 2.4rem;

        @include respond-to(sm) {
            margin-bottom: 0;
            padding-top: 2.4rem;
            padding-bottom: 2.4rem;
            border-bottom: 1px solid $base-100;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            padding: 0;
            border-bottom: unset;
        }
    }

    .title {
        text-transform: uppercase;
    }

    .subtitle {
        text-transform: uppercase;
    }

    .mobilePanel {
        display: none;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.6rem;

        @include respond-to(xs) {
            display: flex;
        }
    }

    .titleAdditional {
        text-transform: uppercase;
        font-size: 1.2rem;
        line-height: 1.2rem;
        color: $base-300;
    }

    .closeBtnMobile {
        z-index: 15;
    }
</style>
