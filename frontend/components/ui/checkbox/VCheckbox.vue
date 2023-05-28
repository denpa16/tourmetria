<template>
    <label
        ref="label"
        :class="['v-checkbox', classList]"
        role="checkbox"
        :aria-checked="isChecked"
        :aria-disabled="disabled"
    >
        <span
            :class="{_absolute: absolute}"
            class="v-checkbox__body"
        >

            <span class="v-checkbox__input">
                <input
                    v-model="computedValue"
                    class="v-checkbox__native"
                    type="checkbox"
                    :name="name"
                    :value="trueValue"
                    :true-value="trueValue"
                    :false-value="falseValue"
                    :disabled="disabled || readonly"
                    @keydown.enter.stop.prevent="$refs.label.click()"
                    @focus="onFocus"
                    @blur="onBlur"
                >
            </span>

            <span
                v-if="$slots.default"
                class="v-checkbox__label"
            >
                <slot></slot>
            </span>

            <span
                v-if="hintText"
                class="v-checkbox__hint-icon"
                @click.prevent="onToggleHint"
            >
                <!--                <IconHint class="frame-icon is-small" />-->
            </span>
            <span
                v-if="hintText"
                class="v-checkbox__hint"
                v-html="hintText"
            >
            </span>
        </span>
    </label>
</template>

<script>
// import IconHint from '@@/common/components/icons/IconHint';

    export default {
        name: 'VCheckbox',

        props: {
            hintText: {
                type: String,
                default: '',
            },

            /** Имя, которое используется при отправке формы */
            name: {
                type: String,
                default: '',
            },

            /** Текущее значение чекбокса */
            value: {
                type: [Array, String, Number, Boolean],
                required: true,
            },

            /**  Значение, которое используется при отправке формы, а также передается в value при активации чекбокса */
            trueValue: {
                type: [String, Number, Boolean],
                default: true,
            },

            falseValue: {
                type: [String, Number, Boolean],
                default: '',
            },

            /**  Определяет классы, которые будут модифицировать размер */
            size: {
                type: String,
                default: 'medium',
            },

            /**  Определяет классы, которые будут модифицировать цвет */
            color: {
                type: String,
                default: 'default',
            },

            /**  Очевидно, что это свойство отключает взаимодействие с чекбоксом */
            disabled: {
                type: Boolean,
                default: false,
            },

            readonly: {
                type: Boolean,
                default: false,
            },

            absolute: {
                type: Boolean,
                default: false,
            },

            /**  Добавляет параметр, при активации которого чекбокс переходит в состояние focused для изменения стилей */
            forcedFocused: {
                type: Boolean,
                default: false,
            },

            noCheckbox: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                isFocused: false,
                isVisibleHint: false,
            };
        },

        computed: {
            classList() {
                return [
                    `v-checkbox--${this.color}`,
                    `v-checkbox--${this.size}`,
                    {
                        'is-disabled': this.disabled,
                        'is-checked': this.isChecked,
                        'is-focused': this.isFocused || this.forcedFocused,
                        '_show-hint': this.isVisibleHint,
                        'no-checkbox': this.noCheckbox,
                    },
                ];
            },

            computedValue: {
                get() {
                    return this.value;
                },

                set(value) {
                    this.$emit('input', value);
                },
            },

            isChecked() {
                if (Array.isArray(this.value)) {
                    return this.value.indexOf(this.trueValue) > -1;
                }
                return this.value === this.trueValue;
            },
        },

        methods: {
            onFocus() {
                this.isFocused = true;
            },

            onBlur() {
                this.isFocused = false;
            },

            onToggleHint() {
                if (this.$deviceIs.mobile) {
                    return;
                }

                this.isVisibleHint = !this.isVisibleHint;
            },
        },
    };
</script>

