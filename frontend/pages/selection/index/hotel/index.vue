<template>
    <div :class="$style.HotelPage">
        <RealtySelection :items="projects"
                         realty-type="hotelrooms"
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
        name: 'SelectionHotelPage',

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
                    await app.store.dispatch('realty/fetchLots', 'hotelrooms');
                    stage = 'floors';
                } else if (initialValues.project) {
                    await app.store.dispatch('realty/fetchBuildings', 'hotelrooms');
                    stage = 'buildings';
                } else {
                    await app.store.dispatch('realty/fetchProjects', 'hotelrooms');
                    stage = 'projects';
                }

                // await Promise.all([
                //     app.store.dispatch('realty/fetchFacets', 'hotelrooms'),
                //     app.store.dispatch('realty/fetchSpecs', 'hotelrooms'),
                // ]);

                return {
                    values: initialValues,
                    activeStage: stage,
                };
            } catch (err) {
                console.warn('[Hotel page/asyncData] request failed: ', err);
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
                title: 'Выбрать гостиничные номера | Федеральный девелопер Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Выбор гостиничных номеров от официального застройщика СК "Неометрия". 8 800 777-40-93',
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

                await this.fetchFacets('hotelrooms');

                if (this.values.building) {
                    await this.fetchLots('hotelrooms');
                    this.activeStage = 'floors';
                } else if (this.values.project) {
                    await this.fetchBuildings('hotelrooms');
                    this.activeStage = 'buildings';
                } else {
                    await this.fetchProjects('hotelrooms');
                    this.activeStage = 'projects';
                }
                this.isReloading = false;
            },

            updateUrl() {
                this.$router.push({path: '/selection/hotel', query: serializeValues(this.values)});
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
    .HotelPage {
        padding-bottom: 3.2rem;
    }
</style>
