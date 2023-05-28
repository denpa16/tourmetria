<template>
    <div :data-item-id="lot.id"
         :class="[$style.ProjectGenplanCheckerboardLot, classes, 'p5']"
         @click.stop="$emit('click')"
         @mouseenter="$emit('mouseenter', $event)"
         @mouseleave="$emit('mouseleave', $event)">
        <span v-if="getStatus(lot.status).isFree && !disabled"
              :class="$style.lotCardText">{{ lot.rooms || 'С' }}</span>
        <IconLock v-else-if="getStatus(lot.status).isBooked && !disabled"
                  :class="$style.bookedIcon" />
    </div>
</template>

<script>
    import {getStatus} from '~/assets/js/utils/commonUtils';
    import IconLock from '~/components/icons/IconLock';

    export default {
        name: 'ProjectGenplanCheckerboardLot',

        components: {
            IconLock,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            disabled: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            classes() {
                return {
                    [this.$style._disabled]: !getStatus(this.lot.status).isFree || this.disabled,
                    [this.$style._promo]: this.lot.has_promotions,
                };
            }
        },

        methods: {
            getStatus(num) {
                return getStatus(num);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanCheckerboardLot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.4rem;
        height: 2.4rem;
        border-radius: .4rem;
        border: .1rem solid $base-50;
        background: $base-50;
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            border: .1rem solid $blue;
            color: $blue;
        }

        &._promo {
            position: relative;
            border: .1rem solid $blue;
            color: $blue;

            @include hover {
                opacity: .7;
            }

            &:after {
                content: "";
                position: absolute;
                top: .1rem;
                right: .1rem;
                width: .4rem;
                height: .4rem;
                border-radius: 50%;
                background-color: $blue;
            }
        }

        &._disabled {
            border: .1rem solid $base-50;
            cursor: unset;
            pointer-events: none;

            &:after {
                display: none;
            }

            @include hover {
                border: .1rem solid $base-50;
                color: unset;
            }
        }
    }

    .lotCardText {
        padding-top: .2rem;
    }

    .bookedIcon {
        width: 1.2rem;
        height: 1.2rem;
        color: $base-300;
    }
</style>
