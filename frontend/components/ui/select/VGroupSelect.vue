<template>
    <div v-clickoutside="onClickOutside"
         :class="classes"
         class="v-select">
        <div class="v-select__field"
             tabindex="0"
             @click.stop="toggleMenu"
             @focus="onFocus"
             @keydown.down.stop.prevent="navigateOptions('down')"
             @keydown.up.stop.prevent="navigateOptions('up')"
             @keydown.enter.prevent="onEnterPress"
             @keydown.esc="isOpened = false"
             @keydown.tab="onBlur"
             @mouseenter="inputHovering = true"
             @mouseleave="inputHovering = false">
            <div class="v-select__field-content">
                <div v-if="label"
                     class="v-select__label">
                    {{ label }}
                </div>

                <div class="v-select__value">
                    <span>
                        {{ valueStr }}
                        <span v-show="selectedOptions.length > 1"
                              class="v-select__value-add">
                            +{{ selectedOptions.length - 1 }}
                        </span>
                    </span>
                </div>

                <span class="v-select__arrow-box">
                    <svg class="v-select__arrow"
                         viewBox="0 0 8 8"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.93661 4.02016L2.52911 2.61266C2.24275 2.3263 1.77847 2.3263 1.49211 2.61266C1.20575 2.89902 1.20575 3.3633 1.49211 3.64966L3.58306 5.7406C3.77832 5.93587 4.0949 5.93587 4.29017 5.7406L6.38111 3.64966C6.66747 3.3633 6.66747 2.89902 6.38111 2.61266C6.09475 2.3263 5.63047 2.3263 5.34411 2.61266L3.93661 4.02016Z" />
                    </svg>
                </span>
            </div>
        </div>

        <transition name="select-menu">
            <VScrollBox v-if="isOpened"
                        :resizable="hideSelected"
                        is-absolute
                        :variable-width="variableWidth"
                        class="v-select__dropdown"
                        :class="[{'is-varible-width': variableWidth}]"
                        @close="onClickOutside">
                <div v-for="(group, i) in groups"
                     :key="i"
                     class="v-select__group"
                     :class="{'_with-label': group.label}">
                    <h6 v-if="group.label"
                        class="v-select__groupLabel l8">
                        {{ group.label }}
                    </h6>

                    <VSelectOption
                        v-for="option in group[categoriesName]"
                        :key="option[valueName]"
                        :class="modClass"
                        :option="option"
                        :value-name="valueName"
                        :label-name="labelName"
                        :value="value"
                        :color="optionColor"
                        :is-highlighted="highlightIndex === optionList.indexOf(option)"
                        :checkbox="checkbox"
                        :reset-value="option.reset"
                        :bordered="bordered"
                        @mouseenter="highlightIndex = optionList.indexOf(option)"
                        @mouseleave="highlightIndex = -1 "
                        @click="onOptionClick"
                    />
                </div>
            </VScrollBox>
        </transition>

        <select v-model="lazyValue"
                class="v-select__native"
                :disabled="isDisabled"
                :name="name"
                :multiple="multiple"
                @focus="onFocus"
                @blur="onBlur"
                @change="onNativeChange">
            <option v-if="resetLabel"
                    value="">
                {{ resetLabel }}
            </option>
            <optgroup v-for="group in groups"
                      :key="group.label"
                      :label="group.label">
                <option v-for="option in group[categoriesName]"
                        :key="option[valueName]"
                        :value="option[valueName]"
                        :disabled="option.disabled">
                    {{ option[labelName] }}
                </option>
            </optgroup>
        </select>
    </div>
</template>

