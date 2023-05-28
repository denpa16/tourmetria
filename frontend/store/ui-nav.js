export const state = () => ({
    navList: [
        {
            title: 'Release info',
            to: '/release',
        },
        {
            title: 'Components',
            list: [
                {
                    title: 'UI-Kit',
                    to: '/components/ui-kit',
                    list: [
                        {
                            title: 'VAccordion',
                            to: { path: '/components/ui-kit', hash: '#VAccordion' },
                            active: false,
                        },
                        {
                            title: 'VBreadcrumb',
                            to: { path: '/components/ui-kit', hash: '#VBreadcrumb' },
                            active: false,
                        },
                        {
                            title: 'VButton',
                            to: { path: '/components/ui-kit', hash: '#VButton' },
                            active: false,
                        },
                        {
                            title: 'VCalendar',
                            to: { path: '/components/ui-kit', hash: '#VCalendar' },
                            active: false,
                        },
                        {
                            title: 'VCheckbox',
                            to: { path: '/components/ui-kit', hash: '#VCheckbox' },
                            active: false,
                        },
                        {
                            title: 'VFile',
                            to: { path: '/components/ui-kit', hash: '#VFile' },
                            active: false,
                        },
                        {
                            title: 'VIcon',
                            to: { path: '/components/ui-kit', hash: '#VIcon' },
                            active: false,
                        },
                        {
                            title: 'VInput',
                            to: { path: '/components/ui-kit', hash: '#VInput' },
                            active: false,
                        },
                        {
                            title: 'VInputSelect',
                            to: { path: '/components/ui-kit', hash: '#VInputSelect' },
                            active: false,
                        },
                        {
                            title: 'VPopover',
                            to: { path: '/components/ui-kit', hash: '#VPopover' },
                            active: false,
                        },
                        {
                            title: 'VRange',
                            to: { path: '/components/ui-kit', hash: '#VRange' },
                            active: false,
                        },
                        {
                            title: 'Rub',
                            to: { path: '/components/ui-kit', hash: '#Rub' },
                            active: false,
                        },
                        {
                            title: 'VSelect',
                            to: { path: '/components/ui-kit', hash: '#VSelect' },
                            active: false,
                        },
                        {
                            title: 'VSkeleton',
                            to: { path: '/components/ui-kit', hash: '#VSkeleton' },
                            active: false,
                        },
                        {
                            title: 'VSwitch',
                            to: { path: '/components/ui-kit', hash: '#VSwitch' },
                            active: false,
                        },
                        {
                            title: 'VTabBar ',
                            to: { path: '/components/ui-kit', hash: '#VTabBar' },
                            active: false,
                        },
                    ],
                },
                {
                    title: 'Projects',
                    to: '/components/projects',
                    list: [
                        {
                            title: 'ProjectCard',
                            to: { path: '/components/projects', hash: '#ProjectCard' },
                            active: false,
                        },
                    ],
                },
            ],
            to: '/components',
        },
        {
            title: 'Examples',
            list: [
                {
                    title: 'Projects Filter',
                    to: '/examples/projectsFilter',
                },
                {
                    title: 'Table Example',
                    to: '/examples/tabledData',
                },
            ],
            to: '/examples',
        },
    ],
});

export const getters = {
    getUiMenu(state) {
        return state.navList;
    },
};

export const actions = {
    setActive({ state, commit }, itemObj) {
        commit('SET_ACTIVE', itemObj);
    },
};

export const mutations = {
    SET_ACTIVE(state, payload) {
        let foundList = {};
        const foundCategory = state.navList.find(i => i.title === payload.category);

        if (foundCategory?.list?.length) {
            foundList = foundCategory.list.find(i => i.title === payload.item);
        }

        if (foundList?.list?.length) {
            foundList.list.forEach(elm => elm.active = elm.title === payload.title);
        }
    },
};
