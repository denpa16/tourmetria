<template>
    <div :class="$style.StoragePage">
        <!--        todo Заменить у @card-click на handleChangeValues(values), когда лоты будут загружены из crm. Пока при клике на карточку проекта - редирект на старый сайт-->
        <RealtySelection :items="cards"
                         realty-type="storage"
                         :specs="specs"
                         :facets="facets"
                         :values="values"
                         :sort-options="sortOptions"
                         :projects-count="projects.length"
                         :buildings-count="buildings.length"
                         :lots-count="lots.length"
                         :is-reset-btn-disabled="isResetBtnDisabled"
                         :is-reloading="isReloading"
                         :active-stage="activeStage"
                         @change="handleChangeValues"
                         @clear-filter="handleChangeValues"
                         @card-click="handleCardClick"
                         @reset="handleReset" />
    </div>
</template>

<script>
    import RealtySelection from '~/components/pages/selection/realty/RealtySelection';
    import {mapActions, mapState} from 'vuex';
    import {serializeValues} from '~/assets/js/utils/filterUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    const defaultValues = {
        city: '',
        area_min: '',
        area_max: '',
        price_min: '',
        price_max: '',
        completion_date: '',
        has_promotions: false,
        order: 'storage_min_price',
        project: '',
        building: '',
    };

    export default {
        name: 'StoragePage',

        components: {
            RealtySelection,
        },

        mixins: [breakpointCheck],

        async asyncData({app, query}) {
            try {
                const initialValues = {
                    ...defaultValues,
                    ...query,
                };

                await app.store.dispatch('realty/setParams', initialValues);
                let stage;

                if (initialValues.building) {
                    await app.store.dispatch('realty/fetchLots', 'storage');
                    stage = 'floors';
                } else if (initialValues.project) {
                    await app.store.dispatch('realty/fetchBuildings', 'storage');
                    stage = 'buildings';
                } else {
                    await app.store.dispatch('realty/fetchProjects', 'storage');
                    stage = 'projects';
                }

                await Promise.all([
                    app.store.dispatch('realty/fetchFacets', 'storage'),
                    app.store.dispatch('realty/fetchSpecs', 'storage'),
                ]);

                return {
                    values: initialValues,
                    activeStage: stage,
                };
            } catch (err) {
                console.warn('[Parking page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                values: {},
                isResetBtnDisabled: true,
                isReloading: false,
                activeStage: 'projects',
            };
        },

        head() {
            return {
                title: 'Выбрать кладовые | Федеральный девелопер Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Выбор кладовых от официального застройщика СК "Неометрия". 8 800 777-40-93',
                }],
            };
        },

        computed: {
            ...mapState('realty', [
                'projects',
                'buildings',
                'lots',
                'facets',
                'specs',
                'params',
            ]),

            sortOptions() {
                const getDisplayName = displayName => this.breakpoint === 'xs' ? 'Сортировка' : displayName;
                return [
                    {
                        value: 'storage_min_price',
                        label: 'По возрастанию',
                        displayName: getDisplayName('стоимость по возрастанию'),
                        group: {
                            value: 'storage_min_price',
                            label: 'Стоимость',
                        },
                    },
                    {
                        value: '-storage_min_price',
                        label: 'По убыванию',
                        displayName: getDisplayName('стоимость по убыванию'),
                        group: {
                            value: 'storage_min_price',
                            label: 'Стоимость',
                        },
                    },
                    {
                        value: 'storage_min_area',
                        label: 'По возрастанию',
                        displayName: getDisplayName('площадь по возрастанию'),
                        group: {
                            value: 'storage_min_area',
                            label: 'Площадь',
                        },
                    },
                    {
                        value: '-storage_min_area',
                        label: 'По убыванию',
                        displayName: getDisplayName('площадь по убыванию'),
                        group: {
                            value: 'storage_min_area',
                            label: 'Площадь',
                        },
                    },
                    {
                        value: 'completion_date',
                        label: 'По возрастанию',
                        displayName: getDisplayName('срок сдачи по возрастанию'),
                        group: {
                            value: 'completion_date',
                            label: 'Срок сдачи',
                        },
                    },
                    {
                        value: '-completion_date',
                        label: 'По убыванию',
                        displayName: getDisplayName('срок сдачи по убыванию'),
                        group: {
                            value: 'completion_date',
                            label: 'Срок сдачи',
                        },
                    },
                ];
            },

            cards() {
                if (this.values.project) {
                    return this.buildings;
                }
                return this.projects;
            },
        },

        methods: {
            ...mapActions('realty', [
                'fetchSpecs',
                'fetchFacets',
                'fetchProjects',
                'fetchBuildings',
                'fetchLots',
                'appendParams',
            ]),

            async updateValues() {
                this.isReloading = true;
                this.appendParams(this.values);

                await this.fetchFacets('storage');

                if (this.values.building) {
                    await this.fetchLots('storage');
                    this.activeStage = 'floors';
                } else if (this.values.project) {
                    await this.fetchBuildings('storage');
                    this.activeStage = 'buildings';
                } else {
                    await this.fetchProjects('storage');
                    this.activeStage = 'projects';
                }
                this.isReloading = false;
            },

            updateUrl() {
                this.$router.push({path: '/selection/storage', query: serializeValues(this.values)});
            },

            handleChangeValues(values) {
                this.values = {
                    ...this.values,
                    ...values,
                };
                this.updateValues();
                this.updateUrl();

                this.isResetBtnDisabled = !Object.values(this.values)
                    .some(v => v.length > 0 && v !== 'storage_min_price');
            },

            handleReset() {
                this.handleChangeValues({...defaultValues});
                this.isResetBtnDisabled = true;
            },

            handleCardClick(val) {
                // Заменить на метод handleChangeValues(values), когда лоты будут загружены из crm (и в RealtyProjectCard расскомментировать код в методе handleClick).
                // Пока при клике на карточку проекта - редирект на старый сайт
                window.open(val);
            }
        },
    };
</script>

<style lang="scss" module>
    .StoragePage {
        padding-bottom: 10.4rem;

        @include respond-to(sm) {
            padding-bottom: 6.4rem;
        }
    }
</style>
