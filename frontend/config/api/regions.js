const regionsApi = {
    regions: {
        list: '/api/regions/',
        slug: slug => `/api/regions/${slug}/`,
        specs: '/api/regions/specs/',
        facets: '/api/regions/facets/',
    },
};

export default regionsApi;
