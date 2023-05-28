import {convertToObject} from '~/assets/js/utils/commonUtils';
import {serializeValues} from '~/assets/js/utils/filterUtils';
import {objectToQuery} from '~/assets/js/utils/queryUtils';

export const state = () => ({
    projectsOptions: [],
    allProjects: [],
    currentCityProjects: [],
    projects: [],
    params: {},
    specs: {},
    facets: {},
    allProjectsFacets: {},
    currentCityProjectsFacets: {},
});

export const getters = {
    getProjectsList(state) {
        return state.projectsOptions.map(el => ({
            name: el.name,
            to: `/${el.city}/complex-${el.slug}`,
        })) || [];
    },
};

export const actions = {
    async fetchProjectsOptions({commit}) {
        try {
            const projectsOptions = await this.$axios.$get(this.$api.projectsHeaderFooter.list);
            commit('SET_PROJECTS_OPTIONS', projectsOptions);
        } catch (err) {
            console.warn('[VUEX/fetchProjectsOptions] request failed: ', err);
        }
    },

    async fetchAllProjects({commit}) {
        try {
            const projects = await this.$axios.$get(this.$api.projects.list);
            commit('SET_ALL_PROJECTS', projects);
        } catch (err) {
            console.warn('[VUEX/fetchProjects] request failed: ', err);
        }
    },

    async fetchCurrentCityProject({commit, dispatch}, city) {
        try {
            const params = {city: city.value || city};

            const projects = await this.$axios.$get(this.$api.projects.list, {
                params: serializeValues(params),
                paramsSerializer: params => objectToQuery(params),
                progress: false,
            });

            commit('SET_CURRENT_CITY_PROJECTS', projects);
            dispatch('fetchFacets', 'currentCity');
        } catch (err) {
            console.warn('[VUEX/fetchCurrentCityProject] request failed: ', err);
        }
    },

    async fetchProjects({commit, state}) {
        try {
            const res = await this.$axios.$get(`${this.$api.projects.list}`, {
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

    async fetchSpecs({commit}) {
        try {
            const res = await this.$axios.$get(this.$api.projects.specs, {
                progress: false,
            });
            const specs = Array.isArray(res) ? convertToObject(res) : res;
            commit('SET_SPECS', specs);
            return specs;
        } catch (e) {
            console.warn('[VUEX/fetchSpecs] projectsSpecs: ', e);
        }
    },

    async fetchFacets({commit, state}, type) {
        try {
            const res = await this.$axios.$get(this.$api.projects.facets, {
                params: serializeValues(state.params),
                paramsSerializer: params => objectToQuery(params),
                progress: false,
            });
            const facets = Array.isArray(res.facets) ? convertToObject(res.facets) : res.facets;

            if (type === 'all') {
                commit('SET_ALL_PROJECTS_FACETS', facets);
            } else if (type === 'currentCity') {
                commit('SET_CURRENT_CITY_FACETS', facets);
            }

            commit('SET_FACETS', facets);
            return facets;
        } catch (err) {
            console.warn('[VUEX/fetchFacets] request failed: ', err);
        }
    },

    clearProjects({commit}) {
        commit('SET_PROJECTS', []);
    },

    appendParams({state, commit}, params) {
        commit('SET_PARAMS', {...state.params, ...params});
    },

    setParams({commit}, params) {
        commit('SET_PARAMS', params);
    },

    setFacets({commit}, params) {
        commit('SET_FACETS', params);
    },
};

export const mutations = {
    SET_PROJECTS_OPTIONS(state, payload) {
        state.projectsOptions = payload;
    },

    SET_ALL_PROJECTS(state, payload) {
        state.allProjects = payload;
    },

    SET_CURRENT_CITY_PROJECTS(state, payload) {
        state.currentCityProjects = payload;
    },

    SET_PROJECTS(state, payload) {
        state.projects = payload;
    },

    SET_FACETS(state, payload) {
        state.facets = payload;
    },

    SET_ALL_PROJECTS_FACETS(state, payload) {
        state.allProjectsFacets = payload;
    },

    SET_CURRENT_CITY_FACETS(state, payload) {
        state.currentCityProjectsFacets = payload;
    },

    SET_SPECS(state, payload) {
        state.specs = payload;
    },

    SET_PARAMS(state, payload) {
        state.params = payload;
    },
};
