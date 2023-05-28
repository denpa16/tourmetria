const phasesApi = {
    phases: {
        list: '/api/phases/',
        id: id => `/api/phases/${id}/`,
        specs: '/api/phases/specs/',
        facets: '/api/phases/facets/',
    }
};

export default phasesApi;
