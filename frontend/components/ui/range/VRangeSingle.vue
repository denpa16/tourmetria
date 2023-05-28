<template>
    <div :class="classes"
         class="v-range">
        <div v-if="label"
             class="v-range__label l9"
             v-html="label"></div>

        <div class="v-range__inputs">
            <VInputThousands
                class="v-range__input"
                :value="state"
                :color="color"
                :positive-only="positiveOnly"
                :size="size"
                :postfix="postfix"
                @change="onInputChange"
            />

            <span v-if="$slots.postfix"
                  class="v-range__postfix">
                <slot name="postfix"></slot>
            </span>
        </div>

        <VSlider
            v-model="state"
            class="v-range__slider"
            :min="spec.min"
            :max="spec.max"
            :step="step"
            :color="color"
            :no-transition="noTransition"
            :disabled="disabled"
            :size="size"
            @change="emitChange"
            @mouseenter-dot="onMouseEnter"
            @mouseleave-dot="onMouseLeave"
        />
    </div>
</template>

<script>
    export default {
        name: 'VRangeSingle',

        props: {
            name: {
                type: String,
                default: '',
            },

            label: {
                type: String,
                default: '',
            },

            postfix: {
                type: String,
                default: '',
            },

            spec: {
                type: Object,
                required: true,
                default: () => ({min: 1, max: 100}),
            },

            value: {
                type: [String, Number],
                default: '',
            },

            step: {
                type: Number,
                default: 1,
            },

            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'medium', 'small'].indexOf(value) !== -1;
                },
            },

            /**
             * Устанавливает класс для определения цвета и передает цвет во внутренние компоненты
             */
            color: {
                type: String,
                default: 'default',
            },

            bordered: {
                type: Boolean,
                default: false,
            },

            /**
             * Устанавливает класс для определения обратного цвета
             */
            inversed: {
                type: Boolean,
                default: false,
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            positiveOnly: {
                type: Boolean,
                default: true,
            },

            trackSpecs: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                noTransition: false,
                state: this.value ? this.value : this.spec.min,
                valueHovered: '',
            };
        },

        computed: {
            classes() {
                return [
                    `v-range--${this.color}`,
                    `v-range--${this.size}`,
                    'is-single',
                    {
                        'is-bordered': this.bordered,
                        'is-inversed': this.inversed,
                        'is-disabled': this.disabled,
                        'is-changed': this.value,
                        [this.valueHovered]: this.valueHovered,
                    },
                ];
            },
        },

        watch: {
            spec(newValue, oldValue) {
                if (!this.value) {
                    this.state = this.spec.min;
                } else if (this.trackSpecs) {
                    // функционал для меняющихся спеков на основе фасетов (MortgageFilter)
                    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                        if (this.state > this.spec.max) {
                            this.state = this.spec.max - 1;
                        } else if (this.state < this.spec.min) {
                            this.state = this.spec.min;
                        } else {
                            return;
                        }

                        this.$nextTick(() => {
                            this.emitChange();
                        });
                    }
                }
            },

            value(val) {
                this.state = val ? val : this.spec.min;
            },
        },

        methods: {
            onInputChange(val) {
                if (val !== this.state) {
                    this.state = val;

                    this.$nextTick(() => {
                        this.emitChange();
                    });
                }
            },

            emitChange() {
                this.name
                    ? this.$emit('change', {
                        [`${this.name}`]: this.state.toString(),
                    })
                    : this.$emit('change', this.state.toString());
            },

            onMouseEnter(index) {
                if (index === 0) {
                    this.valueHovered = 'dot-hovered';
                }
            },

            onMouseLeave() {
                this.valueHovered = '';
            },
        },
    };
</script>

<style lang="scss">
    .v-range {
        &--default {
            &.dot-hovered {
                & .v-range__input {
                    & .v-input-thousands__native {
                        color: $blue;
                    }
                }
            }
        }
    }
</style>
