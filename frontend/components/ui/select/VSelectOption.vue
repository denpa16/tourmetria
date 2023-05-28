<template>
    <component
        :is="mainComponent"
        class="v-select-option"
        :class="classes"
        v-bind="componentAttrs"
        @mousedown="isActive = true"
        @mouseup="isActive = false"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="mainComponent === 'a' ? onLinkClick($event) : onClick($event)"
    >
        <template v-if="resetValue">
            <svg
                class="v-select-option__reset"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12.7071 3.29303C12.5196 3.10556 12.2652 3.00024 12.0001 3.00024C11.7349 3.00024 11.4806 3.10556 11.2931 3.29303L8.00008 6.58603L4.70708 3.29303C4.51848 3.11087 4.26588 3.01008 4.00368 3.01236C3.74148 3.01464 3.49067 3.1198 3.30526 3.30521C3.11985 3.49062 3.01469 3.74143 3.01241 4.00363C3.01013 4.26583 3.11092 4.51843 3.29308 4.70703L6.58608 8.00003L3.29308 11.293C3.19757 11.3853 3.12139 11.4956 3.06898 11.6176C3.01657 11.7396 2.98898 11.8709 2.98783 12.0036C2.98668 12.1364 3.01198 12.2681 3.06226 12.391C3.11254 12.5139 3.18679 12.6255 3.28069 12.7194C3.37458 12.8133 3.48623 12.8876 3.60913 12.9379C3.73202 12.9881 3.8637 13.0134 3.99648 13.0123C4.12926 13.0111 4.26048 12.9835 4.38249 12.9311C4.50449 12.8787 4.61483 12.8025 4.70708 12.707L8.00008 9.41403L11.2931 12.707C11.4817 12.8892 11.7343 12.99 11.9965 12.9877C12.2587 12.9854 12.5095 12.8803 12.6949 12.6948C12.8803 12.5094 12.9855 12.2586 12.9878 11.9964C12.99 11.7342 12.8892 11.4816 12.7071 11.293L9.41408 8.00003L12.7071 4.70703C12.8946 4.5195 12.9999 4.26519 12.9999 4.00003C12.9999 3.73487 12.8946 3.48056 12.7071 3.29303Z"
                />
            </svg>
        </template>
        <template v-else>
            <VCheckbox
                v-if="checkbox"
                :value="isSelected"
                :true-value="true"
                :color="color"
                :disabled="option.disabled"
                :forced-focused="isHighlighted"
                @click.native.prevent
            />
        </template>

        <span class="v-select-option__text">
            {{ option[labelName] }}
        </span>
        <svg
            v-if="multiple && isSelected && !isButton"
            class="v-select-option__check"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.99987 7.586L9.59587 2.9895L10.3034 3.6965L4.99987 9L1.81787 5.818L2.52487 5.111L4.99987 7.586Z"
                fill="currentColor"
            />
        </svg>

        <nuxt-link
            v-if="option.to"
            class="v-select-option__nuxt-link"
            :to="option.to"
        />
    </component>
</template>

