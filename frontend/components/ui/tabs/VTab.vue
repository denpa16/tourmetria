<template>
    <component :is="tag"
               :class="['v-tab-btn', classes, modClass]"
               v-bind="tabProperties"
               @click="$emit('click', value)"
    >
        <span class="v-tab__label">
            {{ label }}
        </span>
    </component>
</template>

<script>
    export default {
        name: 'VTab',

        props: {
            tag: {
                type: String,
                default: 'li',
            },

            tab: {
                type: Object,
                default: () => ({}),
            },

            type: {
                type: String,
                default: 'square',
                validator(value) {
                    return ['ellipse', 'square', 'transparent', 'custom', 'scroll'].indexOf(value) !== -1;
                },
            },

            activeColor: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'secondary', 'dark', 'custom'].indexOf(value) !== -1;
                },
            },

            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'medium', 'small', 'custom'].indexOf(value) !== -1;
                },
            },

            fill: {
                type: Boolean,
                default: false,
            },

            active: {
                type: Boolean,
                default: false,
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            modClass: {
                type: String,
                default: '',
            },

            labelName: {
                type: String,
                default: 'label',
            },
        },

        computed: {
            classes() {
                return [
                    'v-tab',
                    `v-tab--${this.type}`,
                    `v-tab--${this.activeColor}`,
                    `v-tab--${this.size}`,
                    {
                        'is-active': this.active,
                        'is-disabled': this.disabled,
                        'is-fill': this.fill
                    },
                ];
            },

            value() {
                return this.tab?.value ? this.tab.value : '';
            },

            label() {
                return this.tab?.[this.labelName] ? this.tab[this.labelName] : '';
            },

            tabProperties() {
                const properties = {};
                if (this.tag === 'button') {
                    properties.type = 'button';
                }

                return properties;
            },
        },

    };
</script>

<style lang="scss">
    .v-tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
        background-color: transparent;
        transition: $default-color-transition;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;

        .v-tab__label {
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1.6rem;
            transition: $default-color-transition;
        }

        &--ellipse {
            //
        }

        &--square,
        &--scroll {
            background-color: $base-50;

            &.v-tab--small {
                height: 3.2rem;
                padding: 0 2rem;
                border-radius: .4rem;

                .v-tab__label {
                    font-size: 1.2rem;
                    font-weight: 600;
                    line-height: 1.6rem;
                }
            }

            &.v-tab--medium {
                height: 4.4rem;
                padding: 0 2.4rem;
                border-radius: .4rem;

                .v-tab__label {
                    font-size: 1.2rem;
                    font-weight: 600;
                    line-height: 1.6rem;
                }
            }

            &.v-tab--large {
                //
            }
        }

        &--transparent {
            position: relative;
            border: none;

            &:after {
                content: "";
                position: absolute;
                bottom: 0;
                width: 0;
                height: .2rem;
                background-color: $blue;
                transition: width $default-transition;
            }

            &.v-tab--small {
                height: 3.2rem;
                padding: 0 2rem;

                .v-tab__label {
                    font-size: 1.2rem;
                    font-weight: 600;
                    line-height: 1.6rem;
                }
            }

            &.v-tab--medium {
                height: 4.4rem;
                padding: 0 2.4rem;

                .v-tab__label {
                    font-size: 1.2rem;
                    font-weight: 600;
                    line-height: 1.6rem;
                }
            }

            &.v-tab--large {
                //
            }
        }

        &--primary {
            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }

            &:not(.is-disabled) {
                &.is-active {
                    border-color: $base-100;
                    background-color: $base-0;

                    .v-tab__label {
                        color: $blue;
                    }

                    &.is-fill {
                        border-color: $blue;
                        background-color: $blue;

                        .v-tab__label {
                            color: $base-0;
                        }
                    }

                    &.v-tab--transparent {
                        &:after {
                            width: calc(100% - 4.8rem);
                        }
                    }
                }
            }

            &:not(.is-active) {
                &.v-tab--square {
                    @include hover {
                        border-color: $blue;
                        background-color: $base-0;

                        .v-tab__label {
                            color: $blue;
                        }
                    }
                }

                &.v-tab--scroll {
                    @include hover {
                        border-color: $blue;
                        background-color: $base-0;

                        .v-tab__label {
                            color: $blue;
                        }
                    }
                }

                &.v-tab--transparent {
                    @include hover {
                        .v-tab__label {
                            color: $blue;
                        }
                    }
                }
            }
        }

        &--secondary {
            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }

            &:not(.is-disabled) {
                &.is-active {
                    border-color: $base-100;
                    background-color: $base-0;

                    .v-tab__label {
                        color: $blue;
                    }

                    &.is-fill {
                        border-color: $blue;
                        background-color: $blue;

                        .v-tab__label {
                            color: $base-0;
                        }
                    }

                    &.v-tab--transparent {
                        &:after {
                            width: calc(100% - 4.8rem);
                        }
                    }
                }
            }

            &:not(.is-active) {
                &.v-tab--square {
                    .v-tab__label {
                        color: $base-800;
                    }

                    @include hover {
                        border-color: $blue;
                        background-color: $base-0;

                        .v-tab__label {
                            color: $blue;
                        }
                    }
                }

                &.v-tab--transparent {
                    @include hover {
                        .v-tab__label {
                            color: $blue;
                        }
                    }
                }
            }
        }

        &--dark {
            //
        }
    }
</style>
