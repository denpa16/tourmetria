<template>
    <div :class="$style.FooterBottom">
        <div :class="$style.col">
            <div :class="[$style.footerItem, $style._logo]">
                <a href="https://idaproject.com/"
                   target="_blank">
                    <IconLogoIda />
                    <span :class="['p8', 'c-base300', $style.logoText]">построили сайт</span>
                </a>
            </div>
            <div :class="[$style.footerItem, $style._copy]">
                <p :class="['p6', 'c-base300', $style.copyText]">
                    {{ copyText }}
                </p>
            </div>
        </div>
        <div :class="$style.col">
            <div :class="[$style.footerItem, $style._privacy]">
                <a :class="['p6', 'c-base300', $style.privacyLink]"
                   :href="privacyLink"
                   target="_blank">
                    Политика конфиденциальности
                </a>
            </div>
            <div :class="[$style.footerItem, $style._up]">
                <SocialsPanel :class="$style.socials"
                              :socials="socials" />

                <VSquareButton color="white"
                               :class="$style.btnUp"
                               aria-label="Вернуться к верху страницы"
                               @click="scrollToTop">
                    <IconArrowLeft :class="$style.icon" />
                </VSquareButton>
            </div>
        </div>
    </div>
</template>

<script>
    import IconLogoIda from '~/components/icons/IconLogoIda';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import SocialsPanel from '~/components/common/SocialsPanel';

    export default {
        name: 'FooterBottom',

        components: {
            IconLogoIda,
            IconArrowLeft,
            SocialsPanel,
        },

        props: {
            socials: {
                type: Array,
                default: () => [],
            },

            privacyLink: {
                type: String,
                default: '',
            },
        },

        computed: {
            copyText() {
                return `Неометрия (c) ${new Date().getFullYear()}`;
            },
        },

        methods: {
            scrollToTop() {
                window.scrollTo({top: 0});
            },
        },
    };
</script>

<style lang="scss" module>
    .FooterBottom {
        display: flex;
        padding: 1.6rem 0;
        border-top: 1px solid $base-100;

        @include respond-to(sm) {
            justify-content: space-between;
            padding: 1.6rem 0 5.4rem;
        }

        @include respond-to(xs) {
            position: relative;
            padding: 1.6rem 0 3.2rem;

            .copyText,
            .privacyLink {
                margin-bottom: 1.6rem;
                white-space: nowrap;
                font-size: 1rem;
                line-height: 1.6rem;
            }
        }
    }

    .col {
        display: flex;
        flex: 1;

        @include respond-to(sm) {
            flex: unset;

            &:last-child {
                justify-content: flex-end;
            }
        }

        @include respond-to(xs) {
            flex-direction: column;

            &:first-child {
                flex-direction: column-reverse;
            }

            &:last-child {
                align-items: flex-end;
                justify-content: flex-start;
            }
        }
    }

    .footerItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        @include respond-to(sm) {
            flex: unset;

            &:first-child {
                margin-right: 8rem;
            }
        }

        @include respond-to(xs) {
            &:first-child {
                margin-right: 0;
            }

            &._up,
            &._logo {
                margin-top: 32px;
            }

            &._copy {
                position: absolute;
                top: 16px;
                right: 0;
            }

            &._privacy {
                position: absolute;
                top: 16px;
                left: 0;
            }
        }
    }

    .privacyLink {
        transition: $default-color-transition;
        -webkit-user-select: none;
        user-select: none;

        @include hover {
            color: $blue;
        }
    }

    .logoText {
        -webkit-user-select: none;
        user-select: none;
    }

    .btnUp {
        &:global(.v-square-button--white) {
            box-shadow: unset;

            @include respond-to(xs) {
                color: $blue;
            }
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        transform: rotate(90deg);
    }

    .socials {
        @include respond-to(sm) {
            display: none;
        }
    }
</style>
