<template>
    <div :class="$style.FooterForm">
        <div :class="$style.info">
            <h4 :class="[$style.title, 'h4']"
                v-html="title"></h4>
            <div :class="[$style.subtitle, 'p6', 'c-base300']"
                 v-html="subtitle"></div>
        </div>
        <form :key="formKey"
              :class="$style.form"
              @submit.prevent="handleSubmit">
            <div :class="$style.formInner">
                <div v-for="(input, index) in inputs"
                     :key="index"
                     :class="[$style.inputWrapper, $style.formItem]">
                    <VInput
                        :id="input.id"
                        v-model.trim="input.vModel"
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
                <div :class="[$style.formItem, $style.desktopBtn]">
                    <VButton responsive
                             type="submit">
                        Отправить
                    </VButton>
                </div>
            </div>
            <div :class="$style.mobileBtn">
                <VButton responsive
                         type="submit">
                    Отправить
                </VButton>
            </div>
            <p 
                class="c-base300"
                :class="$style.disclaimer"
            >
                Вы даете согласие на рекламную коммуникацию и <span class="c-blue">обработку персональных данных</span>
            </p>
        </form>
        
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
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {formCheck} from '~/assets/js/mixins/formCheck';
    import {clearDoubleSpaces, getCookie, getPageTitle} from '~/assets/js/utils/commonUtils';
    import {setReachGoal} from '~/assets/js/analyticalMetric';
    import FormResult from '~/components/common/forms/FormResult';

    export default {
        name: 'FooterForm',

        components: {FormResult},

        mixins: [formCheck],

        data() {
            return {
                title: 'Подпишитесь<br><span class="c-base300">на рассылку</span>',
                subtitle: 'Никакого спама, только самая важная информация, чтобы быть в&nbsp;курсе',
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
            ...mapState({currentCity: 'current_city'}),
            isSuccess() {
                return this.isSubmitted && !this.isRequestError;
            },
        },

        methods: {
            async handleSubmit() {
                for (const i in this.inputs) {
                    this.checkField(this.inputs[i].id);
                }

                if (this.isFormEnable) {
                    try {
                        const data = {
                            type: 'subscribers',
                            name: this.inputs[0].vModel,
                            email: this.inputs[1].vModel,
                            roistat_id: getCookie('roistat_visit') || '',
                            metrika_client_id: getCookie('_ym_uid') || '',
                        };

                        data.title = 'Подписаться на рассылку. Основной сайт';
                        data.comment = clearDoubleSpaces(`
                            Выбранный город: ${this.currentCity?.label || ''};
                            Расположение формы захвата: Футер сайта, раздел - "Подпишитесь на рассылку";
                            Текущая страница: ${this.$route.path === '/' ? 'Главная страница' : getPageTitle()};
                            Путь страницы: ${this.$route.path};
                        `);

                        await this.$axios.$post(this.$api.request, {
                            ...data,
                        });

                        setReachGoal();
                        this.forceRerender();

                        Object.keys(this.inputs).forEach(key => {
                            this.inputs[key].vModel = '';
                        });
                    } catch (err) {
                        this.isRequestError = true;
                        console.warn('[SubscribeForm/submit] POST request failed: ', err);
                    }

                    this.isSubmitted = true;
                }
            },
        }
    };
</script>

<style lang="scss" module>
    .FooterForm {
        position: relative;
        display: flex;
        padding: 2rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;

        @include respond-to(xs) {
            flex-direction: column;

            .title {
                font-size: 1.6rem;
                line-height: 1.9rem;
            }
        }

        & :global(.v-input.has-error) {
            margin-bottom: 0;
        }
    }

    .info {
        width: 32%;

        @include respond-to(sm) {
            width: 38%;
        }

        @include respond-to(xs) {
            width: 100%;
        }
    }

    .title {
        text-transform: uppercase;
    }

    .subtitle {
        max-width: 32rem;
        margin-top: 1.4rem;

        @include respond-to(sm) {
            max-width: 22rem;
        }

        @include respond-to(xs) {
            max-width: unset;
            margin-top: .8rem;
        }
    }

    .form {
        display: grid;
        align-items: flex-end;
        flex: 1;

        @include respond-to(sm) {
            flex-direction: column;
            margin-top: auto;
        }

        @include respond-to(xs) {
            margin-top: 1.6rem;
        }
    }

    .disclaimer {
        width: 100%;
        font-size: 1.2rem;

        @include respond-to(sm) {
            padding-top: 1rem;
        }
    }

    .formInner {
        display: flex;
        width: 100%;
        margin-bottom: .7rem;

        @include respond-to(xs) {
            flex-direction: column;
        }
    }

    .formItem {
        width: 33.33333%;

        &:not(:last-child) {
            margin-right: 1.6rem;
        }

        @include respond-to(sm) {
            width: 50%;

            &:not(:last-child) {
                margin-right: 0;
            }

            &:first-child {
                margin-right: 1.2rem;
            }
        }

        @include respond-to(xs) {
            width: 100%;

            &:first-child {
                margin-right: 0;
                margin-bottom: 1.7rem;
            }
        }
    }

    .desktopBtn {
        @include respond-to(sm) {
            display: none;
        }
    }

    .mobileBtn {
        display: none;

        @include respond-to(sm) {
            display: block;
            width: 100%;
            margin-top: 1.2rem;
        }

        @include respond-to(xs) {
            margin-top: 1.6rem;
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
        padding: 2.4rem;
        border-radius: .8rem;
        background-color: $base-0;

        & :global(.form-icon) {
            display: none;
        }

        & :global(.form-title) {
            margin: 0;
        }

        & :global(.form-text) {
            width: 100%;
            max-width: unset;
            margin-top: .6rem;
            font-size: 1.2rem;
        }

        & :global(.v-button--large) {
            width: unset;
            height: 3.2rem;
        }

        @include respond-to(sm) {
            & :global(.form-bottom) {
                padding: 0;
                border-top: unset;
            }
        }

        @include respond-to(xs) {
            & :global(.form-icon) {
                display: flex;
                margin-bottom: 3.2rem;
            }

            & :global(.form-text) {
                margin-top: .8rem;
            }
        }
    }

    .formResultInner {
        width: 100%;
        height: 100%;
    }
</style>
