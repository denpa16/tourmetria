<template>
    <div :class="$style.HintTouch">
        <div :class="$style.hintIcons">
            <IconFinger :class="$style.iconFinger" />
            <IconOneFingerTap :class="$style.iconOneFingerTap" />
        </div>
        <p :class="$style.hintText">
            Нажмите
            для подробной
            информации
        </p>
    </div>
</template>

<script>
    import IconOneFingerTap from '~/components/icons/IconOneFingerTap';
    import IconFinger from '~/components/icons/IconFinger';
    export default {
        name: 'HintTouch',
        components: {IconFinger,
                     IconOneFingerTap},

        props: {},
        data() {
            return {};
        },

        computed: {},
        methods: {},
    };
</script>

<style lang="scss" module>
    .HintTouch {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: rgba($base-800, .64);
    }

    .hintIcons {
        position: relative;
        width: 3rem;
        height: 4rem;
        animation: tap 3s linear infinite 0s;
    }

    .iconFinger {
        position: absolute;
        top: 0;
        left: 0;
        animation: finger 2s linear infinite 0s;
    }

    .iconOneFingerTap {
        position: absolute;
        top: 0;
        left: 0;
        animation: finger-tap 2s linear infinite 0s;
    }

    .hintText {
        max-width: 10.2rem;
        text-align: center;
        font-family: $accent-font-family;
        font-size: 1.2rem;
        line-height: 1.4rem;
        color: $base-0;
    }

    @keyframes finger {
        0% {
            opacity: 1;
        }

        17% {
            opacity: 1;
        }

        25% {
            opacity: 0;
        }

        92% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    @keyframes finger-tap {
        0% {
            opacity: 0;
        }

        17% {
            opacity: 0;
        }

        25% {
            opacity: 1;
        }

        92% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }
</style>
