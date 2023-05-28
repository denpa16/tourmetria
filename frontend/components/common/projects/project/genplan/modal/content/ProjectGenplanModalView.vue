<template>
    <div :class="$style.ProjectGenplanModalView">
        <TemplateBottomModal :visible="visible"
                             :is-lock-body="$deviceIs.mobile"
                             :data="data"
                             @close="closeWithoutSave">
            <div :class="$style.wrapper">
                <span class="p6 c-base300">Вид генплана</span>
                <RadioButtonsGroup :class="$style.radioBtns"
                                   :value="currentMode"
                                   :btn-list="viewModeBtns"
                                   responsive
                                   @change="currentMode = $event" />

                <VButton :class="$style.btnWithCheckbox"
                         color="light"
                         responsive
                         @click="currentInfraStatus = !currentInfraStatus">
                    <VCheckbox :false-value="false"
                               :value="currentInfraStatus"
                               :class="$style.checkbox"
                               readonly
                    >
                        Показать инфраструктуру
                    </VCheckbox>
                </VButton>

                <VButton color="primary"
                         responsive
                         @click="handleClickBtn">
                    Показать
                </VButton>
            </div>
        </TemplateBottomModal>

        <transition name="overlay-appear">
            <Overlay v-if="visible"
                     :class="$style.overlay"
                     @click="closeWithoutSave" />
        </transition>
    </div>
</template>

<script>
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import RadioButtonsGroup from '~/components/common/RadioButtonsGroup';
    import Overlay from '~/components/layout/modals/Overlay';

    export default {
        name: 'ProjectGenplanModalView',
        components: {
            RadioButtonsGroup,
            Overlay,
            TemplateBottomModal,
        },

        props: {
            visible: {
                type: Boolean,
                default: false,
            },

            isShowInfra: {
                type: Boolean,
                default: false,
            },

            viewMode: {
                type: String,
                default: 'render'
            }
        },

        data() {
            return {
                currentMode: this.viewMode,
                currentInfraStatus: this.isShowInfra,
                data: {
                    title: 'Вид генплана'
                },

                viewModeBtns: [
                    {
                        key: 'render',
                        name: 'Рендер',
                    },
                    {
                        key: 'scheme',
                        name: 'Схема',
                    },
                ],
            };
        },

        watch: {
            viewMode(val) {
                if (val !== this.currentMode) {
                    this.currentMode = val;
                }
            },

            isShowInfra(val) {
                if (val !== this.currentInfraStatus) {
                    this.currentInfraStatus = val;
                }
            }
        },

        methods: {
            handleClickBtn() {
                if (this.currentInfraStatus !== this.isShowInfra || this.currentMode !== this.viewMode) {
                    this.$emit('change-infra', this.currentInfraStatus);
                    this.$emit('change-view-mode', this.currentMode);
                }

                this.$emit('close');
            },

            closeWithoutSave() {
                this.currentMode = this.viewMode;
                this.currentInfraStatus = this.isShowInfra;
                this.$emit('close');
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalView {
        //
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        height: 70vh;
        padding-bottom: 1.6rem;
    }

    .radioBtns {
        margin-top: 1.2rem;
    }

    .btnWithCheckbox {
        justify-content: flex-start;
        margin-top: 2.4rem;
        margin-bottom: auto;
    }

    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