<script>
    export default {
        name: 'VSelectOption',

        props: {
            option: {
                type: Object,
                required: true,
                default: () => ({
                    value: '%value%',
                    label: '%label%',
                }),
            },

            value: {
                type: [String, Number, Array, Boolean],
                required: true,
            },

            labelName: {
                type: String,
                default: 'label',
            },

            valueName: {
                type: String,
                default: 'value',
            },

            color: {
                type: String,
                default: 'default',
            },

            isHighlighted: {
                type: Boolean,
                default: false,
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            hideDisabled: {
                type: Boolean,
                default: false,
            },

            checkbox: {
                type: Boolean,
                default: false,
            },

            bordered: {
                type: Boolean,
                default: false,
            },

            resetValue: {
                type: Boolean,
                default: false,
            },

            withoutGroup: {
                type: Boolean,
                default: false,
            },

            multiple: {
                type: Boolean,
                default: false,
            },

            isModal: {
                type: Boolean,
                default: false,
            },

            isButton: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                isActive: false,
            };
        },

        computed: {
            classes() {
                return [
                    `v-select-option--${this.color}`,
                    {
                        'is-highlighted': this.isHighlighted,
                        'is-active': this.isActive,
                        'is-selected': this.isSelected,
                        'is-disabled': this.disabled,
                        'is-hidden': this.hideDisabled,
                        'is-bordered': this.bordered,
                        'is-reset': this.resetValue,
                        'is-multiple': this.multiple,
                        'is-modal': this.isModal,
                        'is-button': this.isButton,
                        '_without-group': this.withoutGroup,
                        '_with-check': this.checkbox,
                    },
                ];
            },

            isSelected() {
                if (Array.isArray(this.value)) {
                    if (this.value.length) {
                        return this.value.includes(this.option[this.valueName]);
                    }
                    return this.option[this.valueName] === '';
                }
                return this.value === this.option[this.valueName];
            },

            mainComponent() {
                if (this.option?.href) {
                    return 'a';
                }

                return 'div';
            },

            componentAttrs() {
                const attrs = {};

                if (this.option?.href) {
                    attrs.href = this.option.href;
                    attrs.target = '_blank';
                }

                return attrs;
            },
        },

        methods: {
            onClick() {
                if (this.disabled) {
                    return;
                }

                this.$emit('click', this.option[this.valueName]);
            },

            onLinkClick(e) {
                e.stopPropagation();
            },

            onMouseEnter() {
                if (this.disabled) {
                    return;
                }
                this.$emit('mouseenter');
            },

            onMouseLeave() {
                if (this.disabled) {
                    return;
                }
                this.isActive = false;
                this.$emit('mouseleave');
            },
        },
    };
</script>

<style lang="scss">
    .v-select-option {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        letter-spacing: -.02em;
        transition: background-color $default-color-transition, color $default-color-transition;
        cursor: pointer;
        user-select: none;

        &--default {
            height: 4.4rem;
            padding: 0 1.6rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1.2rem;
            color: $base-1000;

            //&:not(.is-bordered) {
            //    &.is-highlighted {
            //        background-color: $base-50;
            //    }
            //
            //    &.is-selected {
            //        color: $blue;
            //    }
            //
            //    &.is-disabled {
            //        color: $base-300;
            //    }
            //}

            &.is-highlighted {
                background-color: $base-50;
            }

            &.is-selected,
            &.is-active {
                &:not(.is-reset):not(.is-multiple):not(._with-check):not(.is-modal) {
                    background-color: $blue;
                    color: $base-0;
                }

                &:not(.is-reset).is-multiple {
                    color: $blue;
                }
            }

            &.is-disabled {
                color: $base-500;
            }

            &.is-reset {
                color: $base-500;
            }

            &.is-button {
                padding: 1.5rem 2.4rem 1.3rem;
                border-radius: .4rem;
                border: 1px solid $base-50;
                background-color: $base-50;
                transition: all $default-color-transition;

                @include hover {
                    border: 1px solid $blue;
                    background-color: $base-0;

                    .v-select-option__text {
                        color: $blue;
                    }
                }

                &.is-selected {
                    border: 1px solid $base-100;
                    background-color: $base-0;

                    .v-select-option__text {
                        color: $blue;
                    }
                }

                &.is-disabled {
                    border: 1px solid rgba($base-50, .44);
                    background-color: rgba($base-50, .44);
                    color: $base-800;
                }
            }
        }

        &.is-hidden.is-disabled {
            display: none;
        }

        &.is-disabled {
            opacity: .5;
            pointer-events: none;
            cursor: default;
        }

        &.is-modal {
            &:not(._with-check) {
                margin-bottom: .8rem;
                border-radius: .4rem;
                border: 1px solid $base-100;
            }

            &.is-selected,
            &.is-active {
                border-color: $blue;
                color: $blue;
            }
        }

        &._with-check {
            justify-content: start;

            & > *:not(:last-child) {
                margin-right: 1.6rem;
            }

            .v-select-option__text {
                margin-left: .8rem;
            }
        }

        &.is-reset {
            .v-select-option__reset {
                margin-right: 1.2rem;
                transform: translateX(.2rem);
            }

            &._with-check {
                .v-select-option__text {
                    margin-left: 0;
                }
            }
        }

        &__text {
            transition: color $default-color-transition;
        }

        &__reset {
            width: 1.6rem;
            height: 1.6rem;
            fill: currentColor;
            transition: color $default-color-transition;
        }

        &__check {
            width: 1.2rem;
            height: 1.2rem;
        }

        &__nuxt-link {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
        }
    }
</style>
