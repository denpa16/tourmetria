import commonModules from './config/modules/commonModules';
import devModules from './config/modules/devModules';

const nuxtDevConfig = {
    modules: [
        ...commonModules,
        ...devModules,
    ],

    // Stylelint options
    stylelint: {
        files: [
            'assets/**/*.{s?(a|c)ss}',
            '**/components/**/*.{s?(a|c)ss}',
            '**/{components,layouts,services}/**/*.vue',
        ],
    },

    // Eslint options
    eslint: {
        cache: false,
    },

    proxy: {
        '/api': process.env.PROXY_URL,
    },
};

export default nuxtDevConfig;
