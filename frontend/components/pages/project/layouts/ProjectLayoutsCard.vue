<template>
    <div :class="[$style.ProjectLayoutsCard, {[$style._active]: active}]"
         @click="$emit('click')">
        <div :class="$style.image"
             :style="{backgroundImage: `url(${layout.plan_full})`}"></div>
        <div :class="$style.area">
            <p :class="$style.label">
                Площадь
            </p>
            <p :class="$style.value">
                <span v-if="layout.min_area">{{ layout.min_area }}</span>
                <span v-if="layout.min_area && layout.max_area && layout.min_area !== layout.max_area"> - </span>
                <span v-if="layout.max_area && layout.min_area !== layout.max_area">{{ layout.max_area }}</span>
                м<sup>2</sup>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProjectLayoutsCard',

        props: {
            layout: {
                type: Object,
                default: () => ({}),
            },

            active: {
                type: Boolean,
                default: false,
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectLayoutsCard {
        height: 20rem;
        padding: 1.6rem;
        border-radius: 1rem;
        border: 2px solid $base-50;
        background-color: $base-50;
        transition: all $default-color-transition;
        cursor: pointer;

        @include hover {
            border: 2px solid $blue;
            background-color: $base-0;

            .image,
            .area {
                opacity: .4;
            }
        }

        &._active {
            border: 1px solid $base-100;
            background-color: $base-0;

            .image {
                opacity: .4;
            }

            .value {
                color: $blue;
            }
        }
    }

    .image {
        width: 12.8rem;
        height: 12.2rem;
        margin: 0 auto;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        transition: opacity $default-color-transition;
    }

    .area {
        margin-top: 1.2rem;
        text-align: center;
        transition: opacity $default-color-transition;
    }

    .label {
        margin-bottom: .2rem;
        font-size: 1rem;
        line-height: 1.6rem;
        color: $base-300;
    }

    .value {
        font-size: 1.2rem;
        line-height: 1.6rem;
        color: $base-600;
        transition: color $default-color-transition;
    }
</style>
