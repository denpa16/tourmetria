<template>
    <div class="v-spinner">
        <svg class="v-spinner__body"
             :class="classes"
             viewBox="0 0 50 50">
            <circle class="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke-width="5" />
        </svg>
    </div>
</template>

<script>
    export default {
        name: 'VSpinner',

        props: {
            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'medium', 'small', 'xsmall'].indexOf(value) !== -1;
                },
            },

            /**
             * Определяет классы, которые будут модифицировать цвет
             */
            color: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'light', 'dark', 'transparent', 'white', 'text', 'white-additional', 'custom'].indexOf(value) !== -1;
                },
            },
        },

        computed: {
            classes() {
                return [
                    `v-spinner--${this.color}`,
                    `v-spinner--${this.size}`,
                ];
            },
        }
    };
</script>

<style lang="scss">
    .v-spinner {
        display: inline;

        // Цвета

        &--primary {
            stroke: $blue;
        }

        &--light {
            stroke: $base-50;
        }

        &--dark {
            stroke: $base-800;
        }

        &--transparent {
            stroke: $white-16;
        }

        &--white {
            stroke: $base-0;
        }

        // Размеры

        &--large {
            width: 48px;
            height: 48px;
        }

        &--medium {
            width: 24px;
            height: 24px;
        }

        &--small {
            width: 16px;
            height: 16px;
        }

        &--xsmall {
            width: 12px;
            height: 12px;
        }

        &__body {
            animation: rotate 2s linear infinite;

            & .path {
                stroke-linecap: round;
                animation: dash 1.5s ease-in-out infinite;
            }
        }

        @keyframes rotate {
            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes dash {
            0% {
                stroke-dasharray: 1, 150;
                stroke-dashoffset: 0;
            }

            50% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -35;
            }

            100% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -124;
            }
        }
    }
</style>
