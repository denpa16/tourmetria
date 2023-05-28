<template>
    <div :class="$style.ProjectInfraMapFilterTime">
        <div :class="[$style.btn, 'p5']"
             @click="handleBtnClick">
            <VCheckbox :false-value="false"
                       :value="isChecked"
                       :class="$style.checkbox"
                       :disabled="disabled"
                       readonly
            >
                Радиус доступности
            </VCheckbox>
            <IconWalk :class="$style.btnIcon" />
        </div>
        <ul :class="[$style.options, {[$style._active]: isChecked}]">
            <li
                v-for="item in timeSpecs"
                :key="item"
                :class="[$style.optionItem, {
                    [$style._active]: item <= filterValues[1],
                    [$style._current]: item === filterValues[1],
                }]"
                @click="handleTimeOptionClick(item)"
            >
                <span :class="[$style.optionLabel, 'p6']">
                    {{ item }} мин
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    import IconWalk from '~/components/icons/IconWalk';
    export default {
        name: 'ProjectInfraMapFilterTime',
        components: {IconWalk},
        props: {
            timeSpecs: {
                type: Array,
                default: () => []
            },

            filterValues: {
                type: Array,
                default: () => []
            },

            disabled: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            isChecked() {
                return Boolean(this.filterValues.length);
            },
        },

        methods: {
            handleBtnClick() {
                if (this.disabled) {
                    return;
                }

                if (this.isChecked) {
                    this.updateFilterValues();
                    return;
                }
                this.updateFilterValues(this.timeSpecs[0]);
            },

            handleTimeOptionClick(value) {
                this.updateFilterValues(value);
            },

            updateFilterValues(value) {
                this.$emit('change', value ? [0, value] : []);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraMapFilterTime {
        display: flex;
    }

    .btn {
        display: flex;
        align-items: center;
        max-height: 4.4rem;
        padding: 1.6rem;
        border-radius: .4rem;
        background-color: $base-0;
        cursor: pointer;
        user-select: none;
    }

    .checkbox {
        & :global(.v-checkbox__input) {
            background-color: inherit;
        }
    }

    .btnIcon {
        width: 1.4rem;
        height: 1.4rem;
        margin-left: 1rem;
        color: $base-300;
    }

    .options {
        visibility: hidden;
        overflow: hidden;
        display: flex;
        margin-left: .8rem;
        border-radius: .4rem;
        opacity: 0;
        transform: translateX(-20px);
        transition: all $default-transition;

        &._active {
            visibility: visible;
            opacity: 1;
            transform: translateX(0);
        }
    }

    .optionItem {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.4rem;
        padding: 0 1.2rem;
        border-bottom: .3rem solid $base-0;
        background-color: $base-0;
        white-space: nowrap;
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            color: $blue;
        }

        &._active {
            border-bottom: .3rem solid $blue;
            background-color: $base-50;
        }

        &._current {
            color: $blue;
        }
    }

    .optionLabel {
        display: block;
        margin-top: .3rem;
    }
</style>
