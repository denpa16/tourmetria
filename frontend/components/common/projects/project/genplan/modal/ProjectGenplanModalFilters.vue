<template>
    <ModalWrap :class="$style.modal"
               :container-without-paddings="$deviceIs.pc"
               :without-overlay="$deviceIs.pc"
               :hidden-close-btn="$deviceIs.pc"
               :is-lock-body="!$deviceIs.pc"
               @close="close">
        <div :class="$style.ProjectGenplanModalFilters">
            <div :class="$style.modalHeader">
                <button
                    :class="[$style.resetButton, $style._mobile, 'p6', 'c-blue']"
                    value="Сбросить"
                    @click="resetFilters"
                >
                    Сбросить
                </button>
                <h4 :class="[$style.modalTitle, 'h4']">
                    Фильтр
                </h4>
            </div>
            <VScrollBox :class="$style.filtersScroll">
                <div :class="$style.filtersContainer">
                    <ProjectGenplanFilters
                        :values="values"
                        :specs="specs"
                        :facets="facets"
                        @change="change"
                    />
                </div>
            </VScrollBox>
            <div :class="$style.modalFooter">
                <VButton :color="linkButtonColor"
                         :class="[$style.footerBtn, $style.linkButton]"
                         :link="link"
                         :disabled="!isFilterDirty"
                         blank>
                    Посмотреть списком
                </VButton>
                <VButton
                    :class="[$style.footerBtn, $style.resetButton]"
                    :color="resetButtonColor"
                    icon-first
                    @click="resetFilters"
                >
                    Сбросить <span v-show="$deviceIs.pc">фильтр</span>
                    <template #icon>
                        <IconCross :class="$style.iconCross" />
                    </template>
                </VButton>
                <VButton
                    :class="[$style.footerBtn, $style.applyButton]"
                    :loading="isLoading"
                    :spinner="isLoading"
                    @click="close"
                >
                    {{ applyButtonText }}
                </VButton>
            </div>
        </div>
    </ModalWrap>
</template>

<script>
    import ProjectGenplanFilters
        from '~/components/common/projects/project/genplan/ProjectGenplanFilters';
    import ModalWrap from '~/components/common/ModalWrap';
    import IconCross from '~/components/icons/IconCross';
    import {getCorrectEnding} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'ProjectGenplanModalFilters',
        components: {
            ProjectGenplanFilters,
            ModalWrap,
            IconCross
        },

        props: {
            values: {
                type: Object,
                default: () => ({}),
            },

            dirtyValues: {
                type: Object,
                default: () => ({}),
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            filterCount: {
                type: Number,
                default: 0
            },

            nextStepName: {
                type: String,
                default: ''
            },

            flatsCount: {
                type: [String, Number],
                default: 0
            },

            stepCount: {
                type: [String, Number],
                default: 0
            },

            projectSlug: {
                type: String,
                default: '',
            },

            isLoading: {
                type: Boolean,
                default: false,
            },

            isFilterDirty: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            resetButtonColor() {
                return this.$deviceIs.pc ? 'text' : 'light';
            },

            linkButtonColor() {
                return this.$deviceIs.tablet ? 'white' : 'light';
            },

            applyButtonText() {
                if (this.stepCount && this.flatsCount && this.nextStepName) {
                    return `${this.flatsCount} кв / ${this.stepCount} ${getCorrectEnding(this.nextStepName, this.stepCount)}`;
                }

                if (this.flatsCount) {
                    return `${this.flatsCount} ${getCorrectEnding('квартира', this.flatsCount)}`;
                }

                if (this.stepCount && this.nextStepName) {
                    return `${this.stepCount} ${getCorrectEnding(this.nextStepName, this.stepCount)}`;
                }

                return 'Показать';
            },

            link() {
                return {path: '/selection/flats', query: {...this.dirtyValues, project: this.projectSlug}};
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },

            change(val) {
                this.$emit('change', val);
            },

            resetFilters() {
                this.$emit('clear-filters');
                this.close();
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalFilters {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: .8rem;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .modal {
        width: auto;
        height: auto;

        @include respond-to(sm) {
            width: 100%;
            height: 100%;
        }
    }

    .modalHeader {
        margin-bottom: .4rem;
        padding: 2.4rem 2.4rem 0;

        @include respond-to(sm) {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2.4rem;
            border-bottom: 1px solid $base-100;
        }
    }

    .modalTitle {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.2rem;
        }
    }

    .iconArrow {
        width: .8rem;
        height: .4rem;
    }

    .filtersScroll {
        position: relative;
        z-index: 5;
        flex: auto;
    }

    .filtersContainer {
        padding: 0 2.4rem 2.4rem;

        @include respond-to(sm) {
            padding: 2.4rem;
        }

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }

    .modalFooter {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 6.4rem;
        padding: 0 2.4rem 2.4rem;

        @include respond-to(sm) {
            display: flex;
            flex-wrap: wrap;
            height: fit-content;
            padding: 2.4rem;
            border-top: 1px solid $base-100;
        }

        @include respond-to(xs) {
            flex-direction: row-reverse;
        }
    }

    .footerBtn {
        margin-right: .4rem;

        @include respond-to(sm) {
            flex: 1;
            margin-right: 1.6rem;
        }

        &:last-child {
            margin-right: 0;
        }
    }

    .linkButton {
        margin-right: auto;

        @include respond-to(sm) {
            margin-right: 1.6rem;
        }

        @include respond-to(xs) {
            margin-right: 0;
            margin-left: 1.6rem;
        }
    }

    .resetButton {
        & :global(.v-button__icon) {
            transform: translateY(-.1rem);
        }

        @include respond-to(xs) {
            display: none;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                position: absolute;
                top: 2.4rem;
                left: 1.6rem;
                display: block;
                width: fit-content;
            }
        }
    }

    .iconCross {
        width: .8rem;
        height: .8rem;
    }
</style>
