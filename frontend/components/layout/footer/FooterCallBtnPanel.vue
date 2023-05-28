<template>
    <div :class="$style.FooterCallBtnPanel">
        <div :class="$style.col">
            <FooterCallBtn :class="$style.item"
                           :title="$deviceIs.mobile ? 'заказать' : 'получите консультацию'"
                           :subtitle="$deviceIs.mobile ? 'обратный звонок' : 'заказать обратный звонок'"
                           color="dark"
                           @click="handleOpenModal"
            >
                <span :class="$style.icon">
                    <IconPhone />
                </span>
            </FooterCallBtn>
        </div>
        <div v-if="messengers.length"
             :class="$style.col">
            <FooterCallBtn v-if="messengers[0]"
                           :class="$style.item"
                           title="напишите нам"
                           :subtitle="`в ${messengers[0].name}`"
                           :link="messengers[0].link"
                           target="_blank">
                <span :class="$style.icon"
                      v-html="messengers[0].icon_content"></span>
            </FooterCallBtn>

            <FooterCallBtn v-if="messengers[1]"
                           :class="$style.item"
                           title="напишите нам"
                           :subtitle="`в ${messengers[1].name}`"
                           :link="messengers[1].link"
                           target="_blank">
                <span :class="$style.icon"
                      v-html="messengers[1].icon_content"></span>
            </FooterCallBtn>
        </div>
    </div>
</template>

<script>
    import FooterCallBtn from '~/components/layout/footer/FooterCallBtn';
    import IconPhone from '~/components/icons/IconPhone';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import {mapGetters} from 'vuex';
    import {clearDoubleSpaces, getPageTitle} from '~/assets/js/utils/commonUtils';

    export default {
        name: 'FooterCallBtnPanel',

        components: {
            FooterCallBtn,
            IconPhone,
        },

        props: {
            messengers: {
                type: Array,
                default: () => [],
            },
        },

        computed: {
            ...mapGetters(['getCurrentCity']),
        },

        methods: {
            handleOpenModal() {
                const data = {
                    formTitle: 'Заказать обратный звонок. Основной сайт',
                    formSource: 'Подвал сайта',
                    formComment: clearDoubleSpaces(`
                        Выбранный город: ${this.getCurrentCity?.label || ''};
                        Текущая страница: ${getPageTitle()};
                        Путь страницы: ${this.$route.path};
                    `),
                };

                this.$modal.open(FormModal, data);
            }
        }
    };
</script>

<style lang="scss" module>
    .FooterCallBtnPanel {
        display: flex;
        width: 100%;

        @include respond-to(sm) {
            flex-direction: column;
        }
    }

    .col {
        display: flex;
        flex: 1;

        &:not(:last-child) {
            margin-right: 1.6rem;
        }

        @include respond-to(sm) {
            &:not(:last-child) {
                margin-right: 0;
                margin-bottom: 1.6rem;
            }
        }

        @include respond-to(xs) {
            flex-direction: column;

            &:not(:last-child) {
                margin-bottom: .8rem;
            }
        }
    }

    .item {
        flex: 1;

        &:not(:last-child) {
            margin-right: 1.6rem;
        }

        @include respond-to(xs) {
            &:not(:last-child) {
                margin-right: 0;
                margin-bottom: .8rem;
            }
        }
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;

        @include respond-to(xs) {
            width: 1.4rem;
            height: 1.4rem;
        }

        & svg {
            width: 1.6rem;
            height: 1.6rem;

            @include respond-to(xs) {
                width: 1.4rem;
                height: 1.4rem;
            }
        }
    }
</style>
