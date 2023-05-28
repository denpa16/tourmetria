const hotelrooms = {
    hotelrooms: {
        list: '/api/hotelrooms/',
        id: id => `/api/hotelrooms/${id}/`,
        buildings: '/api/hotelrooms/buildings/',
        facets: '/api/hotelrooms/facets/',
        specs: '/api/hotelrooms/specs/',
        projects: '/api/hotelrooms/projects/',
    }
};

export default hotelrooms;
