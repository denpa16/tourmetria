<template>
    <div :class="[$style.ProjectGenplanPin, $style[`_${direction}`]]"
         @mouseenter="$emit('mouseenter', pinInfo, $event)"
         @mouseleave="$emit('mouseleave', $event)"
         @click.stop="$emit('click', pinInfo, $event)">
        <div :class="[$style.pinShield, {[$style._active]: isActive}, 'p6']">
            {{ label }}
        </div>

        <IconPinTriangle
            :class="[$style.pinIcon, $style[`_${direction}`]]"
            fill="#009EAE"
        />

        <div v-if="isFiltered && pinInfo.flat_count"
             :class="[$style.flatCount, $style[`_${direction}`], 'p7']">
            {{ pinInfo.flat_count }} кв.
        </div>
    </div>
</template>

<script>
    import IconPinTriangle from '~/components/icons/IconPinTriangle';

    export default {
        name: 'ProjectGenplanPin',

        components: {
            IconPinTriangle
        },

        props: {
            pinInfo: {
                type: Object,
                default: () => ({}),
            },

            isActive: {
                type: Boolean,
                default: false,
            },

            isFiltered: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            label() {
                return this.pinInfo?.pinLabel || '';
            },

            direction() {
                switch (this.pinInfo?.label_pointer) {
                    case 0:
                        return 'top';
                    case 90:
                        return 'right';
                    case 180:
                        return 'bottom';
                    case 270:
                        return 'left';
                    default:
                        return 'bottom';
                }
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanPin {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(1) translateX(-50%) translateY(-50%);
        cursor: pointer;
        user-select: none;

        @include hover {
            & .pinShield {
                background-color: $base-0;
                color: $primary-500;
            }
        }

        @include respond-to(xs) {
            transform: scale(.7) translateX(-50%) translateY(-50%);
        }

        &._top {
            flex-direction: column-reverse;
        }

        &._left {
            flex-direction: row-reverse;
        }

        &._bottom {
            flex-direction: column;
        }

        &._right {
            flex-direction: row;
        }
    }

    .pinShield {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3.2rem;
        padding: .8rem;
        border-radius: .8rem;
        border: .4rem solid $blue;
        background-color: $primary-500;
        white-space: nowrap;
        color: $base-0;
        transition: all $default-transition;

        &._active {
            background-color: $base-0;
            color: $primary-500;
        }
    }

    .pinIcon {
        width: 1.2rem;
        height: 1.2rem;
        color: $blue;

        &._top {
            margin-bottom: .2rem;
            transform: rotate(180deg);
        }

        &._left {
            margin-right: .2rem;
            transform: rotate(90deg);
        }

        &._bottom {
            margin-top: .2rem;
        }

        &._right {
            margin-left: .2rem;
            transform: rotate(-90deg);
        }
    }

    .flatCount {
        position: absolute;
        padding: .5rem .8rem .3rem;
        border-radius: .4rem;
        background: $base-50;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        white-space: nowrap;

        &._top {
            bottom: -.4rem;
            left: 50%;
            transform: translate(-50%, 100%);
        }

        &._left {
            top: 50%;
            right: -.4rem;
            transform: translate(100%, -50%);
        }

        &._bottom {
            top: -.4rem;
            left: 50%;
            transform: translate(-50%, -100%);
        }

        &._right {
            top: 50%;
            left: -.4rem;
            transform: translate(-100%, -50%);
        }
    }
</style>
