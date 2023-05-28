import {convertToObject} from '~/assets/js/utils/commonUtils';
import {serializeValues} from '~/assets/js/utils/filterUtils';
import {objectToQuery} from '~/assets/js/utils/queryUtils';

export const state = () => ({
    bankList: [],
    lastMortgageFacets: {},
    mortgageFacets: {},
    mortgageSpecs: {},
    offersCount: 0,
    params: {},
    defaultMortgageParams: {},
    mainPageDefaultMortgageParams: null,
});

export const getters = {
    sortedBankList(state) {
        function splitOffers(offers) {
            function checkSubsidy(item) {
                return Boolean(item?.is_deposit_subsidy || item?.is_max_monthly_amount_subsidy || item?.is_rate_subsidy);
            }

            function checkHero(item) {
                return item?.is_active && item?.calculation_type === 'fixedPrepaymentAmount' && !item?.subsidy_period;
            }

            try {
                const {defaultHeroItem, subsidyHeroItem, defaultList, subsidyList} = offers.reduce((res, offer) => {
                    if (offer?.subsidy_period) {
                        return res;
                    }

                    const isSubsidy = checkSubsidy(offer);
                    const isHero = checkHero(offer);

                    if (isHero) {
                        res[isSubsidy ? 'subsidyHeroItem' : 'defaultHeroItem'] = offer;
                    }

                    if (isSubsidy) {
                        res.subsidyList.push(offer);
                    } else {
                        res.defaultList.push(offer);
                    }

                    return res;
                }, {
                    defaultHeroItem: null,
                    subsidyHeroItem: null,
                    defaultList: [],
                    subsidyList: [],
                });

                const res = [];
                const defaultItem = defaultList?.length ? {...defaultHeroItem || defaultList[0], list: defaultList} : null;
                const subsidyItem = subsidyList?.length ? {...subsidyHeroItem || subsidyList[0], list: subsidyList} : null;

                if (subsidyItem) {
                    res.push(subsidyItem);
                }

                if (defaultItem) {
                    res.push(defaultItem);
                }

                return res;
            } catch (e) {
                console.error(e);
            }
        }

        const bankListCopy = JSON.parse(JSON.stringify(state.bankList));

        bankListCopy.forEach(bank => {
            bank.offers = splitOffers(bank.offers) || bank.offers;
        });

        return bankListCopy;
    }
};

export const actions = {
    async fetchBanks({commit, state}) {
        commit('SET_OFFERS_COUNT', 0);
        commit('SET_BANK_LIST', []);

        try {
            const res = await this.$axios.$get(`${this.$api.mortgage.calc}`, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
            });
            if (!Array.isArray(res)) {
                return;
            }

            commit('SET_OFFERS_COUNT', res.length);
            commit('SET_BANK_LIST', res);
        } catch (err) {
            console.warn('[VUEX/mortgage/fetchBanks] request failed: ', err);
        }
    },

    async fetchMortgageSpecs({commit}) {
        try {
            const res = await this.$axios.$get(this.$api.mortgage.specs);
            const specs = Array.isArray(res) ? convertToObject(res) : res;
            commit('SET_SPECS', specs);
            return specs;
        } catch (e) {
            console.warn('[VUEX/mortgage/fetchSpecs] flatsSpecs: ', e);
        }
    },

    async fetchMortgageFacets({commit, state}) {
        try {
            const params = {projects: state.params?.developmentprojectSlug};
            const res = await this.$axios.$get(this.$api.mortgage.facets, {
                params: serializeValues(params),
                paramsSerializer: params => objectToQuery(params),
            });
            commit('SET_LAST_FACETS', {...state.mortgageFacets});
            const facets = Array.isArray(res.facets) ? convertToObject(res.facets) : res.facets;
            commit('SET_FACETS', facets);
            return facets;
        } catch (err) {
            console.warn('[VUEX/mortgage/fetchFacets] request failed: ', err);
        }
    },

    appendMortgageParams({state, commit}, params) {
        commit('SET_PARAMS', {...state.params, ...params});
    },

    setMortgageParams({commit}, params) {
        commit('SET_PARAMS', params);
    },

    setMainPageDefaultMortgageParams({commit, state}) {
        const specs = state.mortgageSpecs;
        const defaultMortgageParams = {
            developmentprojectSlug: specs.projects[0].value,
            mortgageType: specs.program[0].value,
            cost: specs.property_price?.min.toString(),
            initialPayment: Math.ceil(specs.property_price?.min * 0.15).toString(),
            creditPeriod: '30',
        };

        commit('SET_MAIN_PAGE_DEFAULT_MORTGAGE_PARAMS', defaultMortgageParams);
    },

    setDefaultMortgageParams({commit, state}, params) {
        const specs = state.mortgageSpecs;
        const defaultMortgageParams = {
            developmentprojectSlug: params?.developmentprojectSlug || specs.projects[0].value,
            mortgageType: params?.mortgageType || specs.program[0].value,
            cost: (params?.cost || specs.property_price?.min).toString(),
            initialPayment: Math.ceil((params?.cost || specs.property_price?.min) * 0.15).toString(),
            creditPeriod: params?.creditPeriod || '30',
        };

        commit('SET_DEFAULT_MORTGAGE_PARAMS', defaultMortgageParams);
    },

    setSortBanksValue({commit}, params) {
        commit('SET_SORT_BANKS_VALUE', params);
    }
};

export const mutations = {
    SET_BANK_LIST(state, payload) {
        state.bankList = payload;
    },

    SET_FACETS(state, payload) {
        state.mortgageFacets = payload;
    },

    SET_LAST_FACETS(state, payload) {
        state.lastMortgageFacets = payload;
    },

    SET_OFFERS_COUNT(state, payload) {
        state.offersCount = payload;
    },

    SET_SPECS(state, payload) {
        state.mortgageSpecs = payload;
    },

    SET_PARAMS(state, payload) {
        state.params = payload;
    },

    SET_SORT_BANKS_VALUE(state, payload) {
        state.sortBanksValue = payload;
    },

    SET_DEFAULT_MORTGAGE_PARAMS(state, payload) {
        state.defaultMortgageParams = payload;
    },

    SET_MAIN_PAGE_DEFAULT_MORTGAGE_PARAMS(state, payload) {
        state.mainPageDefaultMortgageParams = payload;
    },
};
