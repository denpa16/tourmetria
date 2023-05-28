<template>
    <div
        v-clickoutside="handleClickOutside"
        :class="$style.SharingButton"
    >
        <div
            :class="$style.button"
            @click="toggleMenu"
        >
            <IconShare :class="$style.icon" />
        </div>

        <transition name="dropdown">
            <div v-if="isOpened"
                 :class="$style.menu">
                <div :class="$style.socials">
                    <a
                        :class="$style.link"
                        :href="`https://vk.com/share.php?url=${encodeURIComponent(originUrl)}&title=${URITitle}`"
                        target="_blank"
                    >
                        <IconVk :class="$style.icon" />
                    </a>

                    <a
                        :class="$style.link"
                        :href="`https://telegram.me/share/url?text=${URITitle}&url=${encodeURIComponent(originUrl)}`"
                        target="_blank"
                    >
                        <IconTelegram :class="$style.icon" />
                    </a>

                    <a :class="$style.link"
                       :href="`https://connect.ok.ru/offer?url=${encodeURIComponent(originUrl)}&title=${URITitle}`"
                       target="_blank"
                    >
                        <IconOk :class="$style.icon" />
                    </a>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import clickoutside from 'assets/js/directives/clickoutside';
    import IconShare from '~/components/icons/IconShare';
    import IconVk from '~/components/icons/IconVk';
    import IconTelegram from '~/components/icons/IconTelegram';
    import IconOk from '~/components/icons/IconOk';

    export default {
        name: 'Share',

        directives: {
            clickoutside,
        },

        components: {
            IconShare,
            IconVk,
            IconTelegram,
            IconOk,
        },

        props: {
            title: {
                type: String,
                default: 'С Вами поделились ссылкой',
            },

            originUrl: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                isOpened: false,
                copyMsg: '',
            };
        },

        computed: {
            URITitle() {
                return encodeURIComponent(this.title);
            },
        },

        methods: {
            toggleMenu() {
                this.isOpened = !this.isOpened;
            },

            handleClickOutside() {
                if (!this.isOpened) {
                    return;
                }
                this.isOpened = false;
            },
        },
    };
</script>

<style lang="scss" module>
    .SharingButton {
        position: relative;
    }

    .button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
        border-radius: .4rem;
        background-color: $base-50;
        color: $base-800;
        transition: all $default-color-transition;
        cursor: pointer;

        @include hover {
            background-color: $blue;
            color: $base-0;
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .menu {
        position: absolute;
        top: calc(100% + .8rem);
        z-index: 5;
        display: flex;
        border-radius: .4rem;
        background-color: $base-50;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .socials {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
        border-radius: .4rem;
        background-color: $base-50;
        color: $base-800;
        transition: all $default-color-transition;

        &:not(:last-child) {
            &:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 1.2rem;
                height: 1px;
                background-color: $base-250;
                transform: translateX(-50%);
                transition: opacity $default-color-transition;
            }
        }

        @include hover {
            background-color: $blue;
            color: $base-0;

            &:after {
                opacity: 0;
            }
        }
    }
</style>
