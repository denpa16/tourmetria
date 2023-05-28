const buildingsApi = {
    buildings: {
        list: '/api/buildings/',
        id: id => `/api/buildings/${id}/`,
        checkerboard: id => `/api/buildings/${id}/checkerboard/`,
        checkerboardFilter: id => `/api/buildings/${id}/checkerboardfilter/`,
        checkerboardCard: id => `/api/buildings/${id}/checkerboardcard/`,
        specs: '/api/buildings/specs/',
        facets: '/api/buildings/facets/',
    },
};

export default buildingsApi;
