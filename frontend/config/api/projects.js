const projectsApi = {
    projects: {
        list: '/api/projects/',
        slug: slug => `/api/projects/${slug}/`,
        phases: id => `/api/projects/${id}/phases/`,
        buildings: id => `/api/projects/${id}/buildings/`,
        mortgage: '/api/projects/mortgage_block/',
        specs: '/api/projects/specs/',
        facets: '/api/projects/facets/',
    },

    projectPhases: {
        slug: slug => `/api/projects/${slug}/phases/`,
    }
};

export default projectsApi;
