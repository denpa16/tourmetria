import qs from 'qs';

export default ({$axios, req}) => {
    $axios.defaults.xsrfCookieName = 'csrftoken';
    $axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    const headers = req && req.headers ? Object.assign({}, req.headers) : {};

    $axios.setHeader('X-Forwarded-Host', headers['x-forwarded-host']);
    $axios.setHeader('X-Forwarded-Port', headers['x-forwarded-port']);
    $axios.setHeader('X-Forwarded-Proto', headers['x-forwarded-proto']);
    $axios.setHeader('Access-Control-Allow-Origin', '*');

    let endpoint;
    if (process.env.PROXY_URL) {
        endpoint = process.env.PROXY_URL;
    } else if (process.env.SERVER_API_URL) {
        endpoint = process.env.SERVER_API_URL;
    } else {
        endpoint = 'http://backend:8000/';
    }

    $axios.onRequest(config => {
        config.paramsSerializer = params => qs.stringify(Object.fromEntries(Object.entries(params).filter(p => p[1] !== null)), {arrayFormat: 'repeat'});

        return config;
    });

    if (process.client) {
        endpoint = `${location.origin}/`;
    }
    $axios.setBaseURL(endpoint);
};
