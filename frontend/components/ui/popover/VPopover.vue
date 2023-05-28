<template>
    <transition
        name="overlay-appear"
        appear
        @after-enter="isContentVisible = true"
    >
        <div :class="$style.overlay">
            <div
                v-clickoutside="onClick"
                :class="[$style.content, classList]"
                :style="{
                    width: width,
                    height: height,
                    background: background,
                }"
            >
                <div :class="$style.close">
                    <VButton
                        size="small"
                        @click="onClick"
                    >
                        <svg-icon
                            :class="$style.closeIcon"
                            name="close"
                        />
                    </VButton>
                </div>

                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
/**
 * @version 1.0.0
 * @displayName VPopover
 */
export default {
    name: 'VPopover',

    props: {
        /**
         * Определяет направление анимации элемента
         */
        direction: {
            type: String,
            default: 'bottom',
            validator: value => ['top', 'right', 'bottom', 'left'].includes(value),
        },

        /**
         * Определяет ширину элемента
         */
        width: {
            type: String,
            default: '100%',
        },

        /**
         * Определяет высоту элемента
         */
        height: {
            type: String,
            default: '100%',
        },

        /**
         * Определяет основной цвет элемента
         */
        background: {
            type: String,
            default: '',
        },

        /**
         * Модификатор вида элемента с острыми углами
         */
        sharp: Boolean,

        /**
         * Модификатор вида элемента со скруглением
         */
        round: Boolean,

        /**
         * Модификатор вида элемента с тенью
         */
        shadow: Boolean,
    },

    data() {
        return {
            isContentVisible: false,
        };
    },

    computed: {
        classList() {
            return [{
                [this.$style[`_${this.direction}`]]: this.direction,
                [this.$style._visible]: this.isContentVisible,
                [this.$style._sharp]: this.sharp,
                [this.$style._round]: this.round,
                [this.$style._shadow]: this.shadow,
            }];
        },
    },

    methods: {
        onClick() {
            this.isContentVisible = false;
            setTimeout(() => {
                this.$emit('close');
            }, 300);
        },
    },
};
</script>


<style lang="scss" module>
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 30%);
        transition: .5s all ease;
    }

    .content {
        position: relative;
        transition: transform .3s linear;

        &._top {
            transform: translate3d(0, -100%, 0);
        }

        &._right {
            transform: translate3d(100%, 0, 0);
        }

        &._bottom {
            transform: translate3d(0, 100%, 0);
        }

        &._left {
            transform: translate3d(-100%, 0, 0);
        }

        &._visible {
            transform: translate3d(0, 0, 0);
        }

        &._sharp {
            border-radius: 0;
        }

        &._round {
            border-radius: 8px;
        }

        &._shadow {
            box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
        }
    }

    .close {
        position: absolute;
        top: 16px;
        right: 16px;
        display: inline-block;
    }

    .closeIcon {
        width: 24px;
        height: 24px;
    }
</style>
