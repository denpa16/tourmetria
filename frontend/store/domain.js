export const state = () => ({
    domainUrl: 'domain not set',
    isHideLayout: false,
});

export const getters = {
    getDomainAddress(state) {
        return `https://${state.domainUrl}`;
    },
};

export const actions = {
    init({dispatch}, context) {
        if (context?.req?.headers['x-forwarded-host']) {
            dispatch('changeActiveDomain', context.req.headers['x-forwarded-host']);
        } else if (process.env.PROXY_URL) {
            const regex = /.*:\/\/(?:www.)?([^/]+)/g;
            const array = [...process.env.PROXY_URL.matchAll(regex)];
            const found = array.map(m => m[1]);
            const domain = found[0];

            if (domain) {
                dispatch('changeActiveDomain', domain);
            }
        } else {
            console.warn('[store domain/actions/init Error] domain address is not set');
        }
    },

    changeActiveDomain({commit}, payload) {
        commit('SET_DOMAIN', payload);
    },

    setIsHideLayout({commit}, payload) {
        commit('SET_IS_HIDE_LAYOUT', payload);
    },
};

export const mutations = {
    SET_DOMAIN(state, domain) {
        state.domainUrl = domain;
    },

    SET_IS_HIDE_LAYOUT(state, domain) {
        state.isHideLayout = domain;
    },
};
