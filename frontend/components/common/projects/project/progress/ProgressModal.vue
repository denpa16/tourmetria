<template>
    <transition
        name="modal"
        @after-enter="$emit('after-enter')"
        @before-leave="$emit('before-leave')"
        @after-leave="$emit('after-leave')"
    >
        <div
            v-if="visible"
            ref="progressModal"
            :class="$style.ProgressModal"
        >
            <VSquareButton :class="$style.closeButton"
                           color="white"
                           aria-label="Закрыть"
                           @click="onClose"
            >
                <IconCross :class="$style.iconCross" />
            </VSquareButton>
            <div :class="$style.progressHeader">
                <h6 :class="$style.progressTitle">
                    сдача в {{ data.deadline }}
                </h6>
                <div :class="$style.progressSelects">
                    <VSelect
                        :value="yearValue"
                        :options="yearsOptions"
                        placeholder="Год"
                        modal-breakpoint="xs"
                        modal-title="Год"
                        bordered
                        @input="onInputYear"
                    />
                    <VSelect
                        :value="monthValue"
                        :options="monthsOptions"
                        placeholder="Месяц"
                        modal-breakpoint="xs"
                        modal-title="Месяц"
                        bordered
                        @input="onInputMonth"
                    />
                </div>
            </div>
            <ul :class="$style.progressCards">
                <li
                    v-for="progress in progressListToShow"
                    :key="progress.id"
                >
                    <ProgressCard
                        :progress="progress"
                        in-modal
                        @cardClicked="onCardClick(progress)"
                    />
                </li>
            </ul>
            <GalleryModal
                v-if="isGalleryModalVisible"
                :visible="isGalleryModalVisible"
                :data="dataForGalleryModal"
                @close="onCloseGalleryModal"
            />
        </div>
    </transition>
</template>

<script>
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ProgressCard from '~/components/common/projects/project/progress/ProgressCard';
    import IconCross from '~/components/icons/IconCross';
    import GalleryModal from '~/components/common/projects/project/progress/GalleryModal';

    export default {
        name: 'ProgressModal',
        components: {GalleryModal,
                     ProgressCard,
                     IconCross},

        mixins: [breakpointCheck],
        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                monthValue: '',
                yearValue: 0,
                isGalleryModalVisible: false,
                dataForGalleryModal: {}
            };
        },

        computed: {
            progressList() {
                return this.data.progressList;
            },

            progressListCopy() {
                return JSON.parse(JSON.stringify(this.progressList));
            },

            progressListToShow() {
                let progressList = this.progressListCopy;
                if (this.yearValue) {
                    progressList = progressList.filter(progress => progress.year === this.yearValue);
                }
                if (this.monthValue) {
                    progressList = progressList.filter(progress => progress.month_number === this.monthValue);
                }
                return progressList;
            },

            monthsOptions() {
                const monthsOptions = this.data?.specs?.month || [];
                return [{value: '', label: 'Все', displayName: 'Месяц'}, ...monthsOptions];
            },

            yearsOptions() {
                const yearsOptions = this.data?.specs?.year || [];
                return [{value: 0, label: 'Все', displayName: 'Год'}, ...yearsOptions];
            }
        },

        mounted() {
            window.addEventListener('resize', this.closeInDesktop);
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.closeInDesktop);
        },

        methods: {
            onClose() {
                this.$emit('close');
            },

            onInputYear(val) {
                this.yearValue = val;
                this.monthValue = '';
            },

            onInputMonth(val) {
                this.monthValue = val;
            },

            closeInDesktop() {
                if (!['sm', 'xs'].includes(this.breakpoint)) {
                    this.onClose();
                }
            },

            onCardClick(progress) {
                this.dataForGalleryModal = {
                    monthNumber: progress.month_number,
                    month: progress.month,
                    year: progress.year,
                    specs: this.data?.specs,
                    projectSlug: this.data?.projectSlug,
                };
                this.isGalleryModalVisible = true;
            },

            onCloseGalleryModal() {
                this.isGalleryModalVisible = false;
            }
        },
    };
</script>

<style lang="scss" module>
    .ProgressModal {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: $base-0;
    }

    .closeButton {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 2;

        @include respond-to(xs) {
            top: 1.6rem;
            right: 1.6rem;
            width: 4rem;
            height: 4rem;
        }
    }

    .iconCross {
        width: .9rem;
        height: .9rem;
    }

    .progressHeader {
        width: calc(100% - 4.8rem);
        height: unset;
        margin: 0 2.4rem;
        padding: 3rem 0 1.6rem;
        border-bottom: 1px solid $base-100;

        @include respond-to(xs) {
            width: calc(100% - 3.2rem);
            margin: 0 1.6rem;
        }
    }

    .progressTitle {
        margin-bottom: 3rem;
        text-transform: uppercase;
        font-size: 2rem;
        font-weight: 600;
        line-height: 2rem;
        color: $base-800;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.2rem;
        }
    }

    .progressSelects {
        display: flex;
        justify-content: space-between;

        & > * {
            margin-right: 1.2rem;

            &:last-child {
                margin-right: 0;
            }
        }

        :global(.v-select) {
            width: 100%;
        }
    }

    .progressCards {
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        padding: 2.4rem;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }
</style>
