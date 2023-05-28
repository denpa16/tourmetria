<template>
    <PrintPage :class="$style.PrintProjectContacts">
        <img v-if="project.sales_office_map_display"
             :class="$style.officeMap"
             :src="project.sales_office_map_display"
             alt="Фото офиса">

        <div v-if="offices && offices.length"
             :class="$style.contacts">
            <h2 :class="[$style.title, 'c-blue']">
                Контакты
            </h2>

            <p :class="$style.contactsText">
                <span>Адрес:</span>
                <span v-if="projectOffice"
                      v-html="projectOffice.address"></span>
                <span v-else
                      v-html="offices[0].address"></span>
            </p>

            <p v-if="prettyPhoneNumber"
               :class="$style.contactsText">
                <span>Телефон:</span>
                <span>{{ prettyPhoneNumber }}</span>
            </p>
        </div>

        <footer :class="$style.footer">
            <div :class="$style.footerWrapper">
                <img :class="$style.qrcode"
                     src="/images/print/lot/qrcode.svg"
                     alt="QR-код контактов">

                <div v-if="getSocialLinks.length"
                     :class="$style.footerContent">
                    <p :class="$style.footerText">
                        Подписывайтесь<br>
                        на наши социальные сети, чтобы следить за новостями!
                    </p>
                    <ul :class="$style.socials">
                        <li v-for="social in getSocialLinks"
                            :key="social.id"
                            :class="$style.socialItem"
                            :style="{backgroundColor: social.color}">
                            <a :class="[$style.socialLink, {[$style._zen]: social.name === 'zen-yandex'}]"
                               :href="social.link"
                               target="_blank"
                               v-html="social.icon_content"></a>
                        </li>
                    </ul>

                    <span :class="$style.socialCaption">наведите на qr-код или кликните на иконки</span>
                </div>
            </div>
        </footer>
    </PrintPage>
</template>

<script>
    import {prettyPhone} from '~/assets/js/utils/commonUtils';
    import PrintPage from '~/components/common/print/PrintPage';
    import {mapGetters} from 'vuex';
    export default {
        name: 'PrintProjectContacts',

        components: {
            PrintPage,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },

            offices: {
                type: Array,
                default: () => [],
            },
        },

        computed: {
            ...mapGetters(['getSocialLinks']),
            projectOffice() {
                return this.offices.find(({is_main}) => !is_main);
            },

            prettyPhoneNumber() {
                if (!this.offices?.length) {
                    return '';
                }

                return prettyPhone(this.projectOffice?.phone || this.offices[0].phone || '');
            },
        },
    };
</script>

<style lang="scss" module>
    .PrintProjectContacts {
        display: flex;
        flex-direction: column;
    }

    .officeMap {
        width: 100%;
        height: 33%;
        object-fit: contain;
        object-position: top center;
    }

    .contacts {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        padding: 24px 44px;
    }

    .title {
        margin-bottom: 24px;
        text-transform: uppercase;
        font-size: 32px;
    }

    .contactsText {
        margin-bottom: 28px;
        font-size: 24px;
        line-height: 1;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40%;
        margin-top: auto;
        background-color: $base-50;
    }

    .footerWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 296px;
    }

    .qrcode {
        position: relative;
        display: block;
        height: 100%;
        margin-right: 25px;
    }

    .footerContent {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 390px;
        height: 100%;
        padding-top: 8px;
    }

    .footerText {
        margin-bottom: 24px;
        text-transform: uppercase;
        font-size: 24px;
        line-height: 28px;
    }

    .socials {
        position: relative;
        display: inline-flex;
        align-items: center;

        &:after {
            content: "";
            position: absolute;
            top: 50%;
            right: -20px;
            display: block;
            width: 47px;
            height: 86px;
            background: url("/images/print/lot/arrow.svg") no-repeat;
            background-size: contain;
            transform: translateX(100%);
        }
    }

    .socialItem {
        position: relative;
        overflow: hidden;
        width: 58px;
        height: 58px;
        margin-right: 24px;
        border-radius: 50%;
        background-color: $blue;
        opacity: 1;
        transition: opacity $default-transition;
        cursor: pointer;

        @include hover {
            opacity: .6;
        }

        &:last-child {
            margin-right: 0;
        }
    }

    .socialLink {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        & > svg {
            width: 28px;
            height: 28px;
            color: $base-0;
        }

        &._zen {
            & > svg {
                color: $base-800;
            }
        }
    }

    .socialCaption {
        position: relative;
        display: block;
        align-self: flex-end;
        max-width: 300px;
        margin-top: 58px;
        font-size: 22px;

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: -34px;
            display: block;
            width: 47px;
            height: 86px;
            background: url("/images/print/lot/arrow.svg") no-repeat;
            background-size: contain;
            transform: translateX(-100%) scaleX(-1) rotate(-270deg);
        }
    }
</style>
