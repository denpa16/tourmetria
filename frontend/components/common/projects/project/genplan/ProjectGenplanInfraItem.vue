<template>
    <component :is="component"
               :class="[$style.ProjectGenplanInfraItem, classes]"
               :data-item-id="'infra' + item.id"
               @click="$emit('click', $event)">
        <div :class="$style.wrapper">
            <div v-if="!$slots.default"
                 ref="iconWrapper"
                 :class="$style.iconWrapper"
                 v-html="item.category_icon_content"></div>
            <span v-else
                  :class="[$style.text, {[$style._opened]: isOpened}, 'p2', 'c-blue']">
                <slot></slot>
            </span>

            <IconPinTriangle v-if="firstCount"
                             :class="[$style.triangle, triangleClasses]"
                             fill="#009EAE" />
        </div>
    </component>
</template>

<script>
    import IconPinTriangle from '~/components/icons/IconPinTriangle';
    export default {
        name: 'ProjectGenplanInfraItem',
        components: {IconPinTriangle},
        props: {
            item: {
                type: Object,
                default: () => ({}),
            },

            component: {
                type: String,
                default: 'div',
            },

            firstCount: {
                type: Boolean,
                default: false,
            },

            top: {
                type: Boolean,
                default: false,
            },

            bottom: {
                type: Boolean,
                default: false,
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            isOpened: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            classes() {
                return {
                    [this.$style._count]: this.$slots.default,
                    [this.$style._disabled]: this.disabled,
                };
            },

            triangleClasses() {
                return {
                    [this.$style._top]: this.top,
                    [this.$style._bottom]: this.bottom,
                };
            },
        },

        mounted() {
            if (this.$refs.iconWrapper) {
                const paths = this.$refs.iconWrapper.querySelectorAll('path');
                paths.forEach(path => path.setAttribute('fill', 'currentColor'));
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanInfraItem {
        width: 4.4rem;
        height: 4.4rem;
        border-radius: 50%;
        border: 4px solid $base-0;
        background-color: $base-0;
        transition: all $default-transition;
        cursor: pointer;
        user-select: none;

        @include hover {
            border: 4px solid $blue;
        }

        &._count {
            border: 4px solid $blue;

            @include hover {
                opacity: .85;
            }
        }

        &._disabled {
            cursor: default;

            @include hover {
                opacity: 1;
            }
        }
    }

    .wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .text {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: .2rem;

        &._opened {
            margin-top: 0;
        }
    }

    .triangle {
        position: absolute;
        width: 1.2rem;
        height: 1.2rem;
        color: $blue;

        &._top {
            top: -.6rem;
            left: -.2rem;
            transform: translateY(-100%) rotate(135deg);
        }

        &._bottom {
            right: -.2rem;
            bottom: -.6rem;
            transform: translateY(100%) rotate(-45deg);
        }
    }

    .iconWrapper {
        color: $blue;

        & > svg {
            display: block;
            width: 1.6rem;
            height: 1.6rem;
        }
    }
</style>
