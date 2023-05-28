const publications = {
    publications: {
        specs: '/api/publications/specs/',
        facets: '/api/publications/facets/',
        mainNews: '/api/publications/main_page_news/',
        mainPromo: '/api/publications/main_page_promo/',
        list: '/api/publications/',
        publication: id => `/api/publications/${id}/`,
        news: '/api/publications/news/',
        extra_news: id => `/api/publications/${id}/extra_news/`,
        extra_promos: id => `/api/publications/${id}/extra_promos/`,
        promo: '/api/publications/promo/',
        latestNews: 'api/publications/latest/?type=news',
        latestProjectNews: slug => `api/publications/latest/?type=news&projects=${slug}`,
        latestPromos: 'api/publications/latest/?type=news',
        latestProjectPromos: slug => `api/publications/latest/?type=promotion&projects=${slug}`,
    }
};

export default publications;
