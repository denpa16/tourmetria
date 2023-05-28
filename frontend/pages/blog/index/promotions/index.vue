<template>
    <section :class="$style.PromotionsPage">
        <div :class="[$style.filtersWrapper, 'container']">
            <VSelect
                :value="values.projects"
                :options="projectOptions"
                apply-facets
                :facet="facets.projects"
                :class="$style.filterItem"
                placeholder="Проект"
                modal-breakpoint="xs"
                modal-title="Проект"
                bordered
                multiple
                clear-btn
                @clear-filter="onProjectInput([])"
                @input="onProjectInput"
            />
            <transition name="fade-content">
                <VButton v-if="values && values.flat"
                         :class="$style.flatFilterBtn"
                         color="primary"
                         @click="resetFlatFilter">
                    Смотреть все акции
                </VButton>
            </transition>

            <p :class="[$style.promotionsCounter, 'p6','c-base300']">
                {{ promotionsCounterText }}
            </p>
        </div>
        <transition name="fade-content"
                    mode="out-in">
            <div v-if="promotionListToShow && promotionListToShow.length"
                 :class="[$style.promotionsWrapper, 'container']">
                <ul :class="$style.promotionList">
                    <li
                        v-for="promotion in promotionListToShow"
                        :key="promotion.id"
                        :class="$style.promotionItem"
                    >
                        <PromotionCard :promotion="promotion"
                                       :preferred-project-slug="preferredProjectSlug" />
                    </li>
                </ul>
                <VButton
                    v-if="morePromotionsCounter > 0 && isAllPromotionsShown"
                    :class="$style.morePromotionsButton"
                    color="light"
                    @click="onMoreButtonClick"
                >
                    {{ moreButtonText }}
                </VButton>
            </div>

            <div v-else>
                <div :class="$style.emptyBlock">
                    <p :class="['h4', 'c-base300', $style.emptyText]">
                        {{ notFoundText.firstLine }}
                    </p>
                    <p :class="['h4', $style.emptyText]">
                        {{ notFoundText.secondLine }}
                    </p>
                </div>
            </div>
        </transition>
    </section>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import {convertToObject} from '~/assets/js/utils/commonUtils';
    import {plural} from '~/assets/js/utils/textUtils';
    import {serializeValues} from '~/assets/js/utils/filterUtils';
    import {objectToQuery} from '~/assets/js/utils/queryUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import PromotionCard from '~/components/common/promotions/PromotionCard';
    import VButton from '~/components/ui/buttons/VButton';

    export default {
        name: 'PromotionsPage',
        components: {VButton, PromotionCard},
        mixins: [breakpointCheck],
        props: {},
        async asyncData({app, query, store}) {
            const currentCity = store.state?.current_city?.value;
            const initialValues = {
                projects: query.projects?.length ? query.projects.split(',') : [],
            };
            const cityParam = {};

            if (!query.city && currentCity) {
                cityParam.city = currentCity;
            }

            try {
                const [
                    specs,
                    facets,
                    promotionList
                ] = await Promise.all([
                    app.$axios.$get(app.$api.publications.specs),
                    app.$axios.$get(app.$api.publications.facets, {
                        params: {
                            ...query,
                            type: 'promotion',
                            ...cityParam,
                        }
                    }),
                    app.$axios.$get(app.$api.publications.promo, {
                        params: {
                            ...query,
                            ...cityParam,
                        }
                    }),
                ]);

                const specsObject = Array.isArray(specs) ? convertToObject(specs) : specs;
                const facetsObject = Array.isArray(facets?.facets) ? convertToObject(facets?.facets) : facets?.facets;
                const promotionsCounter = facets?.count;

                return {
                    specs: specsObject || {},
                    facets: facetsObject || {},
                    promotionsCounter: promotionsCounter || 0,
                    promotionList: promotionList || [],
                    values: initialValues
                };
            } catch (err) {
                console.warn('[Project page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                values: {},
                specs: {},
                facets: {},
                promotionsCounter: 0,
                promotionList: [],
                isAllPromotionsShown: false
            };
        },

        head() {
            return {
                title: 'Акции федерального девелопера Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Акции строительной компании Неометрия . Актуальная информация о строящихся ЖК города ',
                }],
            };
        },

        computed: {
            ...mapState('projects', {projectsWithCity: 'projectsOptions'}),
            ...mapGetters({currentCity: 'getCurrentCity'}),

            projectOptions() {
                return this.specs.projects?.promotion_projects;
            },

            preferredProjectSlug() {
                if (!this.currentCity?.value) {
                    return '';
                }

                return this.projectsWithCity.reduce((res, project) => {
                    if (project?.city === this.currentCity.value) {
                        res.push(project.slug);
                    }

                    return res;
                }, []);
            },

            promotionListToShow() {
                if (this.isAllPromotionsShown) {
                    return this.promotionList;
                }

                if (this.breakpoint === 'xs') {
                    return this.promotionList.slice(0, 7);
                } else if (this.breakpoint === 'sm') {
                    return this.promotionList.slice(0, 6);
                }
                return this.promotionList.slice(0, 9);
            },

            promotionsCounterText() {
                return `${this.promotionsCounter} ${plural(this.promotionsCounter, ['акция', 'акции', 'акций'])}`;
            },

            morePromotionsCounter() {
                if (this.breakpoint === 'xs') {
                    return this.promotionsCounter - 7;
                } else if (this.breakpoint === 'sm') {
                    return this.promotionsCounter - 6;
                }
                return this.promotionsCounter - 9;
            },

            moreButtonText() {
                const promotionsCounter = `${this.morePromotionsCounter} ${plural(this.morePromotionsCounter, ['акция', 'акции', 'акций'])}`;
                const desktopText = `+ ${promotionsCounter}`;
                const adaptiveText = `Смотреть ещё ${promotionsCounter}`;

                return ['sm', 'xs'].includes(this.breakpoint) ? adaptiveText : desktopText;
            },

            notFoundText() {
                if (Object.keys(this.$route.query).length) {
                    return {
                        firstLine: 'По заданным параметрам пока нет действующих акций',
                        secondLine: 'Попробуйте зайти позже или изменить параметры',
                    };
                }

                if (this.values?.projects?.length) {
                    return {
                        firstLine: 'По выбранному проекту пока нет действующих акций',
                        secondLine: 'Попробуйте выбрать другой проект',
                    };
                }

                if (this.currentCity?.value) {
                    return {
                        firstLine: 'В вашем городе пока нет действующих акций',
                        secondLine: 'Попробуйте зайти позже или изменить город',
                    };
                }

                return {
                    firstLine: 'По заданным параметрам пока нет действующих акций',
                    secondLine: 'Попробуйте зайти позже или изменить параметры',
                };
            }
        },

        methods: {
            async fetchPromotions() {
                try {
                    const res = await this.$axios.$get(this.$api.publications.promo, {
                        params: serializeValues(this.values),
                        paramsSerializer: params => objectToQuery(params),
                    });

                    this.promotionList = res?.length ? res : [];
                } catch (err) {
                    console.warn('[PromotionsPage/fetchPromotions] request failed: ', err);
                }
            },

            async fetchFacets() {
                try {
                    const res = await this.$axios.$get(this.$api.publications.facets, {
                        params: serializeValues(this.values),
                        paramsSerializer: params => objectToQuery(params),
                    });
                    this.facets = Array.isArray(res.facets) ? convertToObject(res.facets) : res.facets;
                    this.promotionsCounter = res?.count_promos;
                } catch (err) {
                    console.warn('[PromotionsPage/fetchFacets] request failed: ', err);
                }
            },

            updateUrl() {
                this.$router.push({path: '/blog/promotions', query: serializeValues(this.values)});
            },

            onProjectInput(val) {
                this.values.projects = val;
                if (this.currentCity?.value) {
                    this.values.city = this.currentCity.value;
                }

                this.updateUrl();
                this.fetchFacets();
                this.fetchPromotions();
            },

            resetFlatFilter() {
                this.values.flat = '';

                this.updateUrl();
                this.fetchFacets();
                this.fetchPromotions();
            },

            onMoreButtonClick() {
                this.isAllPromotionsShown = true;
            }
        },
    };
