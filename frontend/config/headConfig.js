// import {
//     faviconsLinks,
//     faviconsMeta,
// } from './head/favicons';

const headConfig = {
    htmlAttrs: {lang: 'ru'},

    title: 'Неометрия - Официальный сайт федерального девелопера | Неометрия',

    // Head meta
    meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},

        {hid: 'description', name: 'description', content: 'Квартиры в ЖК от застройщика - СК НЕОМЕТРИЯ. Строящиеся и Сданные дома. Жилые комплексы Эконом, Комфорт и Бизнес класса. Скидки и Акции. Звоните: 8 (800) 777-40-93'},

        // Favicons
        {hid: 'msapplication-config', name: 'msapplication-config', content: '/favicons/browserconfig.xml'},
        {hid: 'msapplication-TileColor', name: 'msapplication-TileColor', content: '#da532c'},
        {hid: 'theme-color', name: 'theme-color', content: '#ffffff'},
    ],

    // Head links
    link: [
        // Favicons
        {
            hid: 'favicon',
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicons/favicon.ico',
        },
        {
            hid: 'apple-touch-icon',
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/favicons/apple-touch-icon.png',
        },
        {
            hid: 'favicon-32x32',
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicons/favicon-32x32.png',
        },
        {
            hid: 'favicon-16x16',
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicons/favicon-16x16.png',
        },
        {
            hid: 'safari-pinned-tab',
            rel: 'mask-icon',
            href: '/favicons/safari-pinned-tab.svg',
            color: '#000000',
        },
        {
            hid: 'site.webmanifest',
            rel: 'manifest',
            href: '/favicons/site.webmanifest',
        },
    ],

    script: [
        // Roistat
        process.env.ROISTAT !== 'False'
            ? {
                innerHTML: `
                        (function(w, d, s, h, id) {
                        w.roistatProjectId = id; w.roistatHost = h;
                        var p = d.location.protocol == "https:" ? "https://" : "http://";
                        var u = /^.roistat_visit=[^;]+(.)?$/.test(d.cookie) ? "/dist/module.js" : "/api/site/1.0/"+id+"/init?referrer="+encodeURIComponent(d.location.href);
                        var js = d.createElement(s); js.charset="UTF-8"; js.async = 1; js.src = p+h+u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2);
                        })(window, document, 'script', 'cloud.roistat.com', '50fc7be5f1a20f98b81483030df5e9f0');
                    `,
                async: true,
            }
            : {},

        // Ya.Metrika
        process.env.YM !== 'False'
            ? {
                innerHTML: `
                        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                        ym(34618210, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
                    `,
                async: true,
            }
            : {},

        // Marquiz
        process.env.MARQUIZ !== 'False'
            ? {
                innerHTML: `
                (function(w, d, s, o){
                    var j = d.createElement(s); j.async = true; j.src = '//script.marquiz.ru/v2.js';j.onload = function() {
                      if (document.readyState !== 'loading') Marquiz.init(o);
                      else document.addEventListener("DOMContentLoaded", function() {
                        Marquiz.init(o);
                      });
                    };
                    d.head.insertBefore(j, d.head.firstElementChild);
                  })(window, document, 'script', {
                      host: '//quiz.marquiz.ru',
                      region: 'eu',
                      id: '624beef21b056d0044c95ac9',
                      autoOpen: false,
                      autoOpenFreq: 'once',
                      openOnExit: false,
                      disableOnMobile: false
                    }
                  );
                `,
                async: true,
            }
            : {},

        process.env.MARQUIZ !== 'False'
            ? {
                innerHTML: `
                (function(t, p) {window.Marquiz ? Marquiz.add([t, p]) : document.addEventListener('marquizLoaded', function() {Marquiz.add([t, p])})})('Widget', {id: '624beef21b056d0044c95ac9', position: 'right', delay: 30, autoOpen: 60, disableIfClosed: true})
                `,
                body: true,
            }
            : {},
    ],

    noscript: [
        // Yandex
        process.env.YM !== 'False'
            ? {
                innerHTML: '<div><img src="https://mc.yandex.ru/watch/34618210" style="position:absolute; left:-9999px;" alt="" /></div>',
                body: true,
            }
            : {},
    ],

    __dangerouslyDisableSanitizers: ['script', 'noscript'],
};

export default headConfig;
