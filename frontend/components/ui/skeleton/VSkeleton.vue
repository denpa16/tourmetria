<template>
    <transition
        name="fade"
        mode="out-in"
    >
        <div
            v-if="isLoading"
            :class="[$style.VSkeleton, classList]"
            :style="styleList.main"
        >
            <div
                :class="$style.highlight"
                :style="styleList.highlight"
            >
            </div>
        </div>

        <template v-else>
            <!-- @slot Компонент который нужно заменить "костью" -->
            <slot></slot>
        </template>
    </transition>
</template>

<script>
/**
 * Компонент обертка для отображения состояния загрузки контента<br>
 * Область применения: Динамические текстовые данные, карточки.
 *
 * @version 1.0.1
 * @displayName VSkeleton
 */
export default {
    name: 'VSkeleton',

    props: {
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
            default: '40px',
        },

        /**
         * Определяет основной цвет элемента
         */
        background: {
            type: String,
            default: '#aeaeae',
        },

        /**
         * Определяет цвет подсветки элемента
         */
        highlight: {
            type: String,
            default: '#d6dde9',
        },

        /**
         * Определяет состояние загрузки для обертки
         */
        isLoading: Boolean,

        /**
         * Модификатор вида элемента с острыми углами
         */
        sharp: Boolean,

        /**
         * Модификатор вида элемента со скруглением 100%
         */
        round: Boolean,
    },

    computed: {
        classList() {
            return [{
                [this.$style._sharp]: this.sharp,
                [this.$style._round]: this.round,
            }];
        },

        styleList() {
            return {
                main: {
                    width: this.width,
                    height: this.height,
                    background: this.background,
                },

                highlight: {
                    background: this.highlight,
                },
            };
        },
    },
};
</script>

<style lang="scss" module>
    .VSkeleton {
        overflow: hidden;
        border-radius: .8rem;

        .highlight {
            content: " ";
            display: block;
            width: 100%;
            height: 100%;
            animation: pulse 1s cubic-bezier(.4, 0, .6, 1) infinite;

            @keyframes pulse {
                0%,
                100% {
                    opacity: 1;
                }

                50% {
                    opacity: 0;
                }
            }
        }

        &._sharp {
            border-radius: 0;
        }

        &._round {
            border-radius: 100%;
        }
    }
</style>
