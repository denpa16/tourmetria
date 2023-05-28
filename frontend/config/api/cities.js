const citiesApi = {
    cities: {
        list: '/api/cities/',
        slug: slug => `/api/cities/${slug}/`,
        specs: '/api/cities/specs/',
        facets: '/api/cities/facets/',
    },
};

export default citiesApi;
