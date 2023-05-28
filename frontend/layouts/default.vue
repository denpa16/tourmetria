<template>
    <div>
        <TheHeader v-if="!isHideHeader" />

        <main :class="$style.main">
            <nuxt />
        </main>

        <TheFooter v-if="!isHideFooter" />
        <TheCookies v-if="!isHideCookies" />
        <TheModal />
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {unlockBody, isLockBody} from '~/assets/js/utils/lockUtilsMain';

    import TheHeader from '~/components/layout/TheHeader';
    import TheFooter from '~/components/layout/TheFooter';
    import TheModal from '~/components/layout/TheModal';
    import TheCookies from '~/components/layout/TheCookies';

    export default {
        components: {
            TheHeader,
            TheFooter,
            TheCookies,
            TheModal,
        },

        data() {
            return {
                pageWidth: 0,
                isHideHeader: false,
                isHideFooter: false,
                isHideCookies: false,
                isHideWidgets: false,
            };
        },

        head() {
            return {
                link: [{rel: 'canonical', href: `${this.domain}${this.$route.path}`}],
            };
        },

        computed: {
            ...mapGetters('domain', {domain: 'getDomainAddress'}),
        },

        watch: {
            $route() {
                this.$nextTick(() => {
                    if (typeof document === 'undefined') {
                        return;
                    }

                    if (isLockBody()) {
                        unlockBody();
                    }
                });
            },
        },

        created() {
            const query = this.$route.query;

            this.isHideHeader = query?.header === 'off';
            this.isHideFooter = query?.footer === 'off';
            this.isHideCookies = query?.cookies === 'off';
            this.isHideWidgets = query?.widgets === 'off';

            if (this.isHideHeader && this.isHideFooter) {
                this.setIsHideLayout(true);
            }
        },

        mounted() {
            if (typeof window === 'undefined') {
                return;
            }

            this.calculatePageHeight();
            window.addEventListener('resize', this.handleResize);

            if (this.isHideWidgets) {
                document.body.classList.add('_hideWidgets');
            }
        },

        beforeDestroy() {
            if (typeof window === 'undefined') {
                return;
            }

            window.removeEventListener('resize', this.handleResize);

            if (this.isHideWidgets) {
                document.body.classList.remove('_hideWidgets');
            }
        },

        methods: {
            ...mapActions('domain', ['setIsHideLayout']),

            calculatePageHeight() {
                this.pageWidth = window.innerWidth;
                document.documentElement.style.setProperty('--vh-full-page', `${window.innerHeight}px`);
            },

            handleResize() {
                if (window.innerWidth === this.pageWidth) {
                    return;
                }

                this.calculatePageHeight();
            }
        }
    };
</script>

<style lang="scss" module>
    .main {
        // min-height: calc(100vh - #{$footer-h});
    }
</style>
