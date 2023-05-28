<template>
    <ul :class="[$style.VBreadcrumb, classList]">
        <li
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
            :class="[$style.item, {
                [$style._disabled]: breadcrumb.disabled,
            }]"
        >
            <n-link
                :class="$style.link"
                :to="breadcrumb.link"
            >
                {{ breadcrumb.title }}
            </n-link>
        </li>
    </ul>
</template>

<script>
/**
 * Компонент хлебных крошек
 *
 * @version 1.0.0
 * @displayName VBreadcrumb
 */
export default {
    name: 'VBreadcrumb',

    props: {
        /**
         * Определяет классы, которые будут модифицировать размер
         */
        size: {
            type: String,
            default: 'medium',
            validator: value => ['small', 'medium'].includes(value),
        },

        /**
         * Определяет классы, которые будут модифицировать цвет
         */
        color: {
            type: String,
            default: 'base',
            validator: val => ['base', 'dark'].includes(val),
        },

        /**
         * Определяет набор хлебных крошек
         */
        breadcrumbs: {
            type: Array,
            default: () => [],
            required: true,
        },

        /**
         * Определяет тип разделителя между хлебными крошками
         */
        separator: {
            type: String,
            default: 'slash',
            validator: v => [
                'slash',
                'point',
            ].includes(v),
        },
    },

    computed: {
        classList() {
            return {
                [this.$style[`_${this.color}`]]: this.color,
                [this.$style[`_${this.size}`]]: this.size,
                [this.$style[`_${this.separator}`]]: this.separator,
            };
        },
    },
};
</script>

<style lang="scss" module>
    $base: $grey;
    $base-hover: $grey-middle;
    $base-disable: $grey-light;

    .VBreadcrumb {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        padding: 3.2rem 0 1.2rem;
        list-style: none;

        &._small {
            .item {
                font-size: 1.4rem;

                &:not(:last-child) {
                    margin-right: 1.8rem;

                    &:after {
                        right: -1rem;
                        width: .3rem;
                        height: .3rem;
                    }
                }
            }
        }

        &._medium {
            .item {
                font-size: 1.6rem;

                &:not(:last-child) {
                    margin-right: 2.2rem;

                    &:after {
                        right: -1.3rem;
                        width: .4rem;
                        height: .4rem;
                    }
                }
            }
        }

        &._point {
            .item:not(:last-child):after {
                content: "";
            }
        }

        &._slash {
            .item:not(:last-child):after {
                content: "/";
                right: -.8rem;
                width: 0;
                height: 100%;
                color: $base-disable;
            }
        }

        &._base {
            .item {
                color: $base;

                &._disabled {
                    color: $base-disable;

                    .link {
                        color: $base-disable;
                    }
                }

                &:not(:last-child) {
                    &:after {
                        background-color: $base-disable;
                        color: $base-disable;
                    }
                }
            }

            .link {
                color: $base;

                &:hover {
                    color: $base-hover;
                }
            }
        }

        &._dark {
            .item {
                color: $base-disable;

                &._disabled {
                    color: $base;

                    .link {
                        color: $base;
                    }
                }

                &:not(:last-child) {
                    &:after {
                        background-color: $base;
                        color: $base;
                    }
                }
            }

            .link {
                color: $base-disable;

                &:hover {
                    color: $base-hover;
                }
            }
        }
    }

    .item {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 1;
        letter-spacing: -.005em;
        user-select: none;

        &._disabled {
            pointer-events: none;
        }

        &:not(:last-child) {
            &:after {
                position: absolute;
                border-radius: 50%;
                transition: color $default-transition, background-color $default-transition;
            }
        }
    }

    .link {
        color: $base;
        transition: color $default-transition;
        cursor: pointer;
    }
</style>
