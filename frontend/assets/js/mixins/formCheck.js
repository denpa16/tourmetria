import {regCheck} from '~/assets/js/mixins/regCheck';
import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
import {getCookie} from '~/assets/js/utils/commonUtils';
import {setReachGoal} from '~/assets/js/analyticalMetric';

export const formCheck = {
    mixins: [regCheck, breakpointCheck],

    data() {
        return {
            subscribeSuccessTitle: 'Спасибо',
            subscribeSuccessMessage: 'Вы успешно подписались на рассылку',
            subscribeTimerText: 'Форма появится автоматически через',
            isFormEnable: true,
            isSubmitted: false,
            isRequestError: false,
            formKey: 1,
        };
    },

    computed: {
        subscribeErrorMessage() {
            return this.breakpoint === 'xs'
                ? 'Произошла техническая ошибка. Попробуйте отправить заявку еще раз'
                : 'К сожалению, произошла техническая ошибка. Попробуйте отправить заявку еще раз';
        }
    },

    methods: {
        checkField(id) {
            this.inputs.forEach(input => {
                if (input.id === id) {
                    input.errorMsg = '';
                    input.error = false;
                    if ((input.id === 'email' || input.id === 'phone' || input.id === 'passportSeries' || input.id === 'passportNumber') && input.isFocus && input.vModel) {
                        return;
                    }
                    input.errorMsg = this.regCheck(input.vModel, input.regex, input.required);
                    input.error = Boolean(input.errorMsg);
                }
            });

            this.checkForm();
        },

        checkForm() {
            for (const i in this.inputs) {
                if ((this.inputs[i].errorMsg !== ''&&this.inputs[i].error) || (this.inputs[i].required && this.inputs[i].vModel === '')) {
                    this.isFormEnable = false;
                    return;
                }
            }
            this.isFormEnable = true;
        },

        handleFocusOut(input) {
            input.isFocus = false;
            this.checkField(input.id);
        },

        handleResent() {
            this.isSubmitted = false;
            this.isRequestError = false;
        },

        forceRerender() {
            this.formKey += 1;
        },

        async handleSubscribeSubmit(evt, title, comment, source) {
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

                    if (title) {
                        data.title = title;
                    }

                    if (comment) {
                        data.comment = comment;
                    }

                    if (source) {
                        data.source_description = source;
                    }

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
