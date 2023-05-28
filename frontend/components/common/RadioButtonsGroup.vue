<template>
    <div :class="[$style.RadioButtonsGroup, classes]">
        <button v-for="btn in btnList"
                :key="btn.key"
                :class="[$style.btn, btnClasses, {[$style._active]: btn?.key === currentValue}, 'p6']"
                :value="btn.name"
                type="button"
                @click="btn.handler || handleClick(btn)">
            {{ btn.name }}
        </button>
    </div>
</template>

<script>
    export default {
        name: 'RadioButtonsGroup',
        props: {
            btnList: {
                type: Array,
                default: () => [],
                required: '',
            },

            initialActiveBtn: {
                type: String,
                default: '',
            },

            value: {
                type: [String, Number],
                default: '',
            },

            shadow: {
                type: Boolean,
                default: false,
            },

            responsive: {
                type: Boolean,
                default: false,
            },

            color: {
                type: String,
                default: 'light',
                validator(value) {
                    return ['light', 'white'].indexOf(value) !== -1;
                },
            }
        },

        data() {
            return {
                activeBtn: this.initialActiveBtn || this.btnList[0]?.key || ''
            };
        },

        computed: {
            currentValue() {
                return this.value || this.activeBtn;
            },

            classes() {
                return {
                    [this.$style.isShadow]: this.shadow || '',
                    [this.$style.isResponsive]: this.responsive || '',
                    [this.$style[this.color]]: this.color,
                };
            },

            btnClasses() {
                return {
                    [this.$style[this.color]]: this.color,
                };
            },
        },

        methods: {
            handleClick(btn) {
                if (btn.eventValues?.length) {
                    const values = btn.eventValues.map(valueName => btn[valueName]);
                    this.$emit(btn.eventName || 'change', ...values);
                } else {
                    this.$emit(btn.eventName || 'change', btn.key);
                }

                this.activeBtn = btn.key;
            }
        }
    };
</script>

<style lang="scss" module>
    .RadioButtonsGroup {
        display: inline-flex;
        padding: .2rem;
        border-radius: .6rem;

        &.light {
            background: $base-50;
        }

        &.white {
            background: $base-0;
        }

        &.isShadow {
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        }

        &.isResponsive {
            display: flex;
            width: 100%;

            & .btn {
                flex: 1;
            }
        }
    }

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: .4rem;
        padding: 1.2rem  2.4rem 1rem;
        border-radius: .4rem;
        border: .1rem solid transparent;
        background-color: transparent;
        white-space: nowrap;
        transition: all $default-transition;
        cursor: pointer;
        user-select: none;

        &:last-child {
            margin-right: 0;
        }

        &.light {
            &._active {
                border: .1rem solid $base-100;
                background-color: $base-0;
                color: $blue;
            }

            @include hover {
                color: $blue;
            }
        }

        &.white {
            &._active {
                border: .1rem solid $blue;
                background-color: $blue;
                color: $base-0;
            }

            @include hover {
                color: $blue;

                &._active {
                    color: $base-0;
                }
            }
        }
    }
</style>
