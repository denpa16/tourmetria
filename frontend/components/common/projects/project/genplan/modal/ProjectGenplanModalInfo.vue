<template>
    <div :class="$style.ProjectGenplanModalInfo"
         @mouseenter="$emit('mouseenter', $event)"
         @mouseleave="$emit('mouseleave', $event)"
         @click.stop>
        <transition name="fade-content">
            <div v-if="visible"
                 key="desktop"
                 :class="[$style.modal, $style._desktop]">
                <ProjectGenplanModalContentInfo
                    :title="title"
                    :subtitle="subtitle"
                    :btn-text="btnText"
                    :next-after-next-step-name="nextAfterNextStepName"
                    :tags="tags"
                    :is-any-flats="isAnyFlats"
                    :flats="flats"
                    :item-id="item && item.id"
                    :render="render"
                    :render-preview="renderPreview"
                    :render-poligons="renderPoligons"
                    :render-width="renderWidth"
                    :render-height="renderHeight"
                    :is-loading="isLoading"
                    @click="$emit('click', $event)"
                    @next-step="$emit('next-step', $event)"
                />
            </div>
        </transition>

        <TemplateBottomModal key="mobile"
                             :class="[$style.modal, $style._mobile]"
                             :visible="visible"
                             :is-lock-body="$deviceIs.tablet || $deviceIs.mobile"
                             :data="modalData"
                             @close="$emit('close')">
            <ProjectGenplanModalContentInfo
                :title="title"
                :subtitle="subtitle"
                :btn-text="btnText"
                :next-after-next-step-name="nextAfterNextStepName"
                :tags="tags"
                :is-any-flats="isAnyFlats"
                :flats="flats"
                :item-id="item && item.id"
                :render="render"
                :render-preview="renderPreview"
                :render-poligons="renderPoligons"
                :render-width="renderWidth"
                :render-height="renderHeight"
                :filter-params="completedFilterParams"
                :is-loading="isLoading"
                @click="$emit('click', $event)"
                @next-step="$emit('next-step', $event)"
            />
        </TemplateBottomModal>

        <transition name="overlay-appear">
            <Overlay v-if="visible"
                     :class="$style.overlay"
                     @click="$emit('close')" />
        </transition>
    </div>
</template>

