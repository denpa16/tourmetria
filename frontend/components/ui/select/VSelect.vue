<template>
    <div
        ref="select"
        v-clickoutside="onClickOutside"
        :class="classes"
        class="v-select"
    >
        <span
            v-if="clearBtn&&value&&(typeof value === 'number' ? value.toString().length : value.length)"
            class="v-select__clear-box"
            @click="$emit('clear-filter')"
        >
            <svg
                class="v-select__clear"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6 5.11125L9.11125 2L10 2.88875L6.88875 6L10 9.11125L9.11125 10L6 6.88875L2.88875 10L2 9.11125L5.11125 6L2 2.88875L2.88875 2L6 5.11125Z"
                    fill="currentColor"
                />
            </svg>
        </span>

        <!--        Если что-то сломалось то добавить модфикатор stop для события click-->
        <div
            class="v-select__field"
            tabindex="0"
            @click="toggleMenu"
            @focus="onFocus"
            @keydown.down.stop.prevent="navigateOptions('down')"
            @keydown.up.stop.prevent="navigateOptions('up')"
            @keydown.enter.prevent="onEnterPress"
            @keydown.esc="isOpened = false"
            @keydown.tab="onBlur"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
        >
            <div
                v-if="label"
                class="v-select__label"
            >
                {{ label }}
            </div>
            <div class="v-select__field-content">
                <div
                    class="v-select__value"
                    :class="[{'is-arrow': arrow}]"
                >
                    <span>
                        {{ valueStr }}
                        <span
                            v-if="placeholderPostfix && selectedOptions.length === 0"
                            class="v-select__placeholder-add"
                        >
                            {{ placeholderPostfix }}
                        </span>
                        <span
                            v-if="postfix && selectedOptions.length >= 1"
                            class="v-select__value-add"
                        >
                            {{ postfix }}
                        </span>
                    </span>
                </div>

                <span
                    v-if="$slots.icon"
                    class="v-select__icon-box"
                >
                    <slot name="icon"></slot>
                </span>


                <span
                    v-else-if="arrow&&!(clearBtn&&value&&(typeof value === 'number' ? value.toString().length : value.length))"
                    class="v-select__arrow-box"
                >
                    <svg
                        class="v-select__arrow"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M8.25 10.666L4.25 6.66602L12.25 6.66602L8.25 10.666Z" />
                    </svg>
                </span>
            </div>
        </div>

        <transition name="fade">
            <div
                v-if="error && !disabled && errorMsg"
                class="v-select__error"
            >
                <div class="v-select__error-content">
                    <div
                        :class="['p7', 'v-select__error-text']"
                        v-html="`*${errorMsg}`"
                    >
                    </div>
                </div>
            </div>
        </transition>

        <transition :name="transitionWrapName">
            <div
                v-if="isOpened && !isForcedClose"
                class="v-select__wrapper"
                :class="wrapClasses"
                :style="wrapInlineStyle"
                @click.self="onClickOutside"
            >
                <transition
                    :name="transitionOptionsName"
                    appear
                >
                    <div
                        class="v-select__dropdown"
                        :style="modalDropdownStyles"
                    >
                        <div
                            v-if="isModalBreakpoint"
                            class="v-select__modal-header"
                        >
                            <h5 class="v-select__modal-title">
                                {{ modalTitle }}
                            </h5>
                            <VSquareButton
                                color="light"
                                size="small"
                                aria-label="Сбросить"
                                @click="onClickOutside"
                            >
                                <IconCross class="v-select__cross-icon" />
                            </VSquareButton>
                        </div>
                        <div
                            v-if="search"
                            class="v-select__search"
                        >
                            <VInputSearch
                                placeholder="Город"
                                :items="options"
                                value-path="label"
                                is-prepend-icon
                                @input="onSearchInput"
                            />
                        </div>

                        <VTabs
                            v-if="isTabs"
                            v-show="currentTabs.length"
                            :is-required="isTabsRequired"
                            class="v-select__tabs"
                            size="small"
                            :tabs="currentTabs"
                            :value="activeTab"
                            :active-color="activeColor"
                            fill
                            @change="onTabsChange"
                        />

                        <VScrollBox
                            class="v-select__wrapper-scrollbox"
                            :resizable="hideSelected"
                            is-relative
                            :variable-width="variableWidth"
                            :forced-param="scrollboxForcedParam"
                            @close="onClickOutside"
                            @on-scroll="onScroll"
                            @mouseenter.native="onMouseEnter"
                            @mouseleave.native="onMouseLeave"
                        >
                            <transition name="fade-content">
                                <div
                                    v-show="!search || filteredOptions.length"
                                    class="v-select__options"
                                >
                                    <VSelectOption
                                        v-for="(option, index) in ((search || isTabs) ? filteredOptions : options)"
                                        :key="option[valueName] + option[labelName]"
                                        :class="{'_city': option.type === 'city'}"
                                        :option="option"
                                        :value-name="valueName"
                                        :label-name="selectType === 'rooms' ? 'name' : labelName"
                                        :value="value"
                                        :disabled="!checkIsOptionEnable(option)"
                                        :hide-disabled="hideDisabled"
                                        :color="optionColor"
                                        :is-highlighted="highlightIndex === index"
                                        :checkbox="checkbox"
                                        :reset-value="option.reset"
                                        :bordered="bordered"
                                        :multiple="multiple"
                                        :is-modal="isModalBreakpoint"
                                        :is-button="selectType === 'rooms'"
                                        without-group
                                        @mouseenter="highlightIndex = index"
                                        @mouseleave="highlightIndex = -1"
                                        @click="onOptionClick"
                                    />
                                </div>
                            </transition>
                        </VScrollBox>
                        <transition name="fade-content">
                            <span
                                v-if="search"
                                v-show="filteredOptions.length === 0"
                                class="v-select__not-found"
                            >
                                Ничего не найдено
                            </span>
                        </transition>
                    </div>
                </transition>
            </div>
        </transition>

        <!--        Стандартный select-->
        <!--        <select v-model="lazyValue"-->
        <!--                class="v-select__native"-->
        <!--                :disabled="isDisabled"-->
        <!--                :name="name"-->
        <!--                :multiple="multiple"-->
        <!--                @focus="onFocus"-->
        <!--                @blur="onBlur"-->
        <!--                @change="onNativeChange">-->
        <!--            <option v-if="resetLabel"-->
        <!--                    value="">-->
        <!--                {{ resetLabel }}-->
        <!--            </option>-->
        <!--            <option v-for="option in nativeOptions"-->
        <!--                    :key="option[valueName] + option[labelName]"-->
        <!--                    :value="option[valueName]"-->
        <!--                    :disabled="option.disabled">-->
        <!--                {{ option[labelName] }}-->
        <!--            </option>-->
        <!--        </select>-->
    </div>
