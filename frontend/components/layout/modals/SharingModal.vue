<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.SharingModal]">

            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="$style.content">
                    <div :class="$style.head">
                        <h5 :class="$style.title">
                            Поделиться
                        </h5>
                    </div>

                    <div :class="$style.socials">
                        <a
                            :class="$style.link"
                            :href="`https://vk.com/share.php?url=${encodeURIComponent(originUrl)}&title=${URITitle}`"
                            target="_blank"
                        >
                            <IconVk :class="$style.icon" />
                            <span>ВКонтакте</span>
                        </a>

                        <a
                            :class="$style.link"
                            :href="`https://telegram.me/share/url?text=${URITitle}&url=${encodeURIComponent(originUrl)}`"
                            target="_blank"
                        >
                            <IconTelegram :class="$style.icon" />
                            <span>Telegram</span>
                        </a>

                        <a :class="$style.link"
                           :href="`https://connect.ok.ru/offer?url=${encodeURIComponent(originUrl)}&title=${URITitle}`"
                           target="_blank"
                        >
                            <IconOk :class="$style.icon" />
                            <span>Одноклассники</span>
                        </a>
                    </div>

                    <div :class="$style.closeBtn">
                        <VSquareButton color="light"
                                       size="small"
                                       aria-label="Закрыть"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';
    import IconVk from '~/components/icons/IconVk';
    import IconTelegram from '~/components/icons/IconTelegram';
    import IconOk from '~/components/icons/IconOk';

    export default {
        name: 'SharingModal',

        components: {
            IconPlus,
            IconVk,
            IconTelegram,
            IconOk,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },


    };
</script>

<style lang="scss" module>
    .SharingModal {
        z-index: 200;
    }

    .wrap {
        right: 0;
        max-width: 100vw;
        transform: translateX(0);
    }

    .content {
        position: relative;
        margin-top: auto;
        padding-right: 1.6rem;
        padding-left: 1.6rem;
        border-radius: .8rem .8rem 0 0;
        background-color: $base-0;
    }

    .head {
        position: relative;
        padding-top: 3.4rem;
        padding-bottom: 3.4rem;
    }

    .title {
        text-transform: uppercase;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .closeBtn {
        position: absolute;
        top: 2.4rem;
        right: 1.6rem;
        transform: translateX(0);
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .socials {
        display: flex;
        flex-direction: column;
        padding-bottom: 4rem;
    }

    .link {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1.5rem 1.6rem 1.3rem;
        border-radius: .4rem;
        border: 1px solid $base-200;
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.6rem;
        color: $black;

        &:not(:last-child) {
            margin-bottom: .8rem;
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1.2rem;
        transform: translateY(-.2rem);
    }
</style>
