import {
    faviconsLinks,
    faviconsMeta,
} from './head/favicons';

import {
    headScripts,
    headNoScripts,
} from './head/scripts';

const headConfig = {
    htmlAttrs: { lang: 'ru' },

    // TODO: Set site title
    title: 'IDA Project',

    // Head meta
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // TODO: Set site description
        { hid: 'description', name: 'description', content: 'Site description' },

        // Favicons
        ...faviconsMeta,
    ],

    // Head links
    link: [
        // Favicons
        ...faviconsLinks,
    ],

    script: process.env.GTM !== 'False'
        ? [...headScripts]
        : [],

    noscript: process.env.GTM !== 'False'
        ? [...headNoScripts]
        : [],

    __dangerouslyDisableSanitizers: ['script', 'noscript'],
};

export default headConfig;
