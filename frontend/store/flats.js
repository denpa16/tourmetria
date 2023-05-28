import {convertToObject} from '~/assets/js/utils/commonUtils';
import {serializeValues} from '~/assets/js/utils/filterUtils';
import {objectToQuery} from '~/assets/js/utils/queryUtils';

export const state = () => ({
    flatList: [],
    facets: {},
    specs: {},
    flatsCount: 0,
    firstPaginationStepUrl: '',
    params: {},
});

export const getters = {};

export const actions = {
    async fetchFlats({commit, state}) {
        try {
            const res = await this.$axios.$get(`${this.$api.flats.list}`, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
            });

            const flatList = res.results?.length ? [...res.results] : [];

            commit('SET_FLATS', flatList);
            commit('SET_FIRST_PAGINATION_STEP_URL', res.next);
        } catch (err) {
            console.warn('[VUEX/flats/fetchFlats] request failed: ', err);
        }
    },

    async fetchSpecs({commit}) {
        try {
            const res = await this.$axios.$get(this.$api.flats.specs);
            const specs = Array.isArray(res) ? convertToObject(res) : res;
            commit('SET_SPECS', specs);
        } catch (e) {
            console.warn('[VUEX/flats/fetchSpecs] flatsSpecs: ', e);
        }
    },

    async fetchFacets({commit, state}) {
        try {
            const res = await this.$axios.$get(this.$api.flats.facets, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
            });
            commit('SET_FLATS_COUNT', res.count);
            const facets = Array.isArray(res.facets) ? convertToObject(res.facets) : res.facets;
            commit('SET_FACETS', facets);
        } catch (err) {
            console.warn('[VUEX/flats/fetchFacets] request failed: ', err);
        }
    },

    appendParams({commit}, params) {
        params.floorTabs = [];
        commit('SET_PARAMS', {...params});
    },

    setParams({commit}, params) {
        commit('SET_PARAMS', params);
    },
};

export const mutations = {
    SET_FLATS(state, payload) {
        state.flatList = payload;
    },

    SET_FACETS(state, payload) {
        state.facets = JSON.parse(JSON.stringify(payload));
    },

    SET_FLATS_COUNT(state, payload) {
        state.flatsCount = payload;
    },

    SET_FIRST_PAGINATION_STEP_URL(state, payload) {
        state.firstPaginationStepUrl = payload;
    },

    SET_SPECS(state, payload) {
        state.specs = JSON.parse(JSON.stringify(payload));
    },

    SET_PARAMS(state, payload) {
        state.params = payload;
    },
};
