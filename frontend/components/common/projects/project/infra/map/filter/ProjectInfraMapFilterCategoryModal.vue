<template>
    <TemplateBottomModal
        :class="$style.ProjectInfraMapFilterCategoryModal"
        :visible="visible"
        :data="modalData"
        @close="closeModal"
    >
        <div :class="$style.wrapper">
            <ProjectInfraMapFilterCategory
                :class="$style.content"
                :filter-values="currentValue"
                :infras-categories="infrasCategories"
                @change="handleChange"
            />

            <div :class="$style.btns">
                <VButton :class="$style.btn"
                         color="light"
                         @click="resetFilters"
                >
                    Сбросить
                </VButton>
                <VButton :class="$style.btn"
                         color="primary"
                         @click="updateFilters"
                >
                    Применить
                </VButton>
                <VButton :class="[$style.btn, $style._wide]"
                         color="white"
                         @click="openRouter"
                >
                    Проложить маршрут на Я.Картах
                </VButton>
            </div>
        </div>
    </TemplateBottomModal>
</template>

<script>
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import ProjectInfraMapFilterCategory from '~/components/common/projects/project/infra/map/filter/ProjectInfraMapFilterCategory';
    export default {
        name: 'ProjectInfraMapFilterCategoryModal',

        components: {
            ProjectInfraMapFilterCategory,
            TemplateBottomModal
        },

        props: {
            visible: {
                type: Boolean,
                default: false,
            },

            modalData: {
                type: Object,
                default: () => ({})
            },

            value: {
                type: Array,
                default: () => []
            },

            infrasCategories: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                currentValue: this.value
            };
        },

        watch: {
            value(newValue) {
                this.currentValue = newValue;
            }
        },

        methods: {
            handleChange(value) {
                this.currentValue = value;
            },

            updateFilters() {
                this.$emit('update-filters', 'category', this.currentValue);
                this.closeModal();
            },

            resetFilters() {
                this.currentValue = [];
                this.updateFilters();
            },

            openRouter() {
                this.$emit('open-route-modal');
            },

            closeModal() {
                this.$emit('close');
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraMapFilterCategoryModal {
        z-index: 100;
    }

    .wrapper {
        padding-bottom: 2.4rem;

        @include respond-to(xs) {
            padding-bottom: 2.4rem;
        }
    }

    .btns {
        display: flex;
        flex-wrap: wrap;
        margin-top: 2.4rem;
    }

    .btn {
        flex: 1;

        &:first-child {
            margin-right: 1.2rem;
        }

        &._wide {
            min-width: 100%;
            margin-top: 1.2rem;

            @include respond-to(xs) {
                display: none;
            }
        }
    }
</style>
