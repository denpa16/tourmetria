<template>
    <nuxt-link v-if="flat.count"
               :class="[$style.ProjectGenplanFlatItem, 'p2']"
               :to="flat.link"
               target="_blank">
        <span :class="[$style.container, $style._name]">
            <span :class="$style.name">
                {{ formattedName }}
            </span>
            <span :class="[$style.count, 'c-base300']">
                {{ formattedCount }}
            </span>
        </span>

        <span :class="[$style.container, $style._price, 'c-base300']">
            <span :class="$style.price">{{ formattedPrice }}</span>
            <IconArrowLeft :class="$style.icon" />
        </span>
    </nuxt-link>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import {splitMillionsToShort} from '~/assets/js/utils/numberUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    export default {
        name: 'ProjectGenplanFlatItem',

        components: {
            IconArrowLeft
        },

        mixins: [breakpointCheck],

        props: {
            flat: {
                type: Object,
                default: () => ({}),
            }
        },

        computed: {
            formattedPrice() {
                return `от ${splitMillionsToShort(this.flat.min_price)} млн ₽`;
            },

            formattedName() {
                return 'sm,xs'.includes(this.breakpoint)
                    ? this.flat.roomNumber
                        ? `${this.flat.roomNumber}к`
                        : 'C'
                    : this.flat.name;
            },

            formattedCount() {
                return 'sm,xs'.includes(this.breakpoint)
                    ? `${this.flat.count} квартир`
                    : this.flat.count;
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanFlatItem {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        transition: all $default-color-transition;
        cursor: pointer;

        @include respond-to(sm) {
            padding: 1.4rem 1.6rem 1.2rem;
            border-radius: .4rem;
            border: .1rem solid $base-50;
            background-color: $base-50;
        }

        @include hover {
            @include respond-to(sm) {
                border: .1rem solid $blue;
                background-color: $base-0;
            }
        }

        &:hover .name,
        &:hover .count {
            color: $blue;
        }

        &:hover .price {
            color: $base-800;

            @include respond-to(sm) {
                color: $blue;
            }
        }

        &:before {
            content: "";
            position: absolute;
            bottom: .4rem;
            left: 0;
            display: block;
            width: 100%;
            border-bottom: .1rem dashed $base-100;

            @include respond-to(sm) {
                display: none;
            }
        }
    }

    .container {
        z-index: 1;
        display: block;
        background-color: $base-0;
        transition: all $default-color-transition;

        @include respond-to(sm) {
            background-color: inherit;
        }

        &._name {
            margin-right: auto;
            padding-right: .4rem;
        }

        &._price {
            padding-left: .4rem;
        }
    }

    .name {
        transition: all $default-color-transition;

        @include respond-to(sm) {
            position: absolute;
            top: calc(50% + .2rem);
            left: 50%;
            color: $blue;
            transform: translateX(-50%) translateY(-50%);
        }
    }

    .count {
        transition: all $default-color-transition;

        @include respond-to(sm) {
            color: $base-800;
        }
    }

    .price {
        margin-right: 1.2rem;
        transition: all $default-color-transition;

        @include respond-to(sm) {
            color: $base-800;
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        color: $base-800;
        transform: rotate(180deg);

        @include respond-to(sm) {
            display: none;
        }
    }
</style>
