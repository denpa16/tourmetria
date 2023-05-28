<template>
    <div
        id="app"
        :class="$style.DefaultLayout"
    >
        <TheHeader />

        <main :class="$style.main">
            <Nuxt />
        </main>

        <!--        <TheFooter />-->
        <TheModal :class="$style.modal" />
    </div>
</template>

<script>
// Vuex
import { mapGetters } from 'vuex';

// Components
import TheHeader from '~/components/layout/TheHeader';
import TheModal from '~/components/layout/TheModal';
// import TheFooter from '../components/layout/TheFooter';

export default {
    name: 'DefaultLayout',
    components: {
        TheHeader,
        TheModal,
        // TheFooter,
    },

    head() {
        return {
            link: [
                {
                    rel: 'canonical',
                    href: `${this.siteDomain}${this.$route.fullPath}`,
                },
            ],

            meta: [
                {
                    hid: 'og:type',
                    name: 'og:type',
                    content: 'website',
                },
                {
                    hid: 'og:url',
                    name: 'og:url',
                    content: `${this.siteDomain}${this.$route.fullPath}`,
                },
            ],
        };
    },

    computed: {
        ...mapGetters({
            siteDomain: 'domain/getDomainAddress',
            isWebpSup: 'device/getIsWebpSupported',
        }),
    },

    mounted() {
        if (process.client) {
            console.warn(`webp is: ${this.isWebpSup ? 'supported' : 'not supported'}`);
        }
    },
};
</script>

<style lang="scss" module>
    .DefaultLayout {
        //
    }

    .main {
        position: relative;
        min-height: calc(100vh - #{$footer-h});
        /* stylelint-disable */
        min-height: -webkit-fill-available;
        /* stylelint-enable */
    }

    .modal {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1000;
    }
</style>
