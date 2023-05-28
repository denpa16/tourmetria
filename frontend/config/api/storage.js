const storage = {
    storage: {
        list: '/api/storages/',
        id: id => `/api/storages/${id}/`,
        buildings: '/api/storages/buildings/',
        facets: '/api/storages/facets/',
        specs: '/api/storages/specs/',
        projects: '/api/storages/projects/',
    }
};

export default storage;
