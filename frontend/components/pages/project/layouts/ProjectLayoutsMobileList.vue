<template>
    <div :class="$style.ProjectLayoutsMobileList">
        <ProjectLayoutsMobileCard v-for="layout in layoutsList"
                                  :key="layout.id"
                                  :class="$style.card"
                                  :layout="layout"
                                  @open-url="$emit('open-url', $event)"
        />

        <VButton v-show="visibleMore"
                 :class="$style.btn"
                 color="white-additional"
                 :loading="isReloading"
                 :spinner="isReloading"
                 @click="handleClick">
            {{ moreText }}
        </VButton>
        <VButton v-show="visibleCollapsed"
                 :class="$style.btn"
                 color="white-additional"
                 :loading="isReloading"
                 :spinner="isReloading"
                 @click="handleCollapse">
            Свернуть
        </VButton>
    </div>
</template>

<script>
    import {plural} from '~/assets/js/utils/textUtils';

    import ProjectLayoutsMobileCard from '~/components/pages/project/layouts/ProjectLayoutsMobileCard';

    export default {
        name: 'ProjectLayoutsMobileList',

        components: {
            ProjectLayoutsMobileCard,
        },

        props: {
            layouts: {
                type: Array,
                default: () => [],
            },

            moreCounter: {
                type: Number,
                default: 0,
            },

            isReloading: {
                type: Boolean,
                default: false,
            },
 
            isFullList: {
                type: Boolean,
                default: false,
            },

            isValuesChanged: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                lastIndex: 6,
                layoutsPerView: 12,
            };
        },

        computed: {
            layoutsList() {
                return this.layouts.slice(0, this.lastIndex);
            },

            visibleCollapsed() {
                return this.layoutsList.length === this.layouts.length;
            },

            visibleMore() {
                return this.layoutsList.length < this.layouts.length;
            },

            currentCounter() {
                return Math.min(this.layouts.length - this.layoutsList.length + this.moreCounter, this.layoutsPerView);
            },

            moreText() {
                return `+${this.currentCounter} ${plural(this.currentCounter, ['тип', 'типа', 'типов'])}`;
            },
        },

        watch: {
            isValuesChanged: {
                handler() {
                    this.lastIndex = 6;
                },

                immediate: true,
            },
        },

        methods: {
            handleClick() {
                if (!this.isFullList && this.layoutsList.length < this.layouts.length) {
                    this.$emit('show-more');
                    this.lastIndex +=this.currentCounter;
                } else if (this.isFullList && this.layoutsList.length < this.layouts.length) {
                    this.lastIndex +=this.currentCounter;
                }
            },

            handleCollapse() {
                this.lastIndex = 6;
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectLayoutsMobileList {
        padding-top: 1.6rem;
        padding-bottom: 4rem;
    }

    .card {
        &:not(:last-child) {
            margin-bottom: .8rem;
        }
    }

    .btn {
        width: 100%;
        margin-top: 1.6rem;
    }
</style>
