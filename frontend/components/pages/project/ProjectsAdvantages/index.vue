<template>
    <div :class="[$style.ProjectsAdvantages, 'container']">
        <div :class="$style.wrapper">
            <div :class="$style.titleWrap">
                <h2
                    :class="[$style.title, 'h3']"
                >
                    Преимущества <span>гк</span>
                </h2>

                <VSelect
                    class="advantages-select"
                    placeholder="Выбрать"
                    :options="data.specs"
                    :value="value"
                    :bordered="false"
                    :modal-breakpoint="['xs','sm']"
                    :modal-width="$deviceIs.tablet ? '54.6rem' : '100%'"
                    size="big"
                    :checkbox="false"
                    :is-tabs="false"
                    :is-tabs-required="false"
                    active-color="secondary"
                    @input="value = $event"
                />
            </div>

            <p 
                v-if="data.description" 
                :class="[$style.subtitle, 'p3', 'c-base300']"
            >
                {{ data.description }}
            </p>

            <client-only>
                <SliderAdvantages
                    :class="$style.slider"
                    :slide="slideAdvantages" 
                    :slides="currentSlides"
                    :slug="data.slug"
                    @open-form="$emit('open-form')"
                />
            </client-only>
        </div>
    </div>
</template>

<script>
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import SliderAdvantages from '~/components/pages/project/ProjectsAdvantages/SliderAdvantages';
    import SlideAdvantages from '~/components/pages/project/ProjectsAdvantages/SlideAdvantages.vue';
    import {clearDoubleSpaces} from '~/assets/js/utils/commonUtils';

    export default {
        name: 'ProjectsAdvantages',

        components: {
            SliderAdvantages,
        },

        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                title: 'Ипотека 1,99% на весь период',
                subtitle: 'Фиксированная ставка действует для всех квартир.',
                value: '',
            };
        },

        computed: {
            slideAdvantages() {
                return SlideAdvantages;
            },

            currentSlides() {
                const result = this.data.cards.filter(el => el.type === this.value);
                return result;
            }
        },

        created() {
            if (this.data.specs.length) {
                this.value = this.data.specs[0].value;
            }
        },

        methods: {
            openForm() {
                const data = {
                    formTitle: `Подать заявку на ипотеку. Проект - ${this.project?.name || 'страница проекта'}`,
                    formSource: `Страница ${this.project?.name}: Блок - Субсидированная ипотека 0.1%`,
                    formComment: clearDoubleSpaces(`
                        Проект: ${this.project?.name || ''};
                        Город проекта: ${this.project?.city?.name || ''};
                    `),
                };

                this.$modal.open(FormModal, data);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectsAdvantages {
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        @include respond-to(xs) {
            padding: 4rem 0;
        }
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 9.4rem;
        border-radius: 1.6rem;
        background-color: $base-50;

        @include respond-to(sm) {
            padding-top: 9.4rem;
            padding-bottom: 6.4rem;
        }

        @include respond-to(xs) {
            padding-top: 2.4rem;
            padding-bottom: 4rem;
            border-radius: .8rem;
        }
    }

    .titleWrap {
        display: flex;
        margin-bottom: 8.8rem;
        padding: 0 3.3rem;
        column-gap: 1rem;

        @include respond-to(sm) {
            justify-content: center;
        }

        @include respond-to(xs) {
            flex-wrap: wrap;
            margin-bottom: 2.4rem;
        }
    }

    .title {
        text-transform: uppercase;

        @include respond-to(sm) {
            span {
                display: none;
            }
        }

        @include respond-to(sm) {
            font-size: 3rem;
        }

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }

    .slider {
        margin-bottom: 2.4rem;

        @include respond-to(xs) {
            margin-bottom: 0;
        }
    }

    .subtitle {
        margin-top: 2.8rem;
        font-weight: 500;

        @include respond-to(sm) {
            margin-top: 1.6rem;
        }

        @include respond-to(xs) {
            margin-top: .8rem;
        }
    }
</style>

<style lang="scss">
    .advantages-select {
        .v-select__value {
            span {
                text-transform: uppercase;
            }
        }
    }
</style>