<script>
    import {
        getCorrectEnding,
        getFlatTitle,
        isDeadlinePassed,
    } from '~/assets/js/utils/numberUtils';
    import replaceDataIntoTags from '~/assets/js/utils/replaceDataIntoTags';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ProjectGenplanModalContentInfo from '~/components/common/projects/project/genplan/modal/content/ProjectGenplanModalContentInfo';
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import Overlay from '~/components/layout/modals/Overlay';

    export default {
        name: 'ProjectGenplanModalInfo',
        components: {
            Overlay,
            TemplateBottomModal,
            ProjectGenplanModalContentInfo
        },

        mixins: [breakpointCheck],

        props: {
            item: {
                type: Object,
                default: () => ({}),
            },

            nextStepName: {
                type: String,
                default: '',
            },

            nextAfterNextStepName: {
                type: String,
                default: '',
            },

            visible: {
                type: Boolean,
                default: false,
            },

            btnText: {
                type: String,
                default: '',
            },

            filterParams: {
                type: Object,
                default: () => ({}),
            },

            isLoading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                addressPairs: [
                    ['phase', 'очередь'],
                    ['building', 'литер'],
                    ['section', 'подъезд'],
                    ['floor', 'этаж'],
                ],

                flatsUrl: '/selection/flats'
            };
        },

        computed: {
            modalData() {
                return {
                    withoutDefaultHead: true,
                };
            },

            title() {
                return this.item?.number ? `${this.item?.number} ${this.nextStepName}` : '';
            },

            subtitle() {
                const paths = this.addressPairs.map(path => this.getSubtitlePath(path));
                return paths.reduce((res, path) => path ?
                    res ? `${res}, ${path}` : path
                    : res, '');
            },

            render() {
                return this.item?.genplan_display || '';
            },

            renderPreview() {
                return this.item?.genplan_preview || '';
            },

            renderPoligons() {
                return this.item?.render_hover_point?.length ? this.item.render_hover_point[0].hover : '';
            },

            renderWidth() {
                return this.item?.genplan_width || 0;
            },

            renderHeight() {
                return this.item?.genplan_height || 0;
            },

            isDeadlinePassed() {
                if (!this.item) {
                    return false;
                }

                return isDeadlinePassed(this.item?.completion_year, this.item?.completion_quarter);
            },

            completionLabel() {
                if (this.isDeadlinePassed) {
                    return 'Объект сдан';
                }

                if (this.item?.completion_quarter && this.item?.completion_year) {
                    return `Сдача в ${this.item.completion_quarter} кв. ${this.item.completion_year}`;
                }

                if (this.item?.completion_year) {
                    return `Сдача в ${this.item.completion_year} г.`;
                }

                return 'Ведется проектирование';
            },

            tags() {
                return [
                    {
                        color: 'light',
                        label: this.completionLabel,
                    }
                ];
            },

            isAnyFlats() {
                return Boolean(this.item?.studio_count
                    || this.item?.room_1_count
                    || this.item?.room_2_count
                    || this.item?.room_3_count
                    || this.item?.room_4_count);
            },

            flats() {
                return [
                    {
                        name: getFlatTitle(0).short + '.',
                        roomNumber: 0,
                        count: this.item?.studio_count || 0,
                        min_price: this.item?.studio_min_price || 0,
                        link: {
                            path: this.flatsUrl,
                            query: {
                                ...this.completedFilterParams,
                                rooms: 0,
                            },
                        }
                    },
                    {
                        name: getFlatTitle(1).short + '.',
                        roomNumber: 1,
                        count: this.item?.room_1_count || 0,
                        min_price: this.item?.room_1_min_price || 0,
                        link: {
                            path: this.flatsUrl,
                            query: {
                                ...this.completedFilterParams,
                                rooms: 1,
                            },
                        }
                    },
                    {
                        name: getFlatTitle(2).short + '.',
                        roomNumber: 2,
                        count: this.item?.room_2_count || 0,
                        min_price: this.item?.room_2_min_price || 0,
                        link: {
                            path: this.flatsUrl,
                            query: {
                                ...this.completedFilterParams,
                                rooms: 2,
                            },
                        }
                    },
                    {
                        name: getFlatTitle(3).short + '.',
                        roomNumber: 3,
                        count: this.item?.room_3_count || 0,
                        min_price: this.item?.room_3_min_price || 0,
                        link: {
                            path: this.flatsUrl,
                            query: {
                                ...this.completedFilterParams,
                                rooms: 3,
                            },
                        }
                    },
                    {
                        name: getFlatTitle(4).short + '.',
                        roomNumber: 4,
                        count: this.item?.room_4_count || 0,
                        min_price: this.item?.room_4_min_price || 0,
                        link: {
                            path: this.flatsUrl,
                            query: {
                                ...this.completedFilterParams,
                                rooms: 4,
                            },
                        }
                    }
                ];
            },

            completedFilterParams() {
                if (!this.filterParams
                    || typeof this.filterParams !== 'object'
                    || Object.keys(this.filterParams).length === 0
                ) {
                    return {};
                }

                if (!this.item) {
                    return this.filterParams;
                }

                return Object.fromEntries(Object.entries(this.filterParams)
                    .map(([key, value]) => {
                        if (String(value).includes('{{')) {
                            const comletedValue = replaceDataIntoTags(value, this.item);
                            return comletedValue ? [key, comletedValue] : [key, value];
                        }

                        return [key, value];
                    })
                    .filter(pair => pair[1] && pair[1] !== '-'));
            },
        },

        methods: {
            getSubtitlePath([step, stepName]) {
                const total = this.item && this.item[`total_${step}`];
                const number = this.item && this.item[`${step}_number`];
                const min = this.item && this.item[`total_${step}_min`];
                const max = this.item && this.item[`total_${step}_max`];

                if (total) {
                    return `${total} ${getCorrectEnding(stepName, total)}`;
                }

                if (number) {
                    return `${number} ${stepName}`;
                }

                if (!min && !max) {
                    return '';
                }

                let minmaxStr = '';

                if (!min && max) {
                    minmaxStr = `${max} ${getCorrectEnding(stepName, max)}`;
                } else if (min && !max) {
                    minmaxStr = `${min} ${getCorrectEnding(stepName, min)}`;
                } else if (min === max) {
                    minmaxStr = `${min} ${getCorrectEnding(stepName, min)}`;
                } else {
                    minmaxStr = `${min} - ${max} ${getCorrectEnding(stepName, max)}`;
                }

                return minmaxStr;
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalInfo {
        width: 36.4rem;

        @include respond-to(sm) {
            width: unset;
        }
    }

    .modal {
        &._desktop {
            min-width: 36.4rem;
            padding: 1.6rem 2rem;
            border-radius: .8rem;
            background-color: $base-0;
            box-shadow: 0 0 24px rgba(0, 0, 0, .08), 0 4px 24px rgba(0, 0, 0, .04);

            @include respond-to(sm) {
                display: none;
            }
        }

        &._mobile {
            display: none;

            @include respond-to(sm) {
                display: block;
            }
        }
    }

    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
