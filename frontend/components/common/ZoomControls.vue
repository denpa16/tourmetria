<template>
    <div :class="$style.ZoomControls">
        <VSquareButton :color="color"
                       size="custom"
                       :disabled="zoomInDisabled"
                       :class="$style.btn"
                       :shadow="shadow"
                       aria-label="Увеличить"
                       @click.prevent.stop="$emit('click-zoom-in')">
            <IconPlus :class="$style.icon" />
        </VSquareButton>
        <VSquareButton :color="color"
                       size="custom"
                       :disabled="zoomOutDisabled"
                       :class="$style.btn"
                       :shadow="shadow"
                       aria-label="Уменьшить"
                       @click.prevent.stop="$emit('click-zoom-out')">
            <IconMinus :class="$style.icon" />
        </VSquareButton>
    </div>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';
    import IconMinus from '~/components/icons/IconMinus';

    export default {
        name: 'ZoomControls',

        components: {
            IconPlus,
            IconMinus,
        },

        props: {
            color: {
                type: String,
                default: 'white',
            },

            zoomInDisabled: {
                type: Boolean,
                default: false,
            },

            zoomOutDisabled: {
                type: Boolean,
                default: false,
            },

            shadow: {
                type: Boolean,
                default: false,
            }
        },
    };
</script>

<style lang="scss" module>
    .ZoomControls {
        user-select: none;
        display: flex;
        flex-direction: column;
    }

    .btn {
        width: 4.4rem;
        height: 4.4rem;
        font-size: 1.8rem;
        font-weight: 500;

        &:not(:last-child) {
            margin-bottom: .8rem;
        }

        @include respond-to(xs) {
            width: 4rem;
            height: 4rem;
        }
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;
    }
</style>
