import apiConfig from '~/config/apiConfig';

export default ({app}, inject) => {
    app.$api = apiConfig;
    inject('api', apiConfig);
};
