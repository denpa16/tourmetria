<template>
    <div :class="[$style.HomeProjects, 'container']">
        <h2 :class="[$style.title, 'h3']">
            Проекты в продаже <span class="c-base300">{{ projects.length }}</span>
        </h2>

        <ProjectsList :projects="projects"
                      :values="values"
                      :specs="specs"
                      :facets="facets"
                      :main-page="mainPage"
                      :is-reset-btn-disabled="isResetBtnDisabled"
                      :is-reloading="isReloading"
                      :promo-list="promoList"
                      @reset="$emit('reset')"
                      @change="$emit('change', $event)"
                      @clear-filter="$emit('clear-filter', $event)"
                      @open-call-modal="onOpenForm"
        />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ProjectsList from '~/components/common/projects/ProjectsList';
    import {
        clearDoubleSpaces,
        convertFilterValuesToOrderDetails,
    } from '~/assets/js/utils/commonUtils';
    import FormModal from '~/components/layout/modals/forms/FormModal';

    export default {
        name: 'HomeProjects',

        components: {ProjectsList},

        props: {
            projects: {
                type: Array,
                default: () => [],
            },

            values: {
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

            mainPage: {
                type: Boolean,
                default: false,
            },

            isResetBtnDisabled: {
                type: Boolean,
                default: false,
            },

            isReloading: {
                type: Boolean,
                default: false,
            },

            promoList: {
                type: Array,
                default: () => [],
            }
        },

        computed: {
          ...mapGetters(['getCurrentCity']),
        },

        methods: {
            onOpenForm() {
                const data = {
                    formTitle: 'Заказать консультацию. Не найдены проекты по заданным параметрам',
                    formSource: 'На главной: Поиск проектов по параметрам',
                    formComment: clearDoubleSpaces(`
                        Выбранный город: ${this.getCurrentCity?.label || ''};
                        Текущая страница: Главная страница;
                        Путь страницы: ${this.$route.path};
                        Выбранные параметры: ${convertFilterValuesToOrderDetails(this.values, this.specs) || ''}
                    `),
                };

                this.$modal.open(FormModal, data);
            },
        },
    };
</script>

<style lang="scss" module>
    .HomeProjects {
        padding-top: 10.4rem;
        padding-bottom: 6.4rem;
        background-color: $base-0;

        @include respond-to(xs) {
            padding-top: 4rem;
            padding-bottom: 4rem;
        }
    }

    .title {
        margin-bottom: 6.4rem;
        text-align: center;
        text-transform: uppercase;

        @include respond-to(sm) {
            margin-bottom: 4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }
</style>
