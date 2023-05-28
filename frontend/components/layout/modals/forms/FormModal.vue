<template>
    <TemplateRightModal :visible="visible"
                        :title="title"
                        :additional-title="additionalTitle"
                        @close="$emit('close')"
                        @after-enter="$emit('after-enter')"
                        @before-leave="$emit('before-leave')"
                        @after-leave="$emit('after-leave')">
        <transition name="fade">
            <div v-if="isSubmitted"
                 :class="$style.formResult">
                <FormResult :class="$style.formResultInner"
                            :success="isSuccess"
                            :success-message="successMessage"
                            @close="$emit('close')"
                            @resent="handleResent" />
            </div>
        </transition>

        <div :class="$style.formWrapper">
            <form :class="$style.form"
                  @submit.prevent="handleSubmit">
                <div :class="$style.formInner">
                    <div v-for="(input, index) in inputs"
                         :key="index"
                         :class="$style.inputWrapper">
                        <VSelect
                            v-if="input.type === 'select'"
                            :id="input.id"
                            :class="$style.select"
                            :value="input.vModel"
                            :name="input.name"
                            :placeholder="input.placeholder"
                            :error="input.error"
                            :error-msg="input.errorMsg"
                            :options="input.options"
                            :bordered="input.bordered"
                            @blur="handleFocusOut(input)"
                            @focus="input.isFocus = true"
                            @input="handleInputSelect($event, input.id)"
                        />
                        <VInput
                            v-else
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
                </div>

                <div :class="$style.formBtn">
                    <VButton responsive
                             type="submit">
                        {{ btnText }}
                    </VButton>
                </div>
            </form>

            <p :class="$style.approval">
                Вы даете согласие на рекламную коммуникацию и
                <a :class="$style.link"
                   :href="privacyLink"
                   target="_blank">обработку персональных данных</a>
            </p>
        </div>
    </TemplateRightModal>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {formCheck} from '~/assets/js/mixins/formCheck';
    import {setReachGoal} from '~/assets/js/analyticalMetric';
    import {cleanPhone, getCookie} from '~/assets/js/utils/commonUtils';
    import TemplateRightModal from '~/components/layout/modals/templates/TemplateRightModal';
    import FormResult from '~/components/common/forms/FormResult';

    export default {
        name: 'FormModal',

        components: {
            TemplateRightModal,
            FormResult,
        },

        mixins: [formCheck],

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                successMessage: 'Заявка была отправлена. Менеджер свяжется <br> с вами в ближайшее время',
                inputs: this.data?.customInputs?.length
                    ? this.data.customInputs
                    : [
                        {
                            id: 'name',
                            placeholder: 'ФИО',
                            type: 'text',
                            maxLength: 70,
                            vModel: '',
                            error: false,
                            errorMsg: '',
                            isFocus: false,
                            regex: 'multyLang',
                            required: true,
                        },
                        {
                            id: 'phone',
                            placeholder: 'Номер телефона',
                            type: 'text',
                            vModel: '',
                            error: false,
                            errorMsg: '',
                            isFocus: false,
                            regex: 'phone',
                            mask: 'phone',
                            required: true,
                        },
                        ...this.data?.additionalInputs ? this.data?.additionalInputs : []
                    ],
            };
        },

        computed: {
            ...mapGetters({
                privacyLink: 'getPrivacyLink',
            }),

            title() {
                return this.data?.title ?? 'Оставить заявку';
            },

            additionalTitle() {
                return this.data?.additionalTitle ?? 'Заявка на консультацию';
            },


            btnText() {
                return this.data?.btnText ?? 'Отправить';
            },

            type() {
                return this.data?.type ?? 'call_back';
            },

            customInputs() {
                return this.data?.customInputs ?? [];
            },

            additionalInputs() {
                return this.data?.additionalInputs ?? [];
            },

            isSuccess() {
                return this.isSubmitted && !this.isRequestError;
            },

            formTitle() {
                return this.data?.formTitle || '';
            },

            formComment() {
                return this.data?.formComment || '';
            },

            formSource() {
                return this.data?.formSource || '';
            },

            ymType() {
                return this.data?.ymType || undefined;
            }
        },

        methods: {
            async handleSubmit() {
                for (const i in this.inputs) {
                    this.checkField(this.inputs[i].id);
                }

                if (this.isFormEnable) {
                    try {
                        const data = this.inputs.reduce((res, input) => {
                            if (input.id === 'phone') {
                                res[input.id] = cleanPhone(input.vModel);
                            } else {
                                res[input.id] = input.vModel;
                            }

                            return res;
                        }, {});

                        data.type = this.type;
                        data.title = this.formTitle;
                        data.comment = this.formComment;
                        data.source_description = this.formSource;
                        data.roistat_id = getCookie('roistat_visit') || '';
                        data.metrika_client_id = getCookie('_ym_uid') || '';

                        // возможные type "call_back" ("Получить консультацию"), "subscribers" ("Подписка на рассылку"),
                        // "meeting" ("Записаться на встречу")

                        await this.$axios.$post(this.$api.request, {
                            ...data,
                        });

                        setReachGoal(this.ymType);
                    } catch (err) {
                        this.isRequestError = true;
                        console.warn('[CallForm/submit] POST request failed: ', err);
                    }

                    this.isSubmitted = true;
                }
            },

            handleInputSelect(value, id) {
                this.inputs.find(input => input.id === id).vModel = value;
                this.checkField(id);
            }
        }
    };
</script>

<style lang="scss" module>
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

        @include respond-to(sm) {
            padding: 0;
        }

        @include respond-to(xs) {
            padding: 1.6rem 1.6rem 2.4rem;
        }
    }

    .formResultInner {
        width: 100%;
        height: 65%;
        margin-top: auto;

        @include respond-to(sm) {
            height: 100%;
            margin-top: 9.3rem;

            & :global(.form-content) {
                margin: auto;
            }

            & :global(.form-bottom) {
                margin-top: 0;
            }
        }

        @include respond-to(xs) {
            height: 100%;
            margin-top: auto;
        }
    }

    .formWrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .form {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .formBtn {
        margin-top: auto;

        @include respond-to(sm) {
            margin-top: 7.2rem;
        }

        @include respond-to(xs) {
            margin-top: auto;
        }
    }

    .inputWrapper {
        &:not(:last-child) {
            margin-bottom: 1.6rem;
        }
    }

    .select {
        width: 100%;
    }

    .approval {
        max-width: 32.3rem;
        margin-top: 1.6rem;
        font-size: 1.2rem;
        line-height: 1.6rem;
        color: $base-300;
    }

    .link {
        color: $blue;
        transition: color $default-color-transition;

        @include hover {
            color: $base-800;
        }
    }
</style>
