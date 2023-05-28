const parking = {
    parking: {
        list: '/api/parkings/',
        id: id => `/api/parkings/${id}/`,
        buildings: '/api/parkings/buildings/',
        facets: '/api/parkings/facets/',
        specs: '/api/parkings/specs/',
        projects: '/api/parkings/projects/',
    }
};

export default parking;
