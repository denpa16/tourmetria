<template>
    <ModalWrap
        :is-visible="visible"
        :class="$style.modalWrap"
        without-overlay
        @close="onClose"
        @after-enter="$emit('after-enter')"
        @before-leave="$emit('before-leave')"
        @after-leave="$emit('after-leave')"
    >
        <div :class="$style.BookingModal">
            <p :class="$style.modalTitle">
                бронирование
            </p>
            <h4 :class="[$style.bookingTitle, 'h4']">
                {{ bookingTitle }} {{ currentStep }}/<span class="c-base300">4</span>
            </h4>

            <transition name="fade">
                <div v-if="isRequestError"
                     :class="$style.formResult">
                    <FormResult :class="$style.formResultInner"
                                :success="false"
                                :error-title="errorData.title"
                                :error-message="errorData.message"
                                :is-error-icon="errorData.isErrorIcon"
                                :btn-text="errorData.btnText"
                                :href="errorData.url"
                                @close="$emit('close')"
                                @resent="handleResent" />
                </div>
                <div v-if="isLoading"
                     :class="$style.formResult">
                    <FormWaiting :class="$style.formWaiting" />
                </div>
            </transition>

            <div
                ref="slider"
                :class="[$style.bookingSlider, 'swiper']"
            >
                <div :class="[$style.sliderWrapper, 'swiper-wrapper']">
                    <div :class="[$style.slide, 'swiper-slide']">
                        <BookingPhoneNumber
                            :error="phoneErrorMessage"
                            @phoneEntered="onPhoneEntered"
                        />
                    </div>
                    <div :class="[$style.slide, 'swiper-slide']">
                        <BookingPhoneConfirmation
                            :phone="phone"
                            :error="confirmPhoneErrorMessage"
                            :code="code"
                            @phoneClicked="goBack"
                            @resendCode="sendToken"
                            @confirmButtonClicked="confirmPhone"
                        />
                    </div>
                    <div :class="[$style.slide, 'swiper-slide']">
                        <BookingFurnishing
                            :flat="data.flat"
                            :amount="bookingPrice"
                            @pay="goOn"
                        />
                    </div>
                    <div :class="[$style.slide, 'swiper-slide']">
                        <BookingBuyerInformation
                            :flat="data.flat"
                            @back="goBack"
                            @negotiate="onNegotiate"
                        />
                    </div>
                    <div :class="[$style.slide, 'swiper-slide']">
                        <BookingOffertoryContract
                            :flat="data.flat"
                            :offer-agreement="config.offer_agreement"
                            @back="goBack"
                            @agreed="bookFlat"
                        />
                    </div>
                </div>
            </div>
            <p
                v-if="activeSlide !== 5"
                :class="$style.bookingAgreement"
            >
                Вы даете согласие на рекламную коммуникацию и
                <a
                    :class="$style.link"
                    class="c-blue"
                    :href="privacyLink"
                    target="_blank"
                >
                    обработку персональных данных
                </a>
            </p>
        </div>
    </ModalWrap>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {setReachGoal} from '~/assets/js/analyticalMetric';

    import ModalWrap from '~/components/common/ModalWrap';
    import BookingPhoneNumber from '~/components/common/selection/flats/flat/booking/BookingPhoneNumber';
    import BookingPhoneConfirmation from '~/components/common/selection/flats/flat/booking/BookingPhoneConfirmation';
    import BookingFurnishing from '~/components/common/selection/flats/flat/booking/BookingFurnishing';
    import BookingBuyerInformation from '~/components/common/selection/flats/flat/booking/BookingBuyerInformation';
    import BookingOffertoryContract from '~/components/common/selection/flats/flat/booking/BookingOffertoryContract';
    import FormResult from '~/components/common/forms/FormResult';
    import FormWaiting from '~/components/common/forms/FormWaiting';

    export default {
        name: 'BookingModal',
        components: {
            ModalWrap,
            BookingPhoneNumber,
            BookingPhoneConfirmation,
            BookingFurnishing,
            BookingBuyerInformation,
            BookingOffertoryContract,
            FormResult,
            FormWaiting,
        },

        props: {
            visible: {
                type: Boolean,
                default: true
            },

            data: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                phone: '',
                contactNumber: '88007751793',
                slider: null,
                activeSlide: 1,
                totalSlides: 0,
                phoneErrorMessage: '',
                confirmPhoneErrorMessage: '',
                code: '',
                bayerInformation: {},
                config: {},
                isRequestError: false,
                isLoading: false,
                statusCode: '',
            };
        },

        computed: {
            ...mapGetters({
                privacyLink: 'getPrivacyLink'
            }),

            email() {
                return this.bayerInformation.email ?? '';
            },

            bookingPrice() {
                return this.data?.flat?.booking_price;
            },

            bookingTitle() {
                switch (this.activeSlide) {
                    case 1:
                    case 2:
                        return 'Подтверждение номера';
                    case 3:
                        return 'Комплектация квартиры';
                    case 4:
                        return 'Данные покупателя';
                    default:
                        return 'Договор оферты';
                }
            },

            currentStep() {
                return this.activeSlide === 1 || this.activeSlide === 2 ? 1 : this.activeSlide - 1;
            },

            errorData() {
                let error;
                switch (this.statusCode) {
                    case 'ERROR':
                        error = {
                            title: 'ошибка',
                            message: 'Заявка не отправлена, попробуйте <br> повторить попытку снова',
                            isErrorIcon: true,
                            btnText: 'Повторить попытку',
                            url: '',
                        };
                        break;
                    case 'PRODUCT_NOT_AVAILABLE':
                        error = {
                            title: 'упс, извините',
                            message: 'Квартира оказалась <br> забронированной',
                            isErrorIcon: false,
                            btnText: 'Выбрать другую квартиру',
                            url: '/selection/flats',
                        };
                        break;
                    default:
                        error = {
                            title: 'ошибка',
                            message: 'Заявка не отправлена, попробуйте <br> повторить попытку снова',
                            isErrorIcon: true,
                            btnText: 'Повторить попытку',
                            url: '',
                        };
                }
                return error;
            },
        },

        mounted() {
            this.$nextTick(() => {
                this.initSlider();
            });
        },

        methods: {
            onClose() {
                this.$emit('close');
            },

            goOn() {
                this.slider.slideNext();
            },

            goBack() {
                this.slider.slidePrev();
            },

            async fetchConfig() {
                try {
                    this.config = await this.$axios.$post(this.$api.booking.config, {
                        booking_price: this.bookingPrice,
                        email: this.email,
                    });
                } catch (error) {
                    console.warn('[BookingModal/fetchConfig] request failed: ', error);
                }
            },

            async onPhoneEntered(phone) {
                this.phone = phone;
                try {
                    await this.sendToken();
                    this.phoneErrorMessage = '';
                    this.goOn();
                } catch {
                    this.phoneErrorMessage = 'Введен неверный номер телефона';
                }
            },

            async confirmPhone(token) {
                try {
                    await this.validateToken(token);
                    this.confirmPhoneErrorMessage = '';
                    this.goOn();
                } catch {
                    this.confirmPhoneErrorMessage = 'Введен неверный код подтверждения';
                }
            },

            async sendToken() {
                try {
                    const res = await this.$axios.$post(this.$api.otp.otp, {
                        phone: this.phone,
                        scope: 'login',
                    });
                    this.code = res?.otp;
                } catch (error) {
                    console.warn('[BookingModal/sendToken] request failed: ', error);
                    throw error;
                }
            },

            async validateToken(token) {
                try {
                    await this.$axios.$post(this.$api.otp.validate, {
                        phone: this.phone,
                        scope: 'login',
                        otp: token
                    });
                } catch (error) {
                    console.warn('[BookingModal/validateToken] request failed: ', error);
                    throw error;
                }
            },

            onNegotiate(bayerInformation) {
                this.bayerInformation = JSON.parse(JSON.stringify(bayerInformation));
                this.fetchConfig();
                this.goOn();
            },

            async bookFlat() {
                const data = {
                    ...this.bayerInformation,
                    return_url: window.location.href,
                    phone: this.phone,
                    property_id: this.data.flat?.id,
                    booking_price: this.config?.amount,
                };

                try {
                    this.isLoading = true;
                    const res = await this.$axios.$post(this.$api.booking.order, data);
                    setReachGoal();
                    this.isLoading = false;
                    window.location.replace(res.form_url);
                } catch (error) {
                    console.warn('[BookingModal/order] request failed: ', error);
                    this.statusCode = error?.response.data.status;
                    this.isLoading = false;
                    this.isRequestError = true;
                }
            },

            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        allowTouchMove: false,
                        on: {
                            init: () => {
                                this.activeSlide = 1;
                                this.totalSlides = Math.ceil(this.$refs.slider.swiper.slides.length - this.$refs.slider.swiper.params.slidesPerView + 1);
                            },
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        this.activeSlide = this.$refs.slider.swiper.realIndex + 1;
                    });
                }
            },

            handleResent() {
                this.isRequestError = false;
            },
        },
    };
