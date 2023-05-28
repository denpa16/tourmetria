const sectionsApi = {
    sections: {
        list: '/api/sections/',
        id: id => `/api/sections/${id}/`,
        specs: '/api/sections/specs/',
        facets: '/api/sections/facets/',
    },
};

export default sectionsApi;