<style lang="scss">
    .v-checkbox {
        outline: none;
        line-height: 0;
        user-select: none;
        cursor: pointer;

        /* Colors */

        &--default {
            @include hover {
                .v-checkbox__input {
                    border-color: $blue;
                    background-color: $base-0;
                }

                &.no-checkbox {
                    .v-checkbox__body {
                        border-color: $blue;
                        background-color: $base-0;
                    }

                    .v-checkbox__label {
                        color: $blue;
                    }
                }
            }

            .v-checkbox__label {
                color: $base-800;
            }

            .v-checkbox__input {
                border-color: $base-300;
                background-color: $base-0;
            }

            &:focus,
            &.is-focused {
                .v-checkbox__input {
                    border-color: $blue;
                    background-color: $base-0;
                }
            }

            &.is-checked {
                .v-checkbox__input {
                    border-color: $blue;
                    box-shadow: 0 0 0 .2rem rgba($blue, 1) inset;
                }

                &.no-checkbox {
                    .v-checkbox__body {
                        border-color: $base-100;
                        background-color: $base-0;
                    }

                    .v-checkbox__label {
                        color: $blue;
                    }
                }
            }

            &.no-checkbox {
                .v-checkbox__body {
                    border-color: $base-50;
                    background-color: $base-50;
                }
            }
        }

        /* End Colors */

        /* Sizes */

        &--medium {
            .v-checkbox__label {
                margin-left: 1.7rem;
                font-size: 1.2rem;
                font-weight: 600;
            }

            &.no-checkbox {
                .v-checkbox__body {
                    height: 4.4rem;
                    padding: 0 2.4rem;
                    border-radius: .4rem;
                    border: 1px solid transparent;
                }

                .v-checkbox__label {
                    margin-left: 0;
                }
            }
        }

        /* End Sizes */

        /* Modificators */

        &.is-disabled {
            pointer-events: none;

            .v-checkbox__input {
                border-color: $base-300;
                box-shadow: 0 0 0 .2rem rgba($base-300, 1) inset;
            }

            .v-checkbox__label {
                color: $base-300;
            }
        }

        &.is-checked {
            .v-checkbox__arrow {
                opacity: 1;
            }
        }

        &._show-hint {
            .v-checkbox__hint {
                visibility: visible;
                opacity: 1;
                transition: opacity $default-transition, visibility $default-transition;
            }
        }

        &.no-checkbox {
            .v-checkbox__input {
                display: none;
            }
        }

        /* End Modificators */

        &__body {
            position: relative;
            display: inline-flex;
            align-items: center;
            transition: all $default-color-transition;

            &._absolute {
                position: absolute;
                top: 1.2rem;
            }
        }

        &__input {
            position: relative;
            flex-shrink: 0;
            width: 1rem;
            height: 1rem;
            margin-bottom: .2rem;
            border: 1px solid;
            transition: all .2s;
        }

        &__arrow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1.6rem;
            height: 1.6rem;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: opacity .2s;
        }

        &__native {
            display: none;
        }

        &__label {
            white-space: nowrap;
            transition: color $default-color-transition;
        }

        &__hint-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 2rem;
            height: 2rem;
            margin-right: -.8rem;
            margin-left: 1.2rem;
            border-radius: 50%;
            background-color: rgba($base-0, .4);
            color: $base-800;

            @include respond-to(xs) {
                margin-top: -2px;
            }

            @include hover {
                &:hover ~ .v-checkbox__hint {
                    visibility: visible;
                    opacity: 1;
                    transition: opacity $default-transition, visibility $default-transition;
                }
            }
        }

        &__hint {
            position: absolute;
            top: -1rem;
            right: 0;
            z-index: 5;
            visibility: hidden;
            display: inline-block;
            padding: 1.2rem;
            border-radius: .8rem;
            background-color: rgba($base-800, .85);
            white-space: nowrap;
            font-size: 1.2rem;
            line-height: 1.33;
            color: $base-0;
            opacity: 0;
            transform: translate(50%, -100%);
            transition: opacity $default-transition, visibility $default-transition .3s;

            @include respond-to(sm) {
                transform: translate(0, -100%);
            }

            @include respond-to(xs) {
                padding: 10px;
                transform: translate(50%, -100%);
            }
        }
    }
</style>
