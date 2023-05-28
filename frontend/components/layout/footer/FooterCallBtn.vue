<template>
    <component :is="component"
               :href="link"
               :class="[$style.FooterCallBtn, classes]"
               @click="$emit('click')">
        <div :class="$style.textWrapper">
            <div :class="[$style.text, $style.title, 'h4']"
                 v-html="title"></div>
            <div :class="[$style.text, $style.subtitle, 'h4']"
                 v-html="subtitle"></div>
        </div>

        <div v-if="$slots.default"
             :class="$style.btnWrapper">
            <VSquareButton :class="$style.btn"
                           :size="$deviceIs.mobile ? 'small' : 'medium'"
                           :color="color === 'dark' ? 'white' : $deviceIs.mobile ? 'primary' : 'light'"
                           role="presentation"
                           tabindex="-1">
                <slot></slot>
            </VSquareButton>
        </div>
    </component>
</template>

<script>
    export default {
        name: 'FooterCallBtn',

        props: {
            title: {
                type: String,
                default: '',
            },

            subtitle: {
                type: String,
                default: '',
            },

            color: {
                type: String,
                default: 'light',
            },

            link: {
                type: String,
                default: '',
            }
        },

        computed: {
            classes() {
                return [
                    {
                        [this.$style[`_${this.color}`]]: this.color,
                    },
                ];
            },

            component() {
                if (this.link) {
                    return 'a';
                }
                return 'div';
            },
        }
    };
</script>

<style lang="scss" module>
    .FooterCallBtn {
        position: relative;
        height: 13.6rem;
        padding: 2rem 1.6rem;
        border-radius: .8rem;
        cursor: pointer;

        &._light {
            background-color: $base-0;

            .title {
                color: $base-300;
            }

            .subtitle {
                color: $base-800;
            }
        }

        &._dark {
            background-color: $base-800;

            .title {
                color: $blue;
            }

            .subtitle {
                color: $base-0;
            }
        }

        @include hover {
            .btn {
                border-color: $blue;
                background-color: $blue;
                color: $base-0;
            }
        }

        @include respond-to(sm) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 9.6rem;
        }

        @include respond-to(xs) {
            height: 7rem;
            padding: 1.7rem 1.6rem 1.5rem;

            .title,
            .subtitle {
                font-size: 1.6rem;
                line-height: 1.9rem;
            }
        }
    }

    .text {
        text-transform: uppercase;
    }

    .btnWrapper {
        position: absolute;
        right: 1.6rem;
        bottom: 1.6rem;

        @include respond-to(sm) {
            position: static;
        }
    }
</style>
