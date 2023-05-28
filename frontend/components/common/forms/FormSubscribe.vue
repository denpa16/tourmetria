<template>
    <div :class="$style.FormSubscribe">
        <div :class="$style.content">
            <div :class="$style.background">
                <div :class="[$style.backgroundItem, $style._top]"></div>
                <div :class="[$style.backgroundItem, $style._bottom]"></div>
            </div>
            <transition name="fade">
                <div v-if="isSubmitted"
                     :class="$style.formResult">
                    <FormResult :class="$style.formResultInner"
                                :success="isSuccess"
                                :success-title="subscribeSuccessTitle"
                                :success-message="subscribeSuccessMessage"
                                :error-message="subscribeErrorMessage"
                                :btn-text="'Повторить'"
                                :timer-text="subscribeTimerText"
                                @close="handleResent"
                                @resent="handleResent" />
                </div>
            </transition>

            <div :class="$style.head">
                <h3 :class="['h3', $style.title]">
                    {{ title }}
                </h3>
                <p :class="['c-base300', 'p6', $style.subtitle]"
                   v-html="subtitle || defaultSubtitle"></p>
            </div>

            <form id="subscribeForm"
                  :key="formKey"
                  :class="$style.form"
                  @submit.prevent="handleSubscribeSubmit($event, formTitle, formComment, formSource)">
                <div :class="$style.inputs">
                    <VInput
                        v-for="(input, index) in inputs"
                        :id="input.id"
                        :key="index"
                        v-model.trim="input.vModel"
                        :class="$style.input"
                        :mask="input.mask"
                        :type="input.type"
                        :name="input.name"
                        :max-length="input.maxLength"
                        :placeholder="input.placeholder"
                        :error="input.error"
                        :error-msg="input.errorMsg"
                        @blur="handleFocusOut(input)"
                        @focus="input.isFocus = true"
                        @input="checkField(input.id)"
                    />
                </div>

                <VButton :class="$style.desktopBtn"
                         type="submit">
                    Отправить
                </VButton>
            </form>

            <div :class="$style.bottom">
                <p :class="['p6', 'c-base200', $style.privacy]">
                    Нажав на кнопку, вы соглашаетесь на обработку<a :class="$style.link"
                                                                    :href="privacyLink"
                                                                    target="_blank"> персональных данных</a>
                </p>

                <VButton :class="$style.mobileBtn"
                         type="submit"
                         form="subscribeForm">
                    Отправить
                </VButton>

                <div :class="$style.socials">
                    <p :class="[$style.socialsText, 'p6', 'c-base200']">
                        следите в соцсетях
                    </p>
                    <SocialsPanel :socials="socials" />
                </div>
            </div>
        </div>
        <div :class="$style.imageWrapper">
            <ImageLazy :preview="require('~/static/images/formImagePreview.webp')"
                       :image="require('~/static/images/formImage.webp')"
                       relative
            />
        </div>
    </div>
</template>

<script>
    import {formCheck} from '~/assets/js/mixins/formCheck';
    import {mapGetters} from 'vuex';
    import ImageLazy from '~/components/common/ImageLazy';
    import SocialsPanel from '~/components/common/SocialsPanel';
    import FormResult from '~/components/common/forms/FormResult';
    import {clearDoubleSpaces, getPageTitle} from '~/assets/js/utils/commonUtils';

    export default {
        name: 'FormSubscribe',

        components: {
            ImageLazy,
            SocialsPanel,
            FormResult,
        },

        mixins: [formCheck],

        props: {
            title: {
                type: String,
                default: 'Подпишитесь на рассылку',
            },

            subtitle: {
                type: String,
                default: '',
            },

            customFormTitle: {
                type: String,
                default: '',
            },

            customFormComment: {
                type: String,
                default: '',
            },

            customFormSource: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                inputs: [
                    {
                        id: 'name',
                        placeholder: 'Имя',
                        type: 'text',
                        maxLength: 50,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'multyLang',
                        required: true,
                    },
                    {
                        id: 'email',
                        placeholder: 'E-mail',
                        type: 'text',
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'email',
                        required: true,
                    }
                ],
            };
        },

        computed: {
            ...mapGetters({
                socials: 'getSocialLinks',
                privacyLink: 'getPrivacyLink',
                currentCity: 'getCurrentCity',
            }),

            defaultSubtitle() {
                return this.$deviceIs.tablet
                    ? 'Ход строительства каждый месяц'
                    : 'Никакого спама, только самая важная информация, чтобы быть в&nbsp;курсе';
            },

            isSuccess() {
                return this.isSubmitted && !this.isRequestError;
            },

            formTitle() {
                return this.customFormTitle || 'Подписаться на рассылку';
            },

            formComment() {
                return this.customFormComment || clearDoubleSpaces(`
                    Выбранный город: ${this.currentCity?.label || ''};
                    Текущая страница: ${this.$route.path === '/' ? 'Главная страница' : getPageTitle()};
                    Путь страницы: ${this.$route.path};
                `);
            },

            formSource() {
                return this.customFormSource || 'На главной: Подпишитесь на рассылку';
            },
        },
    };