</template>

<script type="text/babel">
    import VSelectOption from '~/components/ui/select/VSelectOption';
    import clickoutside from 'assets/js/directives/clickoutside';
    import VInputSearch from '~/components/ui/input/VInputSearch';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import IconCross from '~/components/icons/IconCross';

    export default {
        name: 'VSelect',
        components: {
            IconCross,
            VInputSearch,
            VSelectOption,
        },

        directives: {
            clickoutside,
        },

        mixins: [breakpointCheck],

        props: {
            variableWidth: {
                type: Boolean,
                default: false,
            },

            variablePos: {
                type: Boolean,
                default: false,
            },

            /**
             * Параметры выпадающего окна
             */
            marginDropdown: {
                type: String,
                default: '',
            },

            minWidthDropdown: {
                type: String,
                default: '',
            },

            maxWidthDropdown: {
                type: String,
                default: '',
            },

            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'big', 'medium', 'small'].indexOf(value) !== -1;
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
                type: [String, Number, Array, Boolean],
                default: '',
            },

            options: {
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

            placeholderPostfix: {
                type: String,
                default: '',
            },

            disabled: {
                type: Boolean,
                default: false,
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

            hideDisabled: {
                type: Boolean,
                default: false,
            },

            resetLabel: {
                type: String,
                default: '',
            },

            bordered: {
                type: Boolean,
                default: false,
            },

            inline: {
                type: Boolean,
                default: false,
            },

            arrow: {
                type: Boolean,
                default: true,
            },

            displayName: {
                type: String,
                default: 'displayName',
            },

            allowZero: Boolean,

            error: {
                type: Boolean,
                default: false,
            },

            errorMsg: {
                type: String,
                default: '',
            },

            postfix: {
                type: String,
                default: '',
            },

            openOnHover: {
                type: Boolean,
                default: false,
            },

            isForcedClose: {
                type: Boolean,
                default: false,
            },

            isForcedOpen: {
                type: Boolean,
                default: false,
            },

            search: {
                type: Boolean,
                default: false,
            },

            isTabs: {
                type: Boolean,
                default: false,
            },

            isTabsRequired: {
                type: Boolean,
                default: false,
            },

            isDouble: {
                type: Boolean,
                default: false,
            },

            /**
             * Разрешение при котором появляется модалка вместо Dropdown
             */
            modalBreakpoint: {
                type: [String, Array],
                default: '',
                validator(value) {
                    const validValues = ['', 'xs', 'sm', 'md', 'lg', 'xl'];
                    if (Array.isArray(value)) {
                        return value.every(el => validValues.indexOf(el));
                    }
                    return validValues.indexOf(value) !== -1;
                },
            },

            modalTitle: {
                type: String,
                default: '',
            },

            modalWidth: {
                type: String,
                default: '',
            },

            /**
             * Вызывыать функцию unlockBody после закрытия модалки или нет
             */
            toUnlockBody: {
                type: Boolean,
                default: true,
            },

            applyFacets: {
                type: Boolean,
                default: false,
            },

            facet: {
                type: Array,
                default: () => [],
            },

            clearBtn: {
                type: Boolean,
                default: false,
            },

            selectType: {
                type: String,
                default: '',
            },

            isDropdownRight: {
                type: Boolean,
                default: false,
            },

            activeColor: {
                type: String,
                default: 'primary',
            },
        },

        data() {
            return {
                lazyValue: '',
                isFocused: false,
                isOpened: false,
                isDropdownTop: false,
                highlightIndex: -1,
                hoverTimer: null,
                filteredOptions: this.options,
                findedOptions: [],
                isSearchActive: false,
                activeTab: '',
                scrollboxForcedParam: 0,
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
                        'is-opened': this.isOpened && !this.isForcedClose,
                        'is-disabled': this.isDisabled,
                        'is-bordered': this.bordered,
                        'is-inline': this.inline,
                        'is-multiple': this.multiple,
                        'is-error': this.error,
                        'is-filled': this.selectedOptions.length > 0,
                        [this.selectType]: this.selectType,
                    },
                ];
            },

            wrapClasses() {
                return [
                    {
                        'is-variable-width': this.variableWidth,
                        'is-top': this.isDropdownTop,
                        'is-right': this.isDropdownRight,
                        'is-double': this.isDouble,
                        'modal-wrapper': this.modalBreakpoint === this.breakpoint
                            || (Array.isArray(this.modalBreakpoint) && this.modalBreakpoint.includes(this.breakpoint)),
                    },
                ];
            },

            optionList() {
                if (!this.hideSelected) {
                    return this.options;
                }

                return this.options.filter(opt => {
                    if (Array.isArray(this.lazyValue)) {
                        return this.lazyValue.length
                            ? !this.lazyValue.includes(opt[this.valueName])
                            : opt.value !== '';
                    }

                    return opt[this.valueName] !== this.lazyValue;
                });
            },

            optionValues() {
                return this.optionList.map(opt => opt.value);
            },

            nativeOptions() {
                return this.multiple
                    ? this.options.filter(opt => opt[this.valueName] !== '')
                    : this.options;
            },

            selectedOptions() {
                return this.options.filter(opt => {
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
                    return this.selectedOptions.map(item => item[this.displayName] ? item[this.displayName]: item.label).join(', ');
                // return this.selectedOptions[0][this.displayName]
                //     ? this.selectedOptions[0][this.displayName]
                //     : this.selectedOptions[0][this.labelName];
                }

                const reducer = (acc, opt) => {
                    const name = opt[this.displayName] ? opt[this.displayName] : opt[this.labelName];
                    return `${acc + name}, `;
                };

                return this.selectedOptions.reduce(reducer, '').slice(0, -2);
            },

            isDisabled() {
                return this.disabled || this.options.length === 0;
            },

            currentTabs() {
                if (this.isTabs) {
                    if (this.isSearchActive) {
                        return this.findedOptions.reduce((res, {group}) => {
                            if (group && !res.some(({value}) => group.value === value)) {
                                res.push(group);
                                return res;
                            }
                            return res;
                        }, []);
                    }

                    return this.options.reduce((res, {group}) => {
                        if (group && !res.some(({value}) => group.value === value)) {
                            res.push(group);
                            return res;
                        }
                        return res;
                    }, []);
                }
                return [];
            },

            isModalBreakpoint() {
                return (Array.isArray(this.modalBreakpoint) && this.modalBreakpoint.includes(this.breakpoint))
                    || this.modalBreakpoint === this.breakpoint;
            },

            wrapInlineStyle() {
                const style = {};

                if (this.isModalBreakpoint) {
                    return style;
                }

                if (this.marginDropdown) {
                    style.top = `calc(100% + ${this.marginDropdown})`;
                }

                if (this.minWidthDropdown) {
                    style.minWidth = this.minWidthDropdown;
                }

                if (this.maxWidthDropdown) {
                    style.maxWidth = this.maxWidthDropdown;
                }

                return style;
            },

            modalDropdownStyles() {
                if (this.isModalBreakpoint && this.modalWidth) {
                    return {
                        width: this.modalWidth,
                    };
                }

                return {};
            },

            transitionWrapName() {
                if (this.isModalBreakpoint) {
                    return 'overlay-appear';
                }

                return 'select-menu';
            },

            transitionOptionsName() {
                if (this.isModalBreakpoint) {
                    return 'modal';
                }

                return '';
            },
        },

        watch: {
            options() {
                this.scrollboxForcedParam += 1;
            },

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

            isOpened(val) {
                if (val) {
                    this.$emit('open');
                } else {
                    if (this.search) {
                        this.filteredOptions = this.options;
                    }
                    this.$emit('close');
                }
            },

            filteredOptions() {
                this.scrollboxForcedParam += 1;
            },

            isForcedOpen(val) {
                if (val && !this.isOpened) {
                    this.toggleMenu();
                }
            },
        },

        created() {
            if (this.value || (this.allowZero && this.value === 0)) {
                this.lazyValue = this.value;
            } else {
                this.lazyValue = this.multiple ? [] : '';
            }
            this.setInitialActiveTab();
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
                const option = this.optionList[this.highlightIndex];
                if (option.disabled) {
                    this.navigateOptions(direction);
                }
            },

            toggleMenu() {
                if (this.isDisabled) {
                    return;
                }

                if (this.isModalBreakpoint) {
                    if (this.isOpened) {
                        unlockBody();
                    } else {
                        lockBody();
                    }
                }

                if (this.$refs.select && !this.isOpened && this.variablePos) {
                    const box = this.$refs.select.getBoundingClientRect();

                    this.isDropdownTop = box.top - box.height > window.innerHeight / 2;
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
                        this.hideOptions();
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
                        this.hideOptions();
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
             * Метод, который обрабатывает событие blur
             */
            onBlur() {
                if (this.isOpened) {
                    this.hideOptions();
                }
                this.isFocused = false;
                this.$emit('blur');
            },

            onScroll() {
                this.$emit('on-scroll');
            },

            onClickOutside() {
                if (!this.isFocused && !this.openOnHover) {
                    return;
                }
                this.hideOptions();
                this.isFocused = false;
                this.$emit('blur');
            },

            onNativeChange() {
                if (this.value !== undefined) {
                    this.$nextTick(() => {
                        const newValue = this.lazyValue;
                        this.lazyValue = this.value;
                        this.$emit('input', newValue);
                    });
                } else {
                    this.$emit('change', this.lazyValue);
                }
            },

            /**
             * Открытие по наведению на селект для десктопов
             */
            onMouseEnter() {
                if (this.openOnHover && (this.$deviceIs.laptop || this.$deviceIs.desktop)) {
                    if (this.hoverTimer) {
                        clearTimeout(this.hoverTimer);
                    }
                    if (!this.isOpened) {
                        this.toggleMenu();
                    }
                }
            },

            onMouseLeave() {
                if (this.openOnHover && (this.$deviceIs.laptop || this.$deviceIs.desktop)) {
                    if (this.isOpened && this.isForcedClose) {
                        this.toggleMenu();
                        return;
                    }

                    this.hoverTimer = setTimeout(() => {
                        if (this.isOpened) {
                            this.toggleMenu();
                        }
                    }, 100);
                }
            },

            /**
             * Обработчик поиска
             */
            onSearchInput(value, filteredItems) {
                this.isSearchActive = Boolean(value);
                this.findedOptions = filteredItems;
                this.filteredOptions = filteredItems;
                this.activeTab = '';
            },

            /**
             * Обработчик переключение табов
             */
            onTabsChange(value) {
                if (!value.length) {
                    this.filteredOptions = this.isSearchActive ? this.findedOptions : this.options;
                    this.activeTab = '';
                    return;
                }
                this.activeTab = value;

                if (this.isSearchActive) {
                    this.filteredOptions = this.findedOptions.filter(({group}) => group && group.value === this.activeTab);
                } else {
                    this.filteredOptions = this.options.filter(({group}) => group && group.value === this.activeTab);
                }
            },

            /**
             * Устанавливает начальный активный таб
             */
            setInitialActiveTab() {
                if (this.isTabsRequired && this.options.length) {
                    let tabValue;
                    if (this.value) {
                        tabValue = this.options.find(option => option.value === this.value)?.group?.value;
                    } else {
                        tabValue = this.options[0]?.group?.value;
                    }
                    this.onTabsChange(tabValue);
                }
            },

            hideOptions() {
                if (this.isModalBreakpoint && this.isOpened && this.toUnlockBody) {
                    unlockBody();
                }
                this.isOpened = false;
            },

            checkIsOptionEnable(val) {
                if (!this.applyFacets) {
                    return true;
                }

                const item = this.facet.find(item => item.value === val.value || item === Number(val.value) || item === val.value);
                if (item === 0) {
                    return Boolean(item+1);
                }
                return Boolean(item);
            },
        },
    };
