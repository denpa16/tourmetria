<template>
    <div :class="$style.HomePage"
         class="page">
        <HomeHero
            :slides="mainPage.main_page_slides"
            @scroll-to="scrollToProjects"
        />
        <HomeProjects id="projects"
                      :projects="currentProjectsList"
                      :promo-list="currentCity.value ? cityPromoList : mainPage.promotions"
                      :values="projectsValues"
                      :specs="specs"
                      :facets="facets"
                      :is-reset-btn-disabled="isResetBtnDisabled"
                      :is-reloading="isReloading"
                      main-page
                      @change="handleChangeValues"
                      @reset="handleReset"
                      @clear-filter="handleChangeValues"
        />
        <MortgageBlock :title="mainPage.title_mortgage" />
        <PaymentBlock
            :payments-list="mainPage.purchases"
            :count="mainPage.purchases_count"
        />
        <HomeAbout :about-company="aboutCompany" />
        <HomeMission :block-info="mainPage.mission_block" />
        <HomeGeography
            :title="mainPage.title_geography"
            :district-image="mainPage.geography_image_display"
            :district-preview="mainPage.geography_image_preview"
            :image-width="mainPage.geography_image_width"
            :image-height="mainPage.geography_image_height"
            :regions="mainPage.regions"
        />
        <PromotionsBlock
            :promo-list="mainPage.promotions"
            :promo-count="mainPage.promotions_count"
        />
        <FormSubscribe />
        <CareBlock
            :blocks="mainPage.neoblock_slides"
        />
        <NewsBlock
            :news-list="newsList"
            :specs="newsSpecs"
            :class="$style.news"
            @change="filterNews"
        />
    </div>
</template>

