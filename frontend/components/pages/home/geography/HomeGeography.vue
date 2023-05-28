<template>
    <div :class="$style.HomeGeography">
        <h3 ref="title"
            :class="$style.title"
            v-html="title"></h3>

        <div :class="[$style.hint, 'p5', 'c-base300']"
             :style="{top: `${titleHeight}px`}">
            Откройте карту для наглядного <br> просмотра городов и проектов
        </div>

        <HomeGeographySubjects
            :district-image="districtImage"
            :district-preview="districtPreview"
            :image-width="imageWidth"
            :image-height="imageHeight"
            :regions="regions"
            :title-height="titleHeight"
            @pointEnter="onPointEnter"
            @pointLeave="onPointLeave"
        />

        <div :class="$style.btnPanel">
            <VButton
                :class="$style.btn"
                responsive
                @click="openModal"
            >
                Открыть карту
            </VButton>
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import HomeGeographySubjects from '~/components/pages/home/geography/HomeGeographySubjects';
    import HomeGeographyModal from '~/components/pages/home/geography/HomeGeographyModal';

    export default {
        name: 'HomeGeography',

        components: {
            HomeGeographySubjects,
        },

        props: {
            title: {
                type: String,
                default: 'География строительства',
            },

            districtImage: {
                type: String,
                default: '',
            },

            districtPreview: {
                type: String,
                default: '',
            },

            imageWidth: {
                type: Number,
                default: 0
            },

            imageHeight: {
                type: Number,
                default: 0
            },

            regions: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                titleHeight: null,
            };
        },

        mounted() {
            addResizeListener(this.$refs.title, this.calcTitleHeight);
            this.calcTitleHeight();
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.title, this.calcTitleHeight);
        },

        methods: {
            calcTitleHeight() {
                this.titleHeight = this.$refs?.title?.offsetHeight;
            },

            openModal() {
                this.$modal.open(HomeGeographyModal, {
                    title: '',
                    districtImage: this.districtImage,
                    districtPreview: this.districtPreview,
                    regions: this.regions,
                });
            },

            onPointEnter() {
                this.$refs.title.style.color = '#535352';
            },

            onPointLeave() {
                this.$refs.title.style.color = '#fff';
            }
        }
    };
</script>

<style lang="scss" module>
    .HomeGeography {
        position: relative;
        height: 100vh;
        min-height: 80rem;
        max-height: calc(100vh - #{$header-h});
        margin: 0 auto;
        background-color: $base-200;

        @include respond-to(lg) {
            min-height: 65rem;
        }

        @include respond-to(sm) {
            max-height: calc(var(--vh-full-page) - #{$header-h});
        }

        @include respond-to(xs) {
            max-height: calc(var(--vh-full-page) - #{$header-mobile-h});
        }
    }

    .title {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        padding: 3.2rem 2.4rem 0;
        text-align: center;
        text-transform: uppercase;
        white-space: nowrap;
        // font-size: calc(5.0625em + ((1vw - 12.7px) * 5.8333));
        font-size: 5.72vw;
        font-weight: 600;
        line-height: 9.9rem;
        color: $base-0;
        transition: color $default-transition;

        @include respond-to(lg) {
            font-size: 5.66vw;
        }

        @include respond-to(md) {
            font-size: 5.6vw;
        }

        @include respond-to(sm) {
            padding: 2.4rem 2.4rem 0;
            font-size: 5.54vw;
            line-height: 4.8rem;
        }

        @include respond-to(xs) {
            padding: 1.6rem 2rem 0;
            font-size: 5.25vw;
            line-height: 2.4rem;
        }
    }

    .hint {
        position: absolute;
        left: 2.4rem;
        z-index: 1;
        display: none;
        padding-top: 2.4rem;

        @include respond-to(sm) {
            display: inline-block;
        }

        @include respond-to(xs) {
            left: 2rem;
            padding-top: .8rem;
        }
    }

    .btnPanel {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: none;
        width: 100%;
        padding: 0 2.4rem 1.6rem;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            padding: 0 2rem 2rem;
        }
    }

    .btn {
        text-transform: uppercase;
    }
</style>
