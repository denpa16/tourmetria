const floorsApi = {
    floors: {
        list: '/api/floors/',
        id: id => `/api/floors/${id}/`,
        specs: '/api/floors/specs/',
        facets: '/api/floors/facets/',
    },
};

export default floorsApi;
