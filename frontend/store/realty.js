import {convertToObject} from '~/assets/js/utils/commonUtils';
import {serializeValues} from '~/assets/js/utils/filterUtils';
import {objectToQuery} from '~/assets/js/utils/queryUtils';

export const state = () => ({
    projects: [],
    buildings: [],
    lots: [],
    facets: {},
    specs: {},
    params: {},
});

export const getters = {
    //
};

export const actions = {
    async fetchProjects({commit, state}, type) {
        try {
            const res = await this.$axios.$get(this.$api[type].projects, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
                progress: false,
            });

            const projects = res?.length ? res : [];

            commit('SET_PROJECTS', projects);
        } catch (err) {
            console.warn('[VUEX/fetchProjects] request failed: ', err);
        }
    },

    async fetchBuildings({commit, state}, type) {
        try {
            const res = await this.$axios.$get(this.$api[type].buildings, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
                progress: false,
            });

            const buildings = res?.length ? res : [];
            commit('SET_BUILDINGS', buildings);
        } catch (err) {
            console.warn('[VUEX/fetchBuildings] request failed: ', err);
        }
    },

    async fetchLots({commit, state}, type) {
        try {
            const res = await this.$axios.$get(this.$api[type].list, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
                progress: false,
            });

            const lots = res?.length ? res : [];
            commit('SET_LOTS', lots);
        } catch (err) {
            console.warn('[VUEX/fetchLots] request failed: ', err);
        }
    },

    async fetchSpecs({commit}, type) {
        try {
            const res = await this.$axios.$get(this.$api[type].specs, {
                progress: false,
            });
            const specs = Array.isArray(res) ? convertToObject(res) : res;
            commit('SET_SPECS', specs);
        } catch (e) {
            console.warn('[VUEX/fetchSpecs] projectsSpecs: ', e);
        }
    },

    async fetchFacets({commit, state}, type) {
        try {
            const params = {
                ...state.params,
            };
            delete params['order'];

            const res = await this.$axios.$get(this.$api[type].facets, {
                params: serializeValues(params),
                paramsSerializer: params => objectToQuery(params),
                progress: false,
            });
            const facets = Array.isArray(res.facets) ? convertToObject(res.facets) : res.facets;
            commit('SET_FACETS', facets);
        } catch (err) {
            console.warn('[VUEX/fetchFacets] request failed: ', err);
        }
    },

    appendParams({state, commit}, params) {
        commit('SET_PARAMS', {...state.params, ...params});
    },

    setParams({commit}, params) {
        commit('SET_PARAMS', params);
    },

    removeRealty({commit}) {
        commit('REMOVE_REALTY');
    },
};

export const mutations = {
    SET_PROJECTS(state, payload) {
        state.projects = payload;
    },

    SET_BUILDINGS(state, payload) {
        state.buildings = payload;
    },

    SET_LOTS(state, payload) {
        state.lots = payload;
    },

    SET_FACETS(state, payload) {
        state.facets = payload;
    },

    SET_SPECS(state, payload) {
        state.specs = payload;
    },

    SET_PARAMS(state, payload) {
        state.params = payload;
    },

    REMOVE_REALTY(state) {
        state.projects = []; 
        state.buildings = []; 
        state.lots = []; 
        state.facets = {}; 
        state.specs = {}; 
        state.params = {};
    }
};
