<template>
    <div
        ref="logo"
        :class="$style.bankLogo"
        v-html="icon"
    ></div>
</template>

<script>
    export default {
        name: 'BankTab',
        components: {},
        props: {
            icon: {
                type: String,
                default: ''
            },

            isActive: {
                type: Boolean,
                default: false

            }
        },

        data() {
            return {
                pathColors: [],
                rectAndCircleColor: []
            };
        },

        computed: {},
        watch: {
            isActive(val) {
                if (val) {
                    this.makeLogoActive();
                } else {
                    this.makeLogoInActive();
                }
            }
        },

        mounted() {
            this.getLogoColors();
            this.makeLogoInActive();
        },

        methods: {
            getLogoColors() {
                this.$refs.logo.querySelectorAll('path').forEach(el => {
                    this.pathColors.push(el.getAttribute('fill'));
                });
                this.$refs.logo.querySelectorAll(['rect', 'circle']).forEach(el => {
                    this.rectAndCircleColor.push(el.getAttribute('fill'));
                });
            },

            makeLogoInActive() {
                this.$refs.logo.querySelectorAll('path').forEach(el => {
                    el.setAttribute('style', 'fill: #757777');
                });
                this.$refs.logo.querySelectorAll(['rect', 'circle']).forEach(el => {
                    el.style.fill = '#F6F6F6';
                });
            },

            makeLogoActive() {
                this.$refs.logo.querySelectorAll('path').forEach((el, index) => {
                    el.setAttribute('style', `fill: ${this.pathColors[index]}`);
                });
                this.$refs.logo.querySelectorAll(['rect', 'circle']).forEach((el, index) => {
                    el.style.fill = this.rectAndCircleColor[index];
                });
            }
        }
    };
</script>

<style lang="scss" module>
    .bankLogo {
        width: 100%;
        height: 100%;

        svg,
        rect,
        circle,
        path {
            transition: all $default-transition;
        }
    }
</style>
