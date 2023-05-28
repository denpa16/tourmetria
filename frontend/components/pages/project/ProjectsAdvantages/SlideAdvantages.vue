<template>
    <div :class="[$style.slide, {[$style.slideIstooltip]: slide.tooltip}]">
        <div :class="$style.slideIconWrapper">
            <ImageLazy
                v-if="slide.icon"
                :class="$style.slideIcon"
                :image="slide.icon"
                :preview="slide.icon"
                relative
            />
        </div>
        <VTooltip v-if="slide.tooltip"
                  :class="$style.VTooltip"
                  top>
            <template #activator>
                <span :class="$style.iconTooltip">?</span>
            </template>
            <div :class="$style.tooltip">
                {{ slide.tooltip }}
            </div>
        </VTooltip>
        <div :class="[$style.slideContent, 'p5']"
             v-html="slide.text"></div>
    </div>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    export default {
        name: 'SlideAdvantages',

        components: {
            ImageLazy,
        },

        props: {
            slide: {
                type: Object,
                default: () => ({}),
            },
        },
    };
</script>

<style lang="scss" module>
    .slide {
        position: relative;
        display: grid;
        grid-template-areas:
            'icon'
            'text';
        min-width: 28rem;
        height: 12.3rem;
        margin-right: 1.6rem;
        padding: 1.6rem;
        border-radius: 1rem;
        background: $base-0;

        @include respond-to(sm) {
            flex: 1;
        }

        @include respond-to(xs) {
            flex-direction: row;
            min-width: 27rem;
            height: 19.6rem;
            margin-right: 0;
            margin-bottom: .8rem;
            padding: 2.4rem;
        }

        &:last-child {
            margin-right: 0;
            margin-bottom: 0;
        }
    }

    .slideIstooltip {
        grid-template-areas:
            'icon tooltip'
            'text text';
    }

    .slideIconWrapper {
        position: relative;
        display: flex;
        grid-area: icon;
        align-items: center;
        justify-content: center;
        width: 3.1rem;
        height: 3.1rem;
        border-radius: 50%;
        background-color: $base-50;
    }

    .slideIcon {
        width: 1.3rem;
        height: 1.3rem;
        color: $blue;
    }

    .slideContent {
        margin-top: 3.2rem;

        @include respond-to(sm) {
            margin-top: 2.4rem;
            font-size: 1.2rem;
        }

        @include respond-to(xs) {
            align-self: flex-end;
            margin-top: 0;
            font-size: 1.2rem;
        }
    }

    .VTooltip {
        justify-self: flex-end;
    }

    .tooltip {
        max-width: 25rem;
        padding: 1.2rem;
        border-radius: .8rem;
        background-color: $base-300;
        color: $base-0;
    }

    .iconTooltip {
        grid-area: tooltip;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        border: .1rem solid $base-100;
        font-size: .9rem;
        font-weight: bold;
        transition-duration: .3s;
        transition-property: border-color;

        &:hover {
            border-color: $black;
        }
    }

    .text {
        grid-area: text;
    }
</style>
