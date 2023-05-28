<template>
    <div :class="classes"
         class="v-range">
        <div v-if="label"
             class="v-range__label"
             v-html="label"></div>

        <div class="v-range__inputs">
            <VInputThousands
                v-if="!textValues.length"
                :class="['v-range__input', 'v-range__input_first']"
                :value="value[0]"
                :color="color"
                :positive-only="positiveOnly"
                :size="size"
                :postfix="postfix"
                :decimal-count="decimalCount"
                :default-value="spec.min"
                @change="onInputChange($event, 'first')"
            />

            <VInputThousands
                v-if="textValues.length"
                :class="['v-range__input', 'v-range__input_first']"
                :text-value="textValue[0]"
                :color="color"
                :positive-only="positiveOnly"
                :size="size"
                :postfix="postfix"
                :decimal-count="decimalCount"
                disabled
            />

            <VInputThousands
                v-if="!textValues.length"
                :class="['v-range__input', 'v-range__input_second']"
                :value="value[1]"
                :color="color"
                :positive-only="positiveOnly"
                :size="size"
                :postfix="postfix"
                :decimal-count="decimalCount"
                :default-value="spec.min"
                @change="onInputChange($event, 'second')"
            />

            <VInputThousands
                v-if="textValues.length"
                :class="['v-range__input', 'v-range__input_second']"
                :text-value="textValue[1]"
                :color="color"
                :positive-only="positiveOnly"
                :size="size"
                :postfix="postfix"
                :decimal-count="decimalCount"
                disabled
            />
        </div>

        <VSlider
            v-model="value"
            class="v-range__slider"
            :min="spec.min"
            :max="spec.max"
            :step="step"
            :color="color"
            :no-transition="noTransition"
            :disabled="disabled"
            range
            :size="size"
            @change="emitChange"
            @dragstart="onDragstart"
            @dragend="onDragend"
            @mouseenter-dot="onMouseEnter"
            @mouseleave-dot="onMouseLeave"
        />
    </div>
</template>

