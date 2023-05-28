<template>
    <div
        v-clickoutside="onClickOutside"
        :class="[$style.VInputSelect, classList]"
    >
        <VInput
            v-bind="inputProps"
            ref="input"
            v-model="inputValue"
            :class="$style.input"
            type="text"
            @focus="onFocus"
            @blur="onBlur"
        />
        <transition name="dropdown">
            <div
                v-if="isFocused && specs.length"
                :class="$style.dropdown"
                @mousedown.stop.prevent
            >
                <VScrollBox
                    :class="$style.scrollbox"
                    resizable
                >
                    <DropdownOption
                        v-for="(option, index) in specs"
                        :key="option.value"
                        :option="option"
                        :value="inputValue"
                        :size="size"
                        :color="color"
                        :is-highlighted="highlightIndex === index"
                        @mouseenter="highlightIndex = index"
                        @mouseleave="highlightIndex = -1 "
                        @click="onSelectDropdownOption"
                    />
                </VScrollBox>
            </div>
        </transition>
    </div>
</template>

<script>
/**
 * Как и <a href="#VInput" style="color: #2963eb">VInput</a> служит для ввода данных,<br>
 * но также предоставляет возможность выбрать предустановленные данные из селекта<br>
 * Использует VInput, DropdownOption и VScrollbox<br><br>
 * Пример использования - любой список с ограниченным набором выходных данных, к примеру адреса
 *
 * @version 1.0.1
 * @displayName VInputSelect
 */
export default {
    name: 'VInputSelect',

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
         * Лейбл инпута
         */
        label: {
            type: String,
            default: '',
        },

        /**
         * Текущее введёное значение
         */
        value: {
            type: String,
            default: '',
        },

        /**
         * Позволяет отображать лейбл после ввода
         */
        keepLabel: {
            type: Boolean,
            default: true,
        },

        /**
         * Сообщение пользователю, может использоваться для валидации
         */
        msg: {
            type: String,
            default: '',
        },

        /**
         * Модификатор вида с бордером
         */
        border: {
            type: Boolean,
            default: true,
        },

        /**
         * Модификатор поля ввода с невалидным значением
         */
        error: {
            type: Boolean,
            default: false,
        },

        /**
         * Даёт возможность отключить autocomplete при вводе
         */
        autocomplete: {
            type: Boolean,
            default: true,
        },

        /**
         * Это свойство отключает взаимодействие
         */
        disabled: {
            type: Boolean,
            default: false,
        },

        /**
         * Массив значений в дропдауне
         * для каждого значения необходимы поля label и value
         */
        specs: {
            type: Array,
            default: () => [],
            validator: val => val.every(item => typeof item.label !== 'undefined' && typeof item.value !== 'undefined'),
        },
    },

    data() {
        return {
            inputValue: this.value,
            isFocused: false,
            highlightIndex: -1,
        };
    },

    computed: {
        classList() {
            return {
                [this.$style[`_${this.color}`]]: this.size,
                [this.$style[`_${this.size}`]]: this.size,
                [this.$style._active]: this.value || this.isFocused,
                [this.$style._disabled]: this.disabled,
            };
        },

        /**
         * пропы, которые будут прокинуты в VInput
         */
        inputProps() {
            const props = ['size', 'color', 'label', 'value', 'keepLabel', 'msg', 'border', 'error', 'autocomplete', 'disabled'];

            return Object.keys(this.$props)
                .filter(val => props.includes(val))
                .reduce((acc, val) => (acc[val] = this.$props[val], acc), {});
        },
    },

    watch: {
        inputValue(val) {
            /**
             * передается при изменении значения
             * @event change
             */
            this.$emit('input', val);
        },
    },

    methods: {
        /**
         * Метод, который обрабатывает выбор значения из дропдауна
         * @public
         */
        onSelectDropdownOption(e) {
            this.inputValue = e?.value ?? '';
            this.highlightIndex = -1;
            const nativeInput = this.$refs.input?.$el?.querySelector('input');

            if (nativeInput) {
                nativeInput.setSelectionRange(nativeInput.value.length, nativeInput.value.length);
            }

            this.isFocused = false;
            /**
             * передается если значение было выбрано из дропдауна
             * @event change
             */
            this.$emit('change', this.inputValue);
        },

        /**
         * Метод, который обрабатывает клик снаружи и убирает фокусировку
         * @public
         */
        async onClickOutside(e) {
            if (!this.isFocused) {
                return;
            }

            this.isFocused = false;
        },

        /**
         * Метод, который обрабатывает событие focus на инпуте
         * @public
         */
        onFocus() {
            this.isFocused = true;
            /**
             * Передаёт родителю, что компонент находится в focus
             * @event focus
             */
            this.$emit('focus');
        },

        /**
         * Метод, который обрабатывает событие blur на инпуте
         * @public
         */
        onBlur() {
            /**
             * Передаёт родителю, что компонент больше не находится в focus
             * @event blur
             */
            this.$emit('blur');
        },
    },
};
</script>

<style lang="scss" module>
    $white-color: $white;
    $grey-light-color: $grey-middle;
    $grey-color: $grey;
    $black-color: $base-600;
    $active-color: $violet;
    $alert-color: $error;
    $success-color: $accept;

    .VInputSelect {
        position: relative;
        width: 100%;

        &._base {
            .dropdown {
                background: $white-color;
                color: $black-color;
            }

            &:after {
                background-color: $grey-color;
            }
        }

        &._dark {
            .dropdown {
                background: $black-color;
                color: $white-color;
            }

            &:after {
                background-color: $grey-color;
            }
        }
    }

    .dropdown {
        position: absolute;
        top: calc(100% + .2rem);
        left: 0;
        z-index: 10;
        display: block;
        width: 100%;
        padding: 1.2rem 0;
        border-radius: .4rem;
        transform: translate3d(0, 0, 0);
        transition: opacity .2s ease, transform .2s ease;
        box-shadow: 8px 8px 30px rgb(0 0 0 / 12%);

        .scrollbox {
            max-height: 18rem;
        }

        @include respond-to(tablet) {
            z-index: -1;
            display: none;
            pointer-events: auto;
        }
    }
</style>
