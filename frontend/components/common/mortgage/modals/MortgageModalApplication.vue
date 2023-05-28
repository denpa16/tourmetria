<template>
    <ModalWrap @close="close">
        <div :class="$style.ModalApplication">
            <h4 :class="[$style.modalTitle, 'h4']">
                Подать заявку
            </h4>
            <form
                :class="$style.form"
                @submit.prevent="onSubmit"
            >
                <VInput
                    v-for="(input, index) in inputs"
                    :id="input.id"
                    :key="index"
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
                <VButton
                    :disabled="!isFormEnable || !isFormFilled"
                    :class="$style.sendButton"
                    type="submit"
                >
                    Отправить
                </VButton>
                <p :class="$style.approval">
                    Вы даете согласие на рекламную коммуникацию и
                    <a :class="$style.link"
                       :href="privacyLink"
                       target="_blank">обработку персональных данных</a>
                </p>
            </form>
        </div>
    </ModalWrap>
</template>

<script>
    import {formCheck} from '~/assets/js/mixins/formCheck';
    import {mapGetters} from 'vuex';

    import ModalWrap from '~/components/common/ModalWrap';
    export default {
        name: 'MortgageModalApplication',
        components: {ModalWrap},
        mixins: [formCheck],
        props: {},
        data() {
            return {
                inputs: [
                    {
                        id: 'name',
                        placeholder: 'ФИО',
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
                        id: 'phone',
                        placeholder: 'Номер телефона',
                        type: 'tel',
                        mask: 'phone',
                        maxLength: 18,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'phone',
                        required: true,
                    },
                ]
            };
        },

        computed: {
            ...mapGetters({
                privacyLink: 'getPrivacyLink'
            }),

            isFormFilled() {
                return this.inputs[0].vModel.length && this.inputs[1].vModel.length;
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },

            onSubmit() {
                for (const i in this.inputs) {
                    this.checkField(this.inputs[i].id);
                }
                if (!this.isFormEnable) {
                    return;
                }
                const data = {
                    full_name: this.inputs[0].vModel,
                    phone_number: this.inputs[1].vModel,
                };
                console.log(data);
                this.close();
            }
        },
    };
</script>

<style lang="scss" module>
    .ModalApplication {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 2.4rem;
    }

    .modalTitle {
        margin-bottom: 2.4rem;
    }

    .form {
        display: flex;
        flex-direction: column;
        flex: auto;
        width: 100%;
        height: 100%;

        & > * {
            margin-bottom: 2rem;

            &:last-child {
                margin-bottom: 0;
            }
        }

        :global(.v-input.has-error) {
            margin-bottom: 3.6rem;
        }
    }

    .sendButton {
        margin-top: auto;
    }

    .approval {
        max-width: 32.3rem;
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
