import fs from 'fs';
import path from 'path';
import nuxtDevConfig from './nuxt.dev.config';
import nuxtProdConfig from './nuxt.prod.config';
import headConfig from './config/headConfig';
import pluginsConfig from './config/pluginsConfig';

const env = {
    SERVER_API_URL: process.env.SERVER_API_URL,
    CLIENT_API_URL: process.env.CLIENT_API_URL,
    PROXY_URL: process.env.PROXY_URL,
    HTTPS_KEY: process.env.HTTPS_KEY,
    HTTPS_CERT: process.env.HTTPS_CERT,
    DEVELOPMENT: process.env.NODE_ENV === 'development',
    IMGPROXY_SITE_HOST: process.env.IMGPROXY_SITE_HOST,
    UI_DEMO: process.env.UI_DEMO,
    REDIS_DSN: process.env.REDIS_DSN,
};

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MAIN SECTION
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Server settings
    server: {
        port: 3000,
        host: '0.0.0.0',
        https: env.HTTPS_KEY && env.HTTPS_CERT
            ? {
                key: fs.readFileSync(path.resolve(__dirname, env.HTTPS_KEY)),
                cert: fs.readFileSync(path.resolve(__dirname, env.HTTPS_CERT)),
            }
            : null,
    },

    render: {
        http2: {
            push: true,
        },
    },


    // NuxtDeviceIs breakpoints
    NuxtDeviceIs: {
        breakpoints: {
            mobile: 767,
            tablet: 1279,
            laptop: 1439,
            desktop: 999999,
        },
    },

    // Router settings
    router: {
        linkActiveClass: '_active-link',
        linkExactActiveClass: '_exact-link',
        middleware: ['uikit-redirect'],
    },

    // * Customize the progress-bar color
    // loading: '~/components/layout/progress/TheProgress.vue',
    loading: {
        color: '#d9ff6c',
        height: '2px',
        throttle: 0,
    },

    // Head section
    head: headConfig,

    // Plugins
    plugins: pluginsConfig,

    ...isDev ? nuxtDevConfig : nuxtProdConfig,

    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MODULES SECTION
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Axios && proxy
    axios: {
        progress: false,
        ...!env.PROXY_URL && { baseURL: env.SERVER_API_URL || '' },
        ...!env.PROXY_URL && { browserBaseURL: env.CLIENT_API_URL || '' },
        proxy: Boolean(env.PROXY_URL),
    },

    publicRuntimeConfig: {
        IMGPROXY_SITE_HOST: env.IMGPROXY_SITE_HOST,
        PROXY_URL: env.PROXY_URL,
        IS_DEV: isDev,
        UI_DEMO: env.UI_DEMO,
    },

    // Cache
    cache: !isDev && {
        useHostPrefix: false,

        pages: [
            '/',
        ],

        key(route, context) {
            // Список исключений
            // Если страница личного кабинета отличается от 'my',
            // поменяйте путь, чтобы не сломать лк.
            if (route.includes('/my')) {
                return false;
            }

            const device = /Mobi/i.test(context.req.headers['user-agent'])
                ? 'mobile'
                : 'desk';

            if (route === '/') {
                return `${device}:page:home:string`;
            }

            let page = route.substr(1)
                .split('/');
            page = page.join('.');
            return `${device}:page:${page}:string`;
        },

        // Настройки размера и типа кэша
        //
        // https://www.npmjs.com/package/nuxt-ssr-cache
        // Можно поменять размер кэша, время храненение
        // и даже тип кэширование, например на redis.
        // В целом текущие настройки - являются оптимальными.
        store: env.REDIS_DSN
            ? {
                type: 'redis',
                url: env.REDIS_DSN,
                ttl: 60,
                configure: [
                    ['maxmemory', '1024mb'],
                    ['maxmemory-policy', 'allkeys-lru'],
                ],
            }
            : {
                type: 'memory',
                max: 500,
                ttl: 60,
            },
    },

    // Auto import UI components
    components: [
        {
            path: '~/components/ui',
            extensions: ['vue'],
            pathPrefix: false,
            isAsync: true,
        },
    ],

    // For ui demo code highlighter
    markdownit: {
        html: true,
        injected: true,
        runtime: true,
        breaks: true,
    },

    // Disabled _icons page from svgSprite
    svgSprite: {
        iconsPath: null,
    },

    // Global CSS
    css: [
        '~/assets/scss/bundle.scss',
        '~/assets/scss/vendors.scss',
        '~/assets/scss/default.scss',
    ],

    styleResources: {
        scss: [
            './assets/scss/shared/_functions.scss',
            './assets/scss/shared/_mixins.scss',
            './assets/scss/shared/_fonts.scss',
            './assets/scss/shared/_variables.scss',
        ],
        hoistUseStatements: true,
    },

    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // BUILD SECTION
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    build: {
        publicPath: '/n/',

        analyze: isDev,

        // Set libraries to transpile by babel
        transpile: !isDev && [],

        // You can extend webpack config here
        babel: {},

        loaders: {
            scss: {
                sourceMap: false,
            },
            vue: {
                cacheBusting: false,
            },
        },

        extractCss: true,

        // Terser settings
        terser: !isDev && {
            terserOptions: {
                mangle: {
                    safari10: true,
                },
            },
        },

        // Postcss settings
        postcss: !isDev && {
            preset: {
                autoprefixer: {
                    grid: true,
                },
            },

            postcssOptions: {
                plugins: {
                    'flex-gap-polyfill': { only: true },
                },
            },
        },

        extend(config, ctx) {
            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: 'empty',
            };
        },

        optimization: {
            splitChunks: {
                maxSize: 300000,
            },
        },
    },
};