<script>
    import {convertToObject, scrollTo} from '~/assets/js/utils/commonUtils';
    import {mapActions, mapState} from 'vuex';

    // Components
    const HomeHero = () => import('~/components/pages/home/HomeHero');
    const HomeProjects = () => import('~/components/pages/home/HomeProjects');
    const PaymentBlock = () => import('~/components/common/payment/PaymentBlock');
    const HomeAbout = () => import('~/components/pages/home/HomeAbout');
    const CareBlock = () => import('~/components/common/care/CareBlock');
    const NewsBlock = () => import('~/components/common/news/NewsBlock');
    const PromotionsBlock = () => import('~/components/common/promotions/PromotionsBlock');
    const MortgageBlock = () => import('~/components/common/mortgage/MortgageBlock');
    const FormSubscribe = () => import('~/components/common/forms/FormSubscribe');
    const HomeMission = () => import('~/components/pages/home/HomeMission');
    const HomeGeography = () => import('~/components/pages/home/geography/HomeGeography');

    const projectsValues = {
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
        name: 'HomePage',

        components: {
            HomeHero,
            HomeProjects,
            PaymentBlock,
            HomeAbout,
            CareBlock,
            NewsBlock,
            PromotionsBlock,
            HomeMission,
            MortgageBlock,
            FormSubscribe,
            HomeGeography,
        },

        async asyncData({app, store}) {
            try {
                // Город
                const currentCity = store.state?.current_city;
                const currentCityValue = currentCity?.value;
                // Проекты текущего города
                const currentCityProjects = store.state?.projects?.currentCityProjects;
                const currentCityProjectsFacets = store.state?.projects?.currentCityProjectsFacets;
                // Все проекты
                const projectsSpecs = store.state?.projects?.specs;
                const allProjects = store.state?.projects?.allProjects;
                const allProjectsFacets = store.state?.projects?.allProjectsFacets;

                // Список запросов страницы, здесь заданы постоянные запросы
                // при каждой загрузке страницы
                const pageRequestPromises = [
                    app.$axios.$get(app.$api.mainPage),
                    app.$axios.$get(app.$api.companyPage.about),
                    app.$axios.$get(app.$api.publications.specs),
                ];

                // ПРОЕКТЫ
                // Подгружаем спеки для проектов, если не были загружены ранее
                if (!projectsSpecs || !Object.keys(projectsSpecs)?.length) {
                    store.dispatch('projects/fetchSpecs');
                }

                if (currentCityValue) {
                    // Добавляем запрос акций для текущего города
                    pageRequestPromises.push(app.$axios.$get(app.$api.publications.promo, {
                        params: {city: currentCityValue},
                    }));

                    // Если город был выбран пользователем, добавляем его в параметры запроса проектов
                    projectsValues.city = currentCityValue;

                    // Подгружаем фасеты для проектов текущего города, если не были загружены ранее,
                    // если уже были подгружены, сбрасываем к стандартным
                    if (!currentCityProjectsFacets || !Object.keys(currentCityProjectsFacets)?.length) {
                        store.dispatch('projects/fetchFacets', 'currentCity');
                    } else {
                        store.dispatch('projects/setFacets', currentCityProjectsFacets);
                    }

                    // Если выбран конкретнный город и не загружены под него проекты, запускаем загрузку
                    if (currentCityValue && !currentCityProjects?.length) {
                        store.dispatch('projects/fetchCurrentCityProject', currentCity);
                    }
                } else {
                    // Проверяем наличие всех проектов, если не была загружены ранее, добавляем
                    // в очередь на загрузку
                    if (allProjects && !allProjects.length) {
                        pageRequestPromises.push(store.dispatch('projects/fetchAllProjects'));
                    }
                    // Подгружаем фасеты для всех проектов, если не были загружены ранее,
                    // если уже были подгружены, сбрасываем к стандартным
                    if (!allProjectsFacets || !Object.keys(allProjectsFacets)?.length) {
                        store.dispatch('projects/fetchFacets', 'all');
                    } else {
                        store.dispatch('projects/setFacets', allProjectsFacets);
                    }
                }

                // Сбрасываем параметры проектов и чистим отфильтрованные проекты
                store.dispatch('projects/setParams', projectsValues);
                store.dispatch('projects/clearProjects');

                // Отправляем все сформированные запросы
                const [
                    pageRes,
                    aboutCompany,
                    newsSpecsRes,
                    cityPromoRes,
                ] = await Promise.all(pageRequestPromises);

                const newsSpecs = Array.isArray(newsSpecsRes) ? convertToObject(newsSpecsRes) : newsSpecsRes;

                return {
                    mainPage: pageRes ? pageRes : {},
                    aboutCompany: aboutCompany || {},
                    newsSpecs: newsSpecs || {},
                    newsList: pageRes?.news ? pageRes?.news : [],
                    cityPromoList: cityPromoRes || [],
                    projectsValues,
                };
            } catch (err) {
                console.warn('[Main page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                mainPage: {},
                cityPromoList: [],
                aboutCompany: {},
                newsSpecs: {},
                projectsValues: {},
                newsList: [],

                isResetBtnDisabled: true,
                isReloading: false,
            };
        },

        computed: {
            ...mapState({
                currentCity: 'current_city',
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
                const copyInitialValues = JSON.parse(JSON.stringify(projectsValues));
                const copyCurrentValues = JSON.parse(JSON.stringify(this.projectsValues));
                delete copyInitialValues.city;
                delete copyCurrentValues.city;

                const isFilterDirty = JSON.stringify(copyInitialValues) !== JSON.stringify(copyCurrentValues);

                return this.projects?.length || isFilterDirty
                    ? this.projects
                    : this.currentCity?.value && this.currentCityProjects?.length
                        ? this.currentCityProjects
                        : this.allProjects;
            }
        },

        watch: {
            async currentCity(city) {
                this.handleChangeValues({city: city.value});
                this.cityPromoList = await this.$axios.$get(this.$api.publications.promo, {
                    params: {city: city.value},
                });
            },
        },

        methods: {
            ...mapActions('projects', [
                'fetchSpecs',
                'fetchFacets',
                'fetchProjects',
                'appendParams',
            ]),

            scrollToProjects() {
                scrollTo('projects', 80);
            },

            async filterNews(project) {
                try {
                    this.newsList = await this.$axios.$get(this.$api.publications.latestProjectNews(project));
                } catch (err) {
                    console.warn('[Main page/News] request failed: ', err);
                }
            },

            async updateValues() {
                this.isReloading = true;
                this.appendParams(this.projectsValues);

                await this.fetchFacets();
                await this.fetchProjects();
                this.isReloading = false;
            },

            handleChangeValues(values) {
                if (values.price_min) {
                    values.price_min = Math.round(Number(values.price_min) * 1000000);
                }

                if (values.price_max) {
                    values.price_max = Math.round(Number(values.price_max) * 1000000);
                }

                this.projectsValues = {
                    ...this.projectsValues,
                    ...values,
                };
                this.updateValues();

                this.isResetBtnDisabled = !Object.values(this.projectsValues)
                    .some(v => v.length > 0);
            },

            handleReset() {
                this.handleChangeValues({...projectsValues});
                this.isResetBtnDisabled = true;
            },
        },
    };
</script>

<style lang="scss" module>
    .HomePage {
        //
    }

    .news {
        &:global(.container) {
            padding: 6.4rem 10.5rem;

            @include respond-to(sm) {
                padding: 6.4rem 2.4rem;
            }

            @include respond-to(xs) {
                padding: 4rem 0 2.4rem;
            }
        }
    }
</style>
