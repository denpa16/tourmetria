<template>
    <div :class="$style.SocialsPanel">
        <a v-for="(item, idx) in socials"
           :key="idx"
           :class="$style.socialItem"
           :href="item.link"
           target="_blank"
        >
            <span :class="$style.icon"
                  v-html="item.icon_content"></span>
        </a>
    </div>
</template>

<script>
    export default {
        name: 'SocialsPanel',

        props: {
            socials: {
                type: Array,
                default: () => [],
            }
        },
    };
</script>

<style lang="scss" module>
    .SocialsPanel {
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        display: flex;
        border-radius: .4rem;
    }

    .socialItem {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
        background-color: $base-0;
        color: $base-800;
        transition: all $default-color-transition;

        &:not(:last-child) {
            &:after {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 1.2rem;
                background-color: $base-100;
                transform: translateY(-50%);
            }
        }

        @include hover {
            color: $blue;
        }
    }

    .icon {
        width: 1.4rem;
        height: 1.4rem;

        & svg {
            width: 1.4rem;
            height: 1.4rem;
        }
    }
</style>
