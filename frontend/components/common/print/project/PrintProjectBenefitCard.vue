<template>
    <div :class="[$style.PrintProjectBenefitCard, {[$style._reversed]: reversed}]">
        <div ref="contentWrapper"
             :class="[$style.contentWrapper, {[$style._reversed]: reversed}]">
            <h2 ref="title"
                :class="[$style.title, 'c-blue']">
                {{ title }}
            </h2>
            <div ref="text"
                 :class="$style.text"
                 :style="{fontSize}"
                 v-html="text"></div>

            <!--            <a v-if="isOverflowed"-->
            <!--               :class="$style.link"-->
            <!--               :href="link"-->
            <!--               target="_blank">Читать далее →</a>-->
        </div>

        <img :class="$style.img"
             :src="img"
             alt="Фото преимущества">
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'PrintProjectBenefitCard',

        props: {
            img: {
                type: String,
                default: ''
            },

            title: {
                type: String,
                default: ''
            },

            text: {
                type: String,
                default: ''
            },

            reversed: {
                type: Boolean,
                default: false,
            },

            double: {
                type: Boolean,
                default: false,
            },

            projectSlug: {
                type: String,
                default: ''
            },

            projectCitySlug: {
                type: String,
                default: ''
            },
        },

        data() {
            return {
                isOverflowed: false,
                isOverflowedWithLowerFont: false,
                minFontSize: '12px',
                maxHeight: '238px',
            };
        },

        computed: {
            ...mapGetters('domain', {domain: 'getDomainAddress'}),
            link() {
                return `${this.domain}/${this.projectCitySlug}/complex-${this.projectSlug}#benefits`;
            },

            fontSize() {
                return this.isOverflowed && !this.double ? this.minFontSize : '14px';
            }
        },

        watch: {
            fontSize(val) {
                if (val === this.minFontSize) {
                    this.$nextTick(() => {
                        this.isOverflowedWithLowerFont = this.getOverflowedStatus();
                    });
                    return;
                }

                this.isOverflowedWithLowerFont = false;
            },

            isOverflowedWithLowerFont(val) {
                if (val) {
                    this.$emit('overflow');
                    this.isOverflowed = false;
                }
            },
        },

        mounted() {
            this.isOverflowed = this.getOverflowedStatus();
        },

        methods: {
            getOverflowedStatus() {
                const maxHeight = this.$refs.contentWrapper.offsetHeight
                    - this.$refs.title.offsetHeight
                    - (parseFloat(window.getComputedStyle(this.$refs.contentWrapper).padding) * 2);

                return this.$refs.text.offsetHeight > maxHeight;
            }
        },
    };
</script>

<style lang="scss" module>
    .PrintProjectBenefitCard {
        display: flex;
        width: 100%;
        height: 100%;

        &._reversed {
            flex-direction: row-reverse;
        }
    }

    .img {
        width: 50%;
        height: 100%;
        object-fit: cover;
    }

    .contentWrapper {
        position: relative;
        width: 50%;
        padding: 34px 28px;

        &._reversed {
            &:before {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: -1;
                display: block;
                width: 100%;
                height: 30%;
                background: url('/images/print/lot/vectorCardBg.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }

    .title {
        padding-bottom: 12px;
        text-transform: uppercase;
        font-size: 20px;
        line-height: 1.2;
    }

    .text {
        overflow: hidden;
        display: block;
        font-size: 14px;
        line-height: 18px;
    }

    .link {
        position: absolute;
        right: 28px;
        bottom: 17px;
        font-size: 12px;
        color: $blue;
        opacity: 1;
        transform: translateY(50%);
        transition: opacity $default-transition;

        @include hover {
            opacity: .7;
        }
    }
</style>
