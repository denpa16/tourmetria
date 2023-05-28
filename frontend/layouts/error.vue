<template>
    <div :class="$style.error">
        <div :class="$style.content">
            <h1 :class="[$style.title, 'h4']">
                Здравствуйте, мы рады видеть вас на сайте<br>
                Неометрии
            </h1>

            <p :class="[$style.text, 'p4']">
                Страница, на которую вы хотите попасть, в данный момент недоступна. Пожалуйста, зайдите позже. Спасибо!
            </p>

            <VButton link="/"
                     responsive>
                Перейти на главную
            </VButton>
            <span v-if="historyLength > 1"
                  :class="[$style.backBtn, 'p6']"
                  @click="$router.go(-1)">
                <span :class="$style.backBtnInner">
                    <IconArrowLeft :class="$style.backIcon" />
                    Назад
                </span>
            </span>
        </div>
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    export default {
        name: 'Error',
        components: {IconArrowLeft},

        mixins: [breakpointCheck],
        props: {
            error: {
                type: Object,
                required: true,
            }
        },

        data() {
            return {
                historyLength: 0,
            };
        },

        mounted() {
            if (typeof window !== 'undefined') {
                this.historyLength = window.history?.length;
            }

            console.error(this.error?.message);
        },
    };
</script>

<style lang="scss" module>
    .error {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: calc(100vh - (#{$header-h} + #{$header-plank-h}));

        @include respond-to(sm) {
            height: calc(var(--vh-full-page) - (#{$header-h} + #{$header-plank-h}));
        }

        @include respond-to(xs) {
            height: calc(var(--vh-full-page) - (#{$header-mobile-h} + #{$header-plank-h}));
        }

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 22vh;
            background: url('/images/vectorTop.svg');
            background-size: 100% 100%;
            opacity: .081;

            @include respond-to(xs) {
                height: 14vh;
            }
        }

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 22vh;
            background: url('/images/vectorBottom.svg');
            background-size: 100% 100%;
            opacity: .081;

            @include respond-to(xs) {
                height: 14vh;
            }
        }
    }

    .content {
        max-width: 33rem;
        text-align: center;
    }

    .title {
        margin-bottom: .8rem;
        text-transform: uppercase;
    }

    .text {
        margin-bottom: 1.6rem;
    }

    .backBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.4rem;
        transition: color $default-color-transition;
        cursor: pointer;

        @include hover {
            color: $blue;
        }
    }

    .backBtnInner {
        position: relative;
    }

    .backIcon {
        position: absolute;
        top: calc(50% - .1rem);
        left: -.4rem;
        width: 1.6rem;
        height: 1.6rem;
        color: $blue;
        transform: translate(-100%, -50%);
    }
</style>