</script>

<style lang="scss">
    .v-select {
        position: relative;
        display: inline-block;
        cursor: pointer;
        user-select: none;

        /* Colors */

        &--default {
            color: $base-800;

            .v-select__placeholder-add {
                color: $blue;
            }

            &:not(.is-bordered) {
                &.is-opened {
                    color: $blue;

                    .v-select__arrow-box {
                        color: $blue;
                    }
                }

                @include hover {
                    color: $blue;

                    .v-select__arrow-box {
                        color: $blue;
                    }
                }

                &:not(.is-inline) {
                    color: $blue;

                    @include hover {
                        color: $primary-500;

                        &:not(.is-opened) {
                            .v-select__arrow-box {
                                color: $primary-500;
                            }
                        }
                    }
                }
            }

            &.is-bordered {
                @include hover {
                    &:not(.is-opened) {
                        .v-select__field {
                            border-color: $blue;
                            background: $base-0;
                            color: $blue;
                        }

                        .v-select__arrow-box {
                            color: $blue;
                        }
                    }
                }

                &.is-opened {
                    .v-select__field {
                        border-color: $base-0;
                        background-color: $base-0;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
                    }
                }

                &.is-disabled {
                    opacity: .44;

                    .v-select__field {
                        border-color: $base-50;
                        background-color: $base-50;
                        color: $base-800;
                    }

                    .v-select__arrow {
                        color: $base-800;
                    }
                }

                .v-select__field {
                    border-color: $base-50;
                    background-color: $base-50;
                }

                .v-select__label {
                    color: $base-400;
                }

                .v-select__groupLabel {
                    color: $blue;
                }

                .v-select__clear-box {
                    color: $base-800;

                    @include hover {
                        color: $blue;
                    }
                }
            }

            &.is-error {
                color: $error;
            }

            & .v-select-option {
                &._city {
                    text-transform: uppercase;
                    color: $base-400;
                    opacity: 1;
                    cursor: default;
                    pointer-events: none;
                }
            }
        }

        &--gray {
            color: $base-300;

            .v-select__placeholder-add {
                color: $blue;
            }

            &.is-bordered {
                .v-select__arrow-box {
                    color: $base-800;
                }

                @include hover {
                    &:not(.is-opened) {
                        .v-select__field {
                            border-color: $blue;
                            background: $base-0;
                            color: $blue;
                        }

                        .v-select__arrow-box {
                            color: $blue;
                        }
                    }
                }

                &.is-opened {
                    .v-select__field {
                        border-color: $base-0;
                        background-color: $base-0;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
                    }
                }

                &.is-disabled {
                    opacity: .44;

                    .v-select__field {
                        border-color: $base-50;
                        background-color: $base-50;
                        color: $base-800;
                    }

                    .v-select__arrow {
                        color: $base-800;
                    }
                }

                .v-select__field {
                    border-color: $base-50;
                    background-color: $base-50;
                }

                .v-select__label {
                    color: $base-400;
                }

                .v-select__groupLabel {
                    color: $blue;
                }

                .v-select__clear-box {
                    color: $base-800;

                    @include hover {
                        color: $blue;
                    }
                }
            }

            &.is-error {
                color: $error;
            }

            &.is-filled {
                color: $base-800;
            }
        }

        /* End Colors */

        /* Sizes */

        &--large {
            .v-select__value {
                padding-right: 2.4rem;
                text-transform: uppercase;
                font-size: 3.2rem;
                font-weight: 600;
                line-height: 3.8rem;
            }

            .v-select__arrow-box {
                width: 1.6rem;
                height: 1.6rem;
            }

            .v-select__arrow {
                width: 1.6rem;
                height: 1.6rem;
            }

            .v-select__clear {
                width: 1.6rem;
                height: 1.6rem;
            }

            .v-select__wrapper {
                top: calc(100% + 10px);
                left: 0;
                border-radius: .4rem;
                font-size: 1.4rem;
            }

            .v-select-option {
                height: 4.4rem;
                padding: 0 1.6rem;
                border-radius: .4rem;
                font-size: 1.2rem;
                line-height: 1.2rem;
            }
        }

        &--big {
            .v-select__value {
                font-size: 3.2rem;
                font-weight: 600;
                line-height: 3.8rem;

                @include respond-to(xs) {
                    font-size: 2rem;
                    line-height: 2.4rem;
                }

                &.is-arrow {
                    padding-right: 2.8rem;
                }
            }

            .v-select__arrow-box {
                width: 2.5rem;
                height: 2.5rem;
            }

            .v-select__arrow {
                width: 2rem;
                height: 2rem;
            }

            .v-select__clear-box {
                padding: .5rem;
            }

            .v-select__clear {
                width: 1.2rem;
                height: 1.2rem;
            }

            .v-select__wrapper {
                min-width: 24.6rem;
                border-radius: .4rem;
            }

            &:not(.is-bordered) {
                //
            }

            &.is-bordered {
                .v-select__field {
                    height: 4.4rem;
                    padding: 0 1.6rem;
                }

                .v-select__value {
                    padding-bottom: 1.2rem;
                }

                .v-select__groupLabel {
                    padding-bottom: .6rem;
                    font-size: 1.4rem;
                    line-height: 1.3;
                }

                .v-select__group {
                    &:not(:last-child) {
                        margin-bottom: 1.7rem;
                    }
                }

                .v-select__label {
                    font-size: 1.2rem;
                    font-weight: 500;
                    line-height: 1.6rem;
                }
            }

            &.rooms {
                .v-select__wrapper {
                    min-width: 35.4rem;
                }
            }
        }

        &--medium {
            .v-select__value {
                font-size: 1.2rem;
                font-weight: 600;
                line-height: 1.6rem;

                &.is-arrow {
                    padding-right: 2.8rem;
                }
            }

            .v-select__arrow-box {
                width: 1.2rem;
                height: 1.2rem;
            }

            .v-select__arrow {
                width: 1.2rem;
                height: 1.2rem;
            }

            .v-select__clear-box {
                padding: .5rem;
            }

            .v-select__clear {
                width: 1.2rem;
                height: 1.2rem;
            }

            .v-select__wrapper {
                min-width: 24.6rem;
                border-radius: .4rem;
            }

            &:not(.is-bordered) {
                //
            }

            &.is-bordered {
                .v-select__field {
                    height: 4.4rem;
                    padding: 0 1.6rem;
                }

                .v-select__value {
                    padding-bottom: 1.2rem;
                }

                .v-select__groupLabel {
                    padding-bottom: .6rem;
                    font-size: 1.4rem;
                    line-height: 1.3;
                }

                .v-select__group {
                    &:not(:last-child) {
                        margin-bottom: 1.7rem;
                    }
                }

                .v-select__label {
                    font-size: 1.2rem;
                    font-weight: 500;
                    line-height: 1.6rem;
                }
            }

            &.rooms {
                .v-select__wrapper {
                    min-width: 35.4rem;
                }
            }
        }

        &--small {
            //
        }

        /* End Sizes */

        /* Modificators */
        &.rooms {
            .v-select__options {
                display: flex;
                padding: 2rem;

                & > * {
                    &:not(:last-child) {
                        margin-right: .8rem;
                    }
                }
            }
        }

        &.has-label {
            padding-top: 2.6rem;

            &:not(.is-active):not(.has-placeholder) {
                .v-select__value {
                    opacity: 0;
                }
            }
        }

        //&.is-active,
        //&.has-placeholder {
        //    .v-select__label {
        //        opacity: 0;
        //    }
        //}

        //&.has-label {
        //    &:not(.is-active):not(.has-placeholder) {
        //        .v-select__value {
        //            opacity: 0;
        //        }
        //    }
        //}

        &.is-opened {
            .v-select__arrow-box {
                transform: translateY(-50%) rotate(180deg);
            }
        }

        &.is-disabled {
            pointer-events: none;

            .v-select__field {
                pointer-events: none;
            }
        }

        &.is-bordered {
            &.is-opened {
                .v-select__field {
                    z-index: 6;
                }

                .v-select__wrapper {
                    z-index: 5;
                }

                .v-select__native {
                    z-index: 6;
                }
            }

            .v-select__field {
                z-index: 4;
                border-radius: .4rem;
                border-style: solid;
                border-width: 1px;
            }

            .v-select__wrapper {
                &:not(.modal-wrapper) {
                    top: calc(100% + .8rem);
                    left: 0;
                    z-index: 3;
                    transform: translateY(0);
                }

                &.is-top {
                    top: auto;
                }

                &.select-menu-enter,
                &.select-menu-leave-active {
                    transform: translateY(16px);
                }

                &.is-right {
                    right: 0;
                    left: auto;
                }
            }

            .v-select__native {
                z-index: 4;
            }
        }

        /* End Modificators */

        &__field {
            outline: none;
            transition: border-color $default-color-transition, background-color $default-color-transition;
            cursor: pointer;
        }

        &__field-content {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100%;
        }

        &__value {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: color $default-color-transition;
        }

        &__label {
            position: absolute;
            top: 0;
            left: 0;
            padding-bottom: 1.2rem;
            white-space: nowrap;
            font-family: $accent-font-family;
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1.6rem;
            transition: color .4s;
        }

        &__icon-box {
            position: absolute;
            top: 50%;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            transform: translateY(-50%);
            pointer-events: none;
        }

        &__arrow-box,
        &__clear-box {
            position: absolute;
            top: 50%;
            right: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            transform: translateY(-50%) rotate(0);
            transition: transform .2s;
        }

        &__arrow-box {
            pointer-events: none;
        }

        &__clear-box {
            right: 1rem;
        }

        &__arrow,
        &__clear {
            z-index: 1;
            line-height: 0;
            fill: currentColor;
            transform: translateZ(0);
            transition: color $default-color-transition;
        }

        &__wrapper {
            position: absolute;
            top: calc(100% + 16px);
            z-index: 5;
            width: 100%;
            background-color: $base-0;
            font-family: $base-font;
            opacity: 1;
            transform: translateY(0);
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
            transition: border-color $default-color-transition, background-color $default-color-transition;

            &-scrollbox {
                max-height: 25rem;
            }

            &.is-variable-width {
                width: auto;
            }

            &.is-top {
                top: auto;
                bottom: 0;
            }

            &.is-double {
                min-width: 51.2rem;

                & .v-scrollbox__content {
                    position: relative;

                    &:after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 50%;
                        display: block;
                        width: 1px;
                        height: 100%;
                        background-color: $base-100;
                        transform: translateX(-50%);
                    }
                }

                & .v-select__options {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    align-content: space-between;
                    column-gap: 1.6rem;
                }

                & .v-select-option {
                    max-width: 24.6rem;
                }

                & .v-select__wrapper-scrollbox {
                    max-height: 25.6rem;
                }
            }

            .c-scrollbar._vertical {
                top: 2.4rem;
                bottom: 2.4rem;
            }

            &.select-menu-enter-active {
                transition: opacity .3s ease-in-out, transform .3s ease-in-out;
            }

            &.select-menu-leave-active {
                transition: opacity .15s ease-in-out, transform .15s ease-in-out;
            }

            &.select-menu-enter,
            &.select-menu-leave-active {
                opacity: 0;
                transform: translateY(16px);
            }
        }

        &__native {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            display: none;
            width: 100%;
            height: 100%;
            opacity: 0;

            @include respond-to(sm) {
                // display: block;
            }
        }

        &__group {
            position: relative;
        }

        &__groupLabel {
            transition: color $default-color-transition;
        }

        &__search {
            padding: 1.6rem;
            border-bottom: 1px solid $base-100;
        }

        &__not-found {
            display: block;
            padding: 1.6rem 2.4rem 2.4rem;
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.6rem;
            color: $base-300;
        }

        &__tabs {
            padding: 1.6rem;
            border-bottom: 1px solid $base-100;
        }

        &__error-text {
            color: currentColor;
        }

        &__error-content {
            color: $error;
        }

        &__error {
            position: absolute;
            bottom: -2rem;
            left: 0;
            z-index: 3;
        }

        &__value-add {
            margin-left: -3px;
        }

        .modal-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            /* stylelint-disable */
            z-index: 150 !important;
            /* stylelint-enable */
            width: 100vw;
            height: 100%;
            border-radius: unset;
            background: rgba(15, 17, 17, .32);

            &.overlay-appear-enter-active {
                transition: all .4s;
            }

            &.overlay-appear-leave-active {
                opacity: 0;
                transition: all .2s;
            }

            &.overlay-appear-enter {
                opacity: 0;
            }

            .v-select__dropdown {
                position: absolute;
                bottom: 0;
                left: 50%;
                display: flex;
                flex-direction: column;
                width: 100%;
                max-height: calc(100% - 10rem);
                border-radius: .8rem .8rem 0 0;
                background-color: $base-0;
                transform: translateX(-50%);
            }

            .v-select__options {
                padding: 1.6rem;
            }

            .v-select__modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 3.2rem;
                padding: 3.4rem 1.6rem 1.6rem;
            }

            .v-select__modal-title {
                text-transform: uppercase;
                font-size: 2rem;
                font-weight: 700;
                line-height: 2.8rem;
                letter-spacing: -.04em;
                color: $base-800;

                @include respond-to(xs) {
                    font-size: 1.2rem;
                    font-weight: 600;
                    line-height: 1.2rem;
                }
            }

            .v-select__wrapper-scrollbox {
                flex: 1;
                max-height: unset;
            }

            .v-select__cross-icon {
                width: .8rem;
                height: .8rem;
                color: $base-600;
            }
        }
    }
</style>