</script>

<style lang="scss" module>
    .FormSubscribe {
        display: flex;
        margin-bottom: 6.2rem;
        padding: 0 2.4rem;

        & :global(.v-input--default) {
            border-color: $base-0;
            background-color: $base-0;
        }

        & :global(.v-input.has-error) {
            margin-bottom: 0;

            @include respond-to(sm) {
                margin-bottom: 1rem;
            }

            @include respond-to(xs) {
                margin-bottom: 3rem;
            }
        }

        @include respond-to(sm) {
            margin-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 4rem;
            padding: 0 1.6rem;
        }
    }

    .content {
        position: relative;
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        width: 55.5%;
        margin-right: 1.6rem;
        padding: 4rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(sm) {
            width: 100%;
            margin-right: 0;
            padding: 9.6rem 2.4rem;
            background-color: $base-0;
        }

        @include respond-to(xs) {
            padding: 2.4rem 1.6rem;
            border-radius: 1.6rem;
            background-color: $base-50;
        }
    }

    .background {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: none;
        width: 100%;
        height: 100%;

        @include respond-to(sm) {
            display: flex;
            flex-direction: column;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .backgroundItem {
        position: relative;
        flex: 1;
        background: url("/images/vector-no-border.svg") no-repeat top center;
        background-size: 101%;

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background: linear-gradient(191.79deg, rgba(251, 251, 251, 0) 8.64%, #fafafa 58.72%);
        }

        &._top {
            &:after {
                transform: matrix(-1, 0, 0, 1, 0, 0);
            }
        }

        &._bottom {
            transform: rotate(180deg);
        }
    }

    .formResult {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 4rem;
        border-radius: .8rem;
        background-color: $base-50;

        & :global(.form-icon) {
            background-color: $base-0;
        }

        & :global(.form-title) {
            margin: 4rem 0 1.4rem;
            font-size: 3.2rem;
            line-height: 3.8rem;
        }

        & :global(.form-text) {
            max-width: unset;
        }

        & :global(.v-button) {
            width: unset;
        }

        @include respond-to(sm) {
            & :global(.form-bottom) {
                padding: 0;
                border-top: unset;
            }
        }

        @include respond-to(xs) {
            padding: 2.4rem 1.6rem;

            & :global(.form-title) {
                margin: 3.2rem 0 .8rem;
                font-size: 2rem;
                line-height: 2.8rem;
            }

            & :global(.form-text) {
                font-size: 1.2rem;
            }

            & :global(.form-error) {
                & :global(.form-bottom) {
                    margin-top: 4rem;
                }
            }
        }
    }

    .formResultInner {
        height: 100%;

        @include respond-to(sm) {
            width: 70%;
            height: 80%;
            margin-top: auto;
        }

        @include respond-to(xs) {
            width: 100%;
            height: 73%;
        }
    }

    .imageWrapper {
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        flex: 1;
        border-radius: .8rem;

        @include respond-to(sm) {
            display: none;
        }
    }

    .head {
        position: relative;
        z-index: 3;
        margin-bottom: 4.8rem;

        @include respond-to(sm) {
            margin-bottom: 4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
        }
    }

    .title {
        margin-bottom: 1.4rem;
        text-transform: uppercase;
        color: $base-600;

        @include respond-to(sm) {
            margin-bottom: .8rem;
        }

        @include respond-to(xs) {
            max-width: 60%;
            font-size: 2rem;
            line-height: 2.8rem;
        }
    }

    .subtitle {
        max-width: 29rem;

        @include respond-to(xs) {
            color: $base-400;
        }
    }

    .form {
        position: relative;
        z-index: 3;
        display: flex;
        margin-bottom: 3.2rem;

        @include respond-to(sm) {
            margin-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            flex-direction: column;
        }
    }

    .inputs {
        display: flex;
        flex: 1;

        @include respond-to(xs) {
            flex-direction: column;
        }
    }

    .input {
        margin-right: 1.6rem;

        @include respond-to(sm) {
            &:last-child {
                margin-right: 0;
            }
        }

        @include respond-to(xs) {
            margin-right: 0;

            &:not(:last-child) {
                margin-bottom: 1.6rem;
            }
        }
    }

    .desktopBtn {
        @include respond-to(sm) {
            display: none;
        }

        @include respond-to(xs) {
            display: block;
            width: 100%;
            margin-top: 2.4rem;
        }
    }

    .mobileBtn {
        display: none;
        min-width: 15rem;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .bottom {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include respond-to(xs) {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
        }
    }

    .privacy {
        max-width: 29rem;

        @include respond-to(sm) {
            display: none;
        }

        @include respond-to(xs) {
            display: block;
            color: $base-300;
        }
    }

    .link {
        color: $blue;
        transition: color $default-color-transition;

        @include hover {
            color: $primary-500;
        }
    }

    .socials {
        display: flex;
        align-items: center;

        @include respond-to(xs) {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 2.4rem;
        }
    }

    .socialsText {
        margin-right: 1.6rem;

        @include respond-to(xs) {
            margin-bottom: .8rem;
        }
    }
</style>
