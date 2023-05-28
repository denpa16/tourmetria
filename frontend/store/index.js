import {getCookie} from '~/assets/js/utils/commonUtils';

export const state = () => ({
    contacts: {
        messengers: [],
        socials: {},
        privacyLink: '/policy',
    },

    cities: [],

    current_city: {
        value: '',
        label: 'Все города',
    },

    storage_link: 'https://storage.yandexcloud.net/neometry-media/media',
    header_promo: {},

    lot_type_labels: {
        flats: {
            singular: ['квартира', 'квартиры', 'квартире', 'квартиру', 'квартирой'],
            plural: ['квартиры', 'квартир', 'квартирам', 'квартиры', 'квартирами'],
            pluralShort: ['квартира', 'квартиры', 'квартир'],
        },

        commercial: {
            singular: ['помещение', 'помещения', 'помещению', 'помещение', 'помещением'],
            plural: ['помещения', 'помещений', 'помещениям', 'помещения', 'помещениями'],
            pluralShort: ['помещение', 'помещения', 'помещений'],
        },

        hotel: {
            singular: ['номер', 'номера', 'номеру', 'номер', 'номером'],
            plural: ['номера', 'номеров', 'номерам', 'номера', 'номерами'],
            pluralShort: ['номер', 'номера', 'номеров'],
        },
    },
});

export const getters = {
    getSocialLinks(state) {
        return state.contacts.socials || [];
    },

    getMessengers(state) {
        return state.contacts.messengers || [];
    },

    getPrivacyLink(state) {
        return state.contacts.privacyLink || [];
    },

    getCities(state) {
        return state.cities || [];
    },

    getCurrentCity(state) {
        return state.current_city;
    },

    getStorageLink(state) {
        return state.storage_link;
    },

    getHeaderPromo(state) {
        return state.header_promo;
    },
};

export const actions = {
    async nuxtServerInit({dispatch}, context) {
        let currentCity = getCookie('current-city', context.req.headers.cookie);
        if (currentCity) {
            currentCity = JSON.parse(currentCity);
            dispatch('setCurrentCity', currentCity);
        }

        try {
            await Promise.all([
                dispatch('domain/init', context),
                dispatch('fetchMessengers'),
                dispatch('fetchSocials'),
                dispatch('projects/fetchProjectsOptions'),
                dispatch('fetchCities'),
                dispatch('fetchHeaderPromo'),
            ]);
        } catch (e) {
            console.log('Error in nuxtServerInit', e);
        }
    },

    async fetchMessengers({commit}) {
        const res = await this.$axios.$get(this.$api.messengers);
        commit('SET_MESSENGERS', res);
    },

    async fetchSocials({commit}) {
        const res = await this.$axios.$get(this.$api.socials);
        commit('SET_SOCIALS', res);
    },

    async fetchCities({commit}) {
        const res = await this.$axios.$get(this.$api.cities.list);
        commit('SET_CITIES', res);
    },

    async fetchHeaderPromo({commit}) {
        const res = await this.$axios.$get(this.$api.headerPromo);
        commit('SET_HEADER_PROMO', res);
    },

    setCurrentCity({commit}, city) {
        commit('SET_CURRENT_CITY', city);
    },
};

export const mutations = {
    SET_MESSENGERS(state, payload) {
        state.contacts.messengers = payload;
    },

    SET_SOCIALS(state, payload) {
        state.contacts.socials = payload;
    },

    SET_CITIES(state, payload) {
        state.cities = payload;
    },

    SET_CURRENT_CITY(state, payload) {
        state.current_city = payload;
    },

    SET_HEADER_PROMO(state, payload) {
        state.header_promo = payload;
    },
};
