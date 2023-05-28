<template>
    <div :class="$style.ProjectsPage">
        <div :class="$style.ProjectsPageInner">
            <div class="container">
                <div :class="$style.projectsHeader">
                    <h3 :class="[$style.title, 'h3']">
                        Проекты <span class="c-blue">жилые</span>
                    </h3>
                    <!--                    Пока только жилые проекты выводятся-->
                    <!--                    <VSelect size="large"-->
                    <!--                             :value="type"-->
                    <!--                             :options="types"-->
                    <!--                             modal-breakpoint="xs"-->
                    <!--                             @input="handleSelect"-->
                    <!--                    />-->
                </div>

                <ProjectsList :projects="currentProjectsList"
                              :values="values"
                              :specs="specs"
                              :facets="facets"
                              :sort-options="optionsSort"
                              projects-page
                              :is-reset-btn-disabled="isResetBtnDisabled"
                              :is-reloading="isReloading"
                              :promo-list="promoList"
                              @reset="handleReset"
                              @clear-filter="handleChangeValues"
                              @change="handleChangeValues"
                              @open-call-modal="handleOpenCallModal"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import ProjectsList from '~/components/common/projects/ProjectsList';
    import {mapState, mapActions} from 'vuex';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {serializeValues} from '~/assets/js/utils/filterUtils';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import {
        clearDoubleSpaces,
        convertFilterValuesToOrderDetails,
    } from '~/assets/js/utils/commonUtils';

    const defaultValues = {
        city: '',
        property_type: '',
        rooms: [],
        area_min: '',
        area_max: '',
        price_min: '',
        price_max: '',
        completion_date: '',
        promo: false,
        order: 'flat_min_price',
    };

    export default {
        name: 'ProjectsPage',

        components: {ProjectsList},

        mixins: [breakpointCheck],

        async asyncData({store, app, query}) {
            try {
                // Ключи строки запроса
                const queryKeys = Object.keys(query);
                // Город
                const currentCity = store.state?.current_city;
                // Проекты текущего города
                const currentCityProjects = store.state?.projects?.currentCityProjects;
                const currentCityProjectsFacets = store.state?.projects?.currentCityProjectsFacets;
                // Все проекты
                const projectsSpecs = store.state?.projects?.specs;
                const allProjects = store.state?.projects?.allProjects;
                let allProjectsFacets = store.state?.projects?.allProjectsFacets;

                // Начальные параметры для фильтра
                const initialValues = {
                    ...defaultValues,
                    ...query,
                    rooms: query.rooms?.length ? query.rooms.split(',').map(item => Number(item)) : [],
                };

                // Список запросов страницы, здесь заданы постоянные запросы
                // при каждой загрузке страницы
                let pageRequestPromises = [
                    app.$axios.$get(app.$api.publications.promo),
                ];

                // ВСЕ ПРОЕКТЫ
                // Подгружаем спеки для проектов, если не были загружены ранее
                if (!projectsSpecs || !Object.keys(projectsSpecs)?.length) {
                    await store.dispatch('projects/fetchSpecs');
                }

                // Определяем, был ли выбран ранее город глобально и нет ли в строке запроса
                // конкретного города или проекта
                const city = currentCity?.value && !query?.city && !query?.project
                    ? currentCity.value
                    : '';
                // Если глобальный город используется, как основной, то записываем его в параметры
                if (city) {
                    initialValues.city = city;
                }

                if (initialValues.city) {
                    pageRequestPromises[0] = app.$axios.$get(app.$api.publications.promo, {
                        params: {city: initialValues.city},
                    });
                }

                // Устанавливаем параметры и очищаем список проектов
                store.dispatch('projects/setParams', initialValues);
                store.dispatch('projects/clearProjects');

                // Если в поисковой строке есть параметры, и это не только порядок сортировки,
                // то обновляем список проектов, иначе устанавливаем подходящие фасеты
                if (queryKeys?.length && (queryKeys?.length !== 1 || queryKeys[0] !== 'order')) {
                    pageRequestPromises = [
                        ...pageRequestPromises,
                        store.dispatch('projects/fetchProjects'),
                        store.dispatch('projects/fetchFacets'),
                    ];
                } else if (city) {
                    // Подгружаем фасеты для проектов текущего города, если не были загружены ранее,
                    // если уже были подгружены, сбрасываем к стандартным
                    if (!currentCityProjectsFacets || !Object.keys(currentCityProjectsFacets)?.length) {
                        await store.dispatch('projects/fetchFacets', 'currentCity');
                    } else {
                        store.dispatch('projects/setFacets', currentCityProjectsFacets);
                    }

                    // Проверяем наличие проектов текущего города, если не были загружены ранее, добавляем
                    // в очередь на загрузку
                    if (currentCityProjects && !currentCityProjects.length) {
                        store.dispatch('projects/fetchCurrentCityProject', currentCity);
                    }
                } else {
                    // Проверяем наличие всех проектов, если не была загружены ранее, добавляем
                    // в очередь на загрузку
                    if (allProjects && !allProjects.length) {
                        pageRequestPromises.push(store.dispatch('projects/fetchAllProjects'));
                    }

                    // Подгружаем фасеты для всех проектов, если не были загружены ранее
                    if (!allProjectsFacets || !Object.keys(allProjectsFacets)?.length) {
                        allProjectsFacets = await store.dispatch('projects/fetchFacets', 'all');
                    }

                    store.dispatch('projects/setFacets', allProjectsFacets);
                }

                // Отправляем запросы
                const [promoList] = await Promise.all(pageRequestPromises);

                return {
                    promoList: promoList || [],
                    values: initialValues,
                };
            } catch (err) {
                console.warn('[Projects page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                promoList: [],
                type: 'living',
                types: [
                    {
                        value: 'living',
                        label: 'Жилые',
                    },
                    {
                        value: 'commercial',
                        label: 'Коммерческие',
                    },
                ],

                values: {},
                isResetBtnDisabled: true,
                isReloading: false,
            };
        },

        head() {
            return {
                title: 'Строящиеся проекты федерального девелопера Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Строящиеся жилые комплексы от надежного застройщика в ЖК Неометрия',
                }],
            };
        },

        computed: {
            ...mapState({
                currentCity: 'current_city'
            }),

            ...mapState('projects', [
                'allProjects',
                'currentCityProjects',
                'projects',
                'facets',
                'specs',
                'params',
            ]),

            currentProjectsList() {
                const copyInitialValues = JSON.parse(JSON.stringify(defaultValues));
                const copyCurrentValues = JSON.parse(JSON.stringify(this.values));
                delete copyInitialValues.city;
                delete copyCurrentValues.city;

                const isFilterDirty = JSON.stringify(copyInitialValues) !== JSON.stringify(copyCurrentValues);

                return this.projects?.length || isFilterDirty
                    ? this.projects
                    : this.currentCity?.value && this.currentCityProjects?.length
                        ? this.currentCityProjects
                        : this.allProjects;
            },

            optionsSort() {
                return [
                    {
                        value: 'flat_min_price',
                        label: 'По возрастанию',
                        displayName: 'стоимость по возрастанию',
                        group: {
                            value: 'flat_min_price',
                            label: 'Стоимость',
                        },
                    },
                    {
                        value: '-flat_min_price',
                        label: 'По убыванию',
                        displayName: 'стоимость по убыванию',
                        group: {
                            value: 'flat_min_price',
                            label: 'Стоимость',
                        },
                    },
                    {
                        value: 'flat_min_area',
                        label: 'По возрастанию',
                        displayName: 'площадь по возрастанию',
                        group: {
                            value: 'flat_min_area',
                            label: 'Площадь',
                        },
                    },
                    {
                        value: '-flat_min_area',
                        label: 'По убыванию',
                        displayName: 'площадь по убыванию',
                        group: {
                            value: 'flat_min_area',
                            label: 'Площадь',
                        },
                    },
                    {
                        value: 'completion_date',
                        label: 'По возрастанию',
                        displayName: 'срок сдачи по возрастанию',
                        group: {
                            value: 'completion_date',
                            label: 'Срок сдачи',
                        },
                    },
                    {
                        value: '-completion_date',
                        label: 'По убыванию',
                        displayName: 'срок сдачи по убыванию',
                        group: {
                            value: 'completion_date',
                            label: 'Срок сдачи',
                        },
                    },
                ];
            },
        },

        watch: {
            async currentCity(city) {
                this.handleChangeValues({city: city.value});
                this.promoList = await this.$axios.$get(this.$api.publications.promo, {
                    params: {city: city.value},
                });
            },
        },

        created() {
            if (this.currentCity?.value) {
                this.updateUrl();
            }
        },

        mounted() {
            this.isResetBtnDisabled = !Object.values(this.values)
                .some(v => v.length > 0 && v !== 'flat_min_price');
        },

        methods: {
            ...mapActions('projects', [
                'fetchSpecs',
                'fetchFacets',
                'fetchProjects',
                'appendParams',
            ]),

            handleSelect(val) {
                this.type = val;
            },

            async updateValues() {
                this.isReloading = true;
                this.appendParams(this.values);

                await this.fetchFacets();
                await this.fetchProjects();
                this.isReloading = false;
            },

            updateUrl() {
                this.$router.push({path: '/projects', query: serializeValues(this.values)});
            },

            handleChangeValues(values) {
                if (values.price_min) {
                    values.price_min = Math.round(Number(values.price_min) * 1000000);
                }

                if (values.price_max) {
                    values.price_max = Math.round(Number(values.price_max) * 1000000);
                }

                this.values = {
                    ...this.values,
                    ...values,
                };
                this.updateValues();
                this.updateUrl();

                this.isResetBtnDisabled = !Object.values(this.values)
                    .some(v => v.length > 0 && v !== 'flat_min_price');
            },

            handleReset() {
                this.handleChangeValues({...defaultValues});
                this.isResetBtnDisabled = true;
            },

            handleOpenCallModal() {
                const data = {
                    formTitle: 'Заказать консультацию. Не найдены проекты по заданным параметрам',
                    formSource: 'Страница подбора проектов',
                    formComment: clearDoubleSpaces(`
                        Выбранный город: ${this.currentCity?.label || ''};
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
    .ProjectsPage {
        background-color: $base-50;

        .title,
        & :global(.v-select--large .v-select__value) {
            @include respond-to(xs) {
                font-size: 2rem;
                line-height: 2.8rem;
            }
        }
    }

    .ProjectsPageInner {
        background-color: $base-0;
        border-radius: 0 0 1.6rem 1.6rem;
        border-top: 1px solid $base-100;
        padding-bottom: 4rem;

        @include respond-to(sm) {
            padding-bottom: 2.4rem;
        }
    }

    .projectsHeader {
        display: flex;
        justify-content: center;
        padding: 6.4rem 0;

        @include respond-to(sm) {
            padding-bottom: 4rem;
        }

        @include respond-to(xs) {
            padding: 4rem 0 2.4rem;
        }
    }

    .title {
        margin-right: .8rem;
        text-transform: uppercase;
    }
</style>