</script>

<style lang="scss" module>
    .modalWrap {
        & :global(.modal-wrap-container) {
            width: 78rem;

            @include respond-to(sm) {
                width: 54.6rem;
            }

            @include respond-to(xs) {
                width: 100%;
            }
        }
    }

    .BookingModal {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 2.4rem 0;
    }

    .modalTitle {
        display: none;

        @include respond-to(xs) {
            display: block;
            margin-bottom: 3rem;
            padding: 0 1.6rem;
            text-transform: uppercase;
            color: $base-300;
        }
    }

    .bookingTitle {
        padding: 0 2.4rem;
        text-transform: uppercase;

        @include respond-to(sm) {
            padding: 0 2.4rem 2.4rem;
            border-bottom: 1px solid $base-100;
        }

        @include respond-to(xs) {
            padding: 0 1.6rem;
            border-bottom: none;
        }
    }

    .bookingSlider {
        flex: auto;
        width: 100%;
    }

    .bookingAgreement {
        max-width: 34.3rem;
        padding: 1.6rem 0 0 2.4rem;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-300;

        @include respond-to(xs) {
            padding: 1.6rem 0 0 1.6rem;
        }
    }

    .formResult {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
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

        @include respond-to(xs) {
            height: 60%;
            margin-top: auto;
        }
    }

    .formWaiting {
        width: 80%;
        height: 65%;
        margin: auto auto 0;

        @include respond-to(sm) {
            width: 66%;
        }

        @include respond-to(xs) {
            width: 90%;
        }
    }

    .link {
        transition: color $default-color-transition;

        @include hover {
            color: $base-800;
        }
    }
</style>
