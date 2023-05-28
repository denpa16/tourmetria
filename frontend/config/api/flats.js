const flats = {
    flats: {
        list: '/api/flats/',
        id: id => `/api/flats/${id}/`,
        similar: id => `/api/flats/${id}/similar/`,
        facets: '/api/flats/facets/',
        specs: '/api/flats/specs/',
    }
};

export default flats;
