<template>
    <div>
        <main :class="$style.main">
            <nuxt />
        </main>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageWidth: 0,
            };
        },

        mounted() {
            if (typeof window === 'undefined') {
                return;
            }

            this.calculatePageHeight();
            window.addEventListener('resize', this.handleResize);
        },

        beforeDestroy() {
            if (typeof window === 'undefined') {
                return;
            }

            window.removeEventListener('resize', this.handleResize);
        },

        methods: {
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
