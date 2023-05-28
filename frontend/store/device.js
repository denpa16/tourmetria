export const state = () => ({
    webpSupported: null,
    acceptFormats: '',
});

export const getters = {
    getIsWebpSupported(state) {
        return state.webpSupported;
    },
};

export const actions = {
    async init({ dispatch, state }, context) {
        const accept = context?.req?.headers['accept'];

        if (accept) {
            dispatch('changeAcceptFormats', accept.split('/'));
            dispatch('changeIsWebpSupported', /\b(webp)\b/i.test(accept));
        }
    },

    changeAcceptFormats({ commit }, payload) {
        commit('SET_ACCEPT_FORMATS', payload);
    },

    changeIsWebpSupported({ commit }, payload) {
        commit('SET_WEBP_SUPPORTED', payload);
    },
};

export const mutations = {
    SET_ACCEPT_FORMATS(state, accept) {
        state.acceptFormats = accept;
    },

    SET_WEBP_SUPPORTED(state, support) {
        state.webpSupported = support;
    },
};