<script type="text/babel">
    import VSelectOption from '~/components/ui/select/VSelectOption';
    import clickoutside from 'assets/js/directives/clickoutside';

    export default {
        name: 'VGroupSelect',

        components: {
            VSelectOption,
        },

        directives: {
            clickoutside,
        },

        props: {
            variableWidth: {
                type: Boolean,
                default: false,
            },

            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'big', 'medium', 'small', 'xsmall'].indexOf(value) !== -1;
                },
            },

            /**
             * Определяет классы, которые будут модифицировать цвет
             */
            color: {
                type: String,
                default: 'default',
            },

            /**
             * Определяет классы, которые будут модифицировать цвет option
             */
            optionColor: {
                type: String,
                default: 'default',
            },

            /**
             * Устанавливает класс для определения обратного цвета
             */
            inversed: {
                type: Boolean,
                default: false,
            },

            /**
             * Имя поля формы
             */
            name: {
                type: String,
                default: '',
            },

            /**
             * @param {String} Текущее значение.
             */
            value: {
                type: [String, Number, Array],
                default: '',
            },

            groups: {
                type: Array,
                default: () => [],
            },

            label: {
                type: String,
                default: '',
            },

            placeholder: {
                type: String,
                default: '',
            },

            hideSelected: {
                type: Boolean,
                default: false,
            },

            multiple: {
                type: Boolean,
                default: false,
            },

            checkbox: {
                type: Boolean,
                default: false,
            },

            labelName: {
                type: String,
                default: 'label',
            },

            valueName: {
                type: String,
                default: 'value',
            },

            resetLabel: {
                type: String,
                default: '',
            },

            bordered: {
                type: Boolean,
                default: false,
            },

            modClass: {
                type: String,
                default: '',
            },

            categoriesName: {
                type: String,
                default: 'categories',
            },

            displayName: {
                type: String,
                default: 'displayName',
            },
        },

        data() {
            return {
                lazyValue: '',
                isFocused: false,
                isOpened: false,
                highlightIndex: -1,
            };
        },

        computed: {
            classes() {
                return [
                    `v-select--${this.color}`,
                    `v-select--${this.size}`,
                    {
                        'is-inversed': this.inversed,
                        'has-placeholder': this.placeholder,
                        'has-label': this.label,
                        'is-focused': this.isFocused,
                        'is-active': this.isActive,
                        'is-opened': this.isOpened,
                        'is-disabled': this.isDisabled,
                        'is-bordered': this.bordered,
                    },
                ];
            },

            optionList() {
                const options = [];

                this.groups.forEach(group => {
                    group[this.categoriesName].forEach(opt => options.push(opt));
                });

                return options;
            },

            selectedOptions() {
                return this.optionList.filter(opt => {
                    if (Array.isArray(this.lazyValue)) {
                        return this.lazyValue.length
                            ? this.lazyValue.includes(opt[this.valueName])
                            : opt[this.valueName] === '';
                    }
                    return this.lazyValue === opt[this.valueName];
                });
            },

            isActive() {
                let flag = false;
                if (Array.isArray(this.lazyValue)) {
                    if (this.lazyValue.length) {
                        flag = true;
                    }
                } else if (this.lazyValue !== '') {
                    flag = true;
                }

                return flag;
            },

            valueStr() {
                if (!this.selectedOptions.length) {
                    if (this.placeholder) {
                        return this.placeholder;
                    } else if (this.label) {
                        return this.label;
                    }
                    return '';
                }

                if (this.selectedOptions.length) {
                    return this.selectedOptions[0][this.labelName];
                }

                const reducer = (acc, opt) => {
                    const name = opt[this.displayName] ? opt[this.displayName] : opt[this.labelName];
                    return `${acc + name}, `;
                };

                return this.selectedOptions.reduce(reducer, '').slice(0, -2);
            },

            isDisabled() {
                return this.groups.length === 0;
            },
        },

        watch: {
            value(val) {
                if (this.multiple) {
                    if (Array.isArray(val) && val !== this.lazyValue) {
                        this.lazyValue = val;
                        this.$emit('change', val);
                    }
                } else if (val !== this.lazyValue) {
                    this.lazyValue = val;
                    this.$emit('change', val);
                }
            },
        },

        created() {
            if (this.value) {
                this.lazyValue = this.value;
            } else {
                this.lazyValue = this.multiple ? [] : '';
            }
        },

        methods: {
            navigateOptions(direction) {
                if (!this.isOpened) {
                    this.isOpened = true;
                    return;
                }
                if (direction === 'down') {
                    this.highlightIndex++;
                    if (this.highlightIndex === this.optionList.length) {
                        this.highlightIndex = 0;
                    }
                } else if (direction === 'up') {
                    this.highlightIndex--;
                    if (this.highlightIndex < 0) {
                        this.highlightIndex = this.optionList.length - 1;
                    }
                }
            },

            toggleMenu() {
                if (this.isDisabled) {
                    return;
                }
                this.isOpened = !this.isOpened;
                this.highlightIndex = -1;
            },

            onEnterPress() {
                if (!this.isOpened) {
                    this.toggleMenu();
                } else {
                    const option = this.optionList[this.highlightIndex];
                    if (option && Object.prototype.hasOwnProperty.call(option, this.valueName)) {
                        this.onOptionClick(option[this.valueName]);
                    }
                }
            },

            onOptionClick(value) {
                if (this.value !== undefined) {
                    if (Array.isArray(this.lazyValue)) {
                        if (value === '') {
                            this.$emit('input', []);
                        } else {
                            const newValue = this.lazyValue.slice();
                            newValue.includes(value)
                                ? newValue.splice(this.lazyValue.indexOf(value), 1)
                                : newValue.push(value);
                            this.$emit('input', newValue);
                        }
                    } else {
                        if (this.lazyValue !== value) {
                            this.$emit('input', value);
                        }
                        this.isOpened = false;
                    }
                } else {
                    if (Array.isArray(this.lazyValue)) {
                        if (value === '') {
                            this.lazyValue = [];
                        } else {
                            const newValue = this.lazyValue.slice();
                            newValue.includes(value)
                                ? newValue.splice(this.lazyValue.indexOf(value), 1)
                                : newValue.push(value);
                            this.lazyValue = newValue;
                        }
                    } else {
                        if (this.lazyValue !== value) {
                            this.lazyValue = value;
                        }
                        this.isOpened = false;
                    }
                    this.$emit('change', this.lazyValue);
                }
            },

            /**
             * Метод, который обрабатывает собите focus
             */
            onFocus() {
                this.isFocused = true;
                this.$emit('focus');
            },

            /**
             * Метод, который обрабатывает собите blur
             */
            onBlur() {
                if (this.isOpened) {
                    this.isOpened = false;
                }
                this.isFocused = false;
                this.$emit('blur');
            },

            onClickOutside() {
                if (!this.isFocused) {
                    return;
                }
                this.isOpened = false;
                this.isFocused = false;
                this.$emit('blur');
            },

            onNativeChange() {
                if (this.value !== undefined) {
                    this.$nextTick(() => {
                        const newValue = this.lazyValue;
                        this.lazyValue = this.value;

                        if (newValue.includes('')) {
                            this.$emit('input', []);
                        } else {
                            this.$emit('input', newValue);
                        }
                    });

                    return;
                }

                if (this.lazyValue.includes('')) {
                    this.$emit('input', []);
                } else {
                    this.$emit('input', this.lazyValue);
                }
            },
        },
    };
</script>