</script>

<style lang="scss" module>
    .PromotionsPage {
        padding-bottom: 7.2rem;

        @include respond-to(sm) {
            padding-bottom: 4.8rem;
        }

        @include respond-to(xs) {
            padding-bottom: 4rem;
        }
    }

    .filtersWrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 2.4rem;
        padding-top: 1.2rem;
        padding-bottom: 1.2rem;
        border-bottom: 1px solid $base-100;

        @include respond-to(xs) {
            margin-bottom: 1.6rem;
        }

        .filterItem {
            @include respond-to(sm) {
                width: 100%;
            }
        }
    }

    .flatFilterBtn {
        margin-right: auto;
        margin-left: 1.6rem;
    }

    .promotionsCounter {
        @include respond-to(sm) {
            display: none;
        }
    }

    .promotionsWrapper {
        display: flex;
        flex-direction: column;

        .morePromotionsButton {
            width: fit-content;
            margin: 6.4rem auto 0;

            @include respond-to(sm) {
                width: 100%;
                margin: 1.6rem 0 0;
            }

            @include respond-to(sm) {
                margin: 1.2rem 0 0;
            }
        }
    }

    .promotionList {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1.6rem;

        @include respond-to(sm) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include respond-to(xs) {
            grid-template-columns: initial;
            grid-gap: 1.2rem;
        }
    }

    .promotionItem {
        height: 58.3rem;

        @include respond-to(sm) {
            height: 52.6rem;
        }

        @include respond-to(xs) {
            height: 20.6rem;
        }
    }

    .emptyBlock {
        padding: 15rem 0 19.2rem 0;
        text-align: center;

        @include respond-to(sm) {
            padding: 18.4rem 0 15.2rem 0;
        }

        @include respond-to(sm) {
            padding: 8rem 0 8rem 0;
        }
    }

    .emptyText {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.6rem;
        }
    }
</style>
