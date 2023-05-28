<template>
    <div :class="$style.CommercialPage">
        <RealtySelection :items="projects"
                         realty-type="commercials"
                         :specs="specs"
                         :facets="facets"
                         :values="values"
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
    import {mapActions, mapState} from 'vuex';
    import {serializeValues} from '~/assets/js/utils/filterUtils';

    import RealtySelection from '~/components/pages/selection/realty/RealtySelection';

    const defaultValues = {
        city: '',
        area_min: '',
        area_max: '',
        price_min: '',
        price_max: '',
        completion_date: '',
        has_promotions: false,
        order: '',
        project: '',
        building: '',
    };

    export default {
        name: 'SelectionCommercialPage',

        components: {
            RealtySelection,
        },

        props: {},

        async asyncData({app, query}) {
            try {
                const initialValues = {
                    ...defaultValues,
                    ...query,
                };

                await app.store.dispatch('realty/setParams', initialValues);
                let stage;

                if (initialValues.building) {
                    await app.store.dispatch('realty/fetchLots', 'commercials');
                    stage = 'floors';
                } else if (initialValues.project) {
                    await app.store.dispatch('realty/fetchBuildings', 'commercials');
                    stage = 'buildings';
                } else {
                    await app.store.dispatch('realty/fetchProjects', 'commercials');
                    stage = 'projects';
                }

                // await Promise.all([
                //     app.store.dispatch('realty/fetchFacets', 'commercials'),
                //     app.store.dispatch('realty/fetchSpecs', 'commercials'),
                // ]);

                return {
                    values: initialValues,
                    activeStage: stage,
                };
            } catch (err) {
                console.warn('[Commercial page/asyncData] request failed: ', err);
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
                title: 'Выбрать коммерческие помещения | Федеральный девелопер Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Коммерческие помещения от официального застройщика СК "Неометрия". Продажа коммерческих помещений под салоны красоты, спортзалы и любые другие цели',
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

                await this.fetchFacets('commercials');

                if (this.values.building) {
                    await this.fetchLots('commercials');
                    this.activeStage = 'floors';
                } else if (this.values.project) {
                    await this.fetchBuildings('commercials');
                    this.activeStage = 'buildings';
                } else {
                    await this.fetchProjects('commercials');
                    this.activeStage = 'projects';
                }
                this.isReloading = false;
            },

            updateUrl() {
                this.$router.push({path: '/selection/commercial', query: serializeValues(this.values)});
            },

            handleChangeValues(values) {
                this.values = {
                    ...this.values,
                    ...values,
                };
                this.updateValues();
                this.updateUrl();

                this.isResetBtnDisabled = !Object.values(this.values)
                    .some(v => v.length > 0);
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
    .CommercialPage {
        padding-bottom: 3.2rem;
    }
</style>