<script>
    export default {
        name: 'VRange',

        props: {
            name: {
                type: String,
                required: true,
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

            facet: {
                type: Object,
                required: true,
                default: () => ({}),
            },

            values: {
                type: Object,
                default: () => ({}),
            },

            valueMin: {
                type: [String, Number],
                default: '',
            },

            valueMax: {
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

            disabled: {
                type: Boolean,
                default: false,
            },

            positiveOnly: {
                type: Boolean,
                default: true,
            },

            textValues: {
                type: Array,
                default: () => [],
            },

            decimalCount: {
                type: Number,
                default: 2,
            },
        },

        data() {
            return {
                noTransition: false,
                valueChanged: '',
                value: [
                    this.valueMin ? this.valueMin : this.currentValueMin,
                    this.valueMax ? this.valueMax : this.currentValueMax,
                ],
            };
        },

        computed: {
            classes() {
                return [
                    `v-range--${this.color}`,
                    `v-range--${this.size}`,
                    {
                        'is-disabled': this.disabled,
                        'is-changed': this.valueMin !== '' || this.valueMax !== '',
                        'has-label': this.label,
                        [this.valueChanged]: this.valueChanged,
                    },
                ];
            },

            currentValueMin() {
                return this.spec.min < this.facet.min && this.facet.min ? this.facet.min : this.spec.min;
            },

            currentValueMax() {
                return this.spec.max > this.facet.max && this.facet.max ? this.facet.max : this.spec.max;
            },

            textValue() {
                return [
                    this.textValues.length ? this.textValues[this.value[0] - 1]?.label ?? '' : '',
                    this.textValues.length ? this.textValues[this.value[1] - 1]?.label ?? '' : '',
                ];
            },
        },

        watch: {
            facet() {
                if (!this.valueMin && !this.valueMax) {
                    this.applyFacet();
                }
            },

            spec() {
                if (!this.valueMin && !this.valueMax) {
                    this.value = [this.spec.min, this.spec.max];
                }
            },

            values() {
                this.applyValues();
            },

            valueMin() {
                this.applyValues();
            },

            valueMax() {
                this.applyValues();
            },
        },

        created() {
            if (this.facet?.min && this.facet?.max) {
                this.value = [this.valueMin ? this.valueMin : this.facet.min, this.valueMax ? this.valueMax : this.facet.max];
            }
        },

        methods: {
            applyValues() {
                const min = this.valueMin !== '' && (this.valueMin > this.facet.min) ? this.valueMin : this.facet.min;
                const max = this.valueMax !== '' && (this.valueMax < this.facet.max) ? this.valueMax : this.facet.max;
                this.value = [min, max];
            },

            applyFacet() {
                if (((this.facet.min || this.facet.min === 0) && this.facet.max) && (!this.valueMin && !this.valueMax)) {
                    this.$nextTick(() => {
                        this.value = [this.facet.min, this.facet.max];
                    });
                } else {
                    console.warn('Something wrong with range facets');
                }
            },

            onInputChange(val, handler) {
                if (handler === 'first') {
                    if (val !== this.value[0]) {
                        val > this.value[1]
                            ? this.value = [this.value[1], val]
                            : this.value = [val, this.value[1]];

                        this.$nextTick(() => {
                            this.emitChange();
                        });
                    }
                }
                if (handler === 'second') {
                    if (val !== this.value[1]) {
                        val < this.value[0]
                            ? this.value = [val, this.value[0]]
                            : this.value = [this.value[0], val];
                        this.$nextTick(() => {
                            this.emitChange();
                        });
                    }
                }
            },

            emitChange() {
                let minValue = this.value[0];
                let maxValue = this.value[1];

                if (minValue <= this.spec.min && this.spec.min === this.facet.min) {
                    minValue = this.spec.min;
                } else if (this.spec.min < this.facet.min && minValue < this.facet.min) {
                    minValue = this.facet.min;
                }

                if (maxValue >= this.spec.max && this.spec.max === this.facet.max) {
                    maxValue = this.spec.max;
                } else if (this.spec.max > this.facet.max && maxValue > this.facet.max) {
                    maxValue = this.facet.max;
                }

                if (this.value[0] !== minValue) {
                    this.value = [minValue, this.value[1]];
                }

                if (this.value[1] !== maxValue) {
                    this.value = [this.value[0], maxValue];
                }

                minValue = minValue.toString();
                maxValue = maxValue.toString();

                if (this.textValues.length) {
                    this.$emit('change', {
                        min: minValue,
                        max: maxValue,
                    });
                } else {
                    this.$emit('change', {
                        [`${this.name}_min`]: minValue,
                        [`${this.name}_max`]: maxValue,
                    });
                }
            },

            onMouseEnter(index) {
                if (index === 0) {
                    this.valueChanged = 'left-changed';
                } else if (index === 1) {
                    this.valueChanged = ' right-changed';
                }
            },

            onMouseLeave() {
                this.valueChanged = '';
            },

            onDragstart(index) {
                if (index === 0) {
                    this.valueChanged = 'left-changed';
                } else if (index === 1) {
                    this.valueChanged = ' right-changed';
                }
            },

            onDragend() {
                this.valueChanged = '';
            },
        },
    };
</script>

<style lang="scss">
    .v-range {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 100%;
        transition: border-color .4s, background-color .4s;

        /* Colors */

        &--default {
            border-color: $base-50;
            background-color: $base-50;
            color: $base-1000;

            @include hover {
                .v-range__label {
                    color: $base-700;
                }
            }

            &.is-disabled {
                border-color: $base-100;
                background-color: $base-100;
                color: $base-500;

                .v-slider-dot__handle {
                    background-color: $base-500;
                }

                .v-slider__progress {
                    background-color: $base-500;
                }

                .v-input-thousands__native {
                    color: $base-500;
                }
            }

            .v-range__label {
                color: $base-400;
            }

            &.left-changed {
                & .v-range__input_first {
                    &.v-range__input {
                        & .v-input-thousands__native {
                            color: $blue;
                        }
                    }
                }
            }

            &.right-changed {
                & .v-range__input_second {
                    &.v-range__input {
                        & .v-input-thousands__native {
                            color: $blue;
                        }
                    }
                }
            }
        }

        /* End colors */

        /* Sizes */
        &--medium {
            height: 4.4rem;
            padding: 0 .4rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1.6rem;

            .v-range__inputs {
                padding: 0 1.6rem .4rem;
            }
        }

        /* End sizes */

        /* Modificators */
        &.is-single {
            .v-slider__rail {
                padding: 0;
                padding-top: .7rem;
            }
        }

        &.is-disabled {
            pointer-events: none;
        }

        &.has-label {
            margin-top: 2.6rem;
        }

        /* End modificators */

        &__label {
            position: absolute;
            top: -2.6rem;
            left: 0;
            padding-bottom: 1.2rem;
            font-family: $accent-font-family;
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1.4rem;
            transition: color .4s;

            @include respond-to(xs) {
                top: -2.2rem;
                padding-bottom: .8rem;
            }
        }

        &__inputs {
            position: relative;
            display: flex;
        }

        &__input {
            .v-input-thousands__native {
                font-family: $base-font;
                color: $base-1000;
                transition: color .4s;

                @include hover {
                    color: $blue;
                }

                &[disabled] {
                    -webkit-text-fill-color: $base-500;
                    opacity: 1;
                }
            }

            &_second {
                .v-input-thousands__native {
                    text-align: right;
                }
            }
        }

        &__slider {
            transform: translateY(1px);
        }
    }
</style>
