import path from 'path';
import fs from 'fs';
import nuxtDevConfig from './nuxt.dev.config';
import nuxtProdConfig from './nuxt.prod.config';
import getAppRoutes from './assets/js/utils/sitemap';

require('dotenv').config();

import headConfig from './config/headConfig';
import pluginsConfig from './config/pluginsConfig';

const env = {
    SERVER_API_URL: process.env.SERVER_API_URL,
    CLIENT_API_URL: process.env.CLIENT_API_URL,
    HTTPS_KEY: process.env.HTTPS_KEY,
    HTTPS_CERT: process.env.HTTPS_CERT,
    DEVELOPMENT: process.env.NODE_ENV === 'development'
};

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MAIN SECTION
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Global environments
    env: {
        ...env
    },

    // Server settings
    server: {
        port: 3000,
        host: '0.0.0.0',
        https: env.HTTPS_KEY && env.HTTPS_CERT
            ? {
                key: fs.readFileSync(path.resolve(__dirname, env.HTTPS_KEY)),
                cert: fs.readFileSync(path.resolve(__dirname, env.HTTPS_CERT))
            }
            : null
    },

    render: {
        http2: {
            push: true
        }
    },

    // Router settings
    router: {
        linkActiveClass: '--active-link',
        linkExactActiveClass: '--exact-link'
    },

    // Customize the progress-bar color
    loading: {
        color: '#4398ff',
        failedColor: '#ff8574'
    },

    // Head section
    head: headConfig,

    // Plugins
    plugins: pluginsConfig,

    NuxtDeviceIs: {
        breakpoints: {
            mobile: 767,
            tablet: 1279,
            laptop: 1439,
            desktop: 999999
        }
    },

    ...isDev ? nuxtDevConfig : nuxtProdConfig,

    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MODULES SECTION
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    buildModules: ['nuxt-gsap-module'],

    gsap: {
        extraPlugins: {
            scrollTrigger: true
        }
    },

    // Axios && proxy
    axios: {
        progress: false,
        baseURL: env.SERVER_API_URL || '',
        browserBaseURL: env.CLIENT_API_URL || '',
        credentials: 'include'
    },

    // Global CSS
    css: [
        '~/assets/scss/vendors.scss',
        '~/assets/scss/common.scss'
    ],

    // Sitemap
    sitemap: {
        hostname: 'https://neometria.ru',
        gzip: true,
        generate: false,
        cacheTime: 1000 * 60 * 15,
        exclude: [
            '/print',
            '/print/**'
        ],
        routes() {
            return getAppRoutes();
        },
        defaults: {
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: new Date()
        }
    },

    // Redirect

    redirect: [
        {from: '^/how-buy$', to: 'https://old.neometria.ru/how-buy/'},
        {from: '^/how-buy/mortgage', to: 'https://old.neometria.ru/how-buy/mortgage/'},
        {from: '^/how-buy/installment', to: 'https://old.neometria.ru/how-buy/installment/'},
        {from: '^/how-buy/capital', to: 'https://old.neometria.ru/how-buy/capital/'},
        {from: '^/how-buy/military', to: 'https://old.neometria.ru/how-buy/military/'},
        {from: '^/how-buy/full', to: 'https://old.neometria.ru/how-buy/full/'},

        {from: '^/about$', to: 'https://old.neometria.ru/about/'},
        {from: '^/about/videos', to: 'https://old.neometria.ru/about/videos/'},
        {from: '^/about/career', to: 'https://old.neometria.ru/about/career/'},
        {from: '^/about/vacancies', to: 'https://old.neometria.ru/about/vacancies/'},
        {from: '^/about/investors', to: 'https://old.neometria.ru/about/investors'},
        {from: '^/about/contacts', to: 'https://old.neometria.ru/about/contacts/'},
        {from: '^/about/neocare', to: 'https://old.neometria.ru/sochi/?article=11-51609'},

        {from: '^/tenders', to: 'https://tenders.neometria.ru/'},
    ],

    /**
     * Миксины и переменные доступны во всех компонентам и во всех scss файлах
     */
    styleResources: {
        scss: '~/assets/scss/shared/*.scss'
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

        // Terser settings
        terser: !isDev && {
            terserOptions: {
                mangle: {
                    safari10: true
                }
            }
        },

        // Postcss settings
        postcss: !isDev && {
            preset: {
                autoprefixer: {
                    grid: true
                }
            }
        },

        optimization: {
            minimize: true,
            splitChunks: {
                chunks: 'all',
                automaticNameDelimiter: '.',
                name: true,
                maxSize: 244000,
                cacheGroups: {
                    vendor: {
                        name: 'node_vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        maxSize: 244000
                    }
                }
            }
        },

        extend(config) {
            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: 'empty'
            };
        }
    }
};
