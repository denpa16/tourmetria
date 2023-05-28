<template>
    <TemplateRightModal :class="$style.ProjectDocsModal"
                        :visible="visible"
                        title="Документы"
                        additional-title="Прочитать и скачать"
                        @close="$emit('close')"
                        @after-enter="$emit('after-enter')"
                        @before-leave="$emit('before-leave')"
                        @after-leave="$emit('after-leave')">
        <template #default>
            <transition name="fade-content"
                        mode="out-in">
                <ul :key="category"
                    :class="$style.docsList">
                    <ProjectDocsModalCard
                        v-for="file in currentFiles"
                        :key="file.fileName"
                        :file="file"
                        :visited-links="visitedLinks"
                        :class="$style.docCard"
                        @visit-link="handleVisitLink"
                    />
                </ul>
            </transition>
        </template>

        <template #subtitle>
            <VSelect :class="$style.select"
                     size="large"
                     :value="category"
                     :options="options"
                     @input="handleSelectInput" />
        </template>
    </TemplateRightModal>
</template>

<script>
    import TemplateRightModal from '~/components/layout/modals/templates/TemplateRightModal';
    import ProjectDocsModalCard from '~/components/common/projects/project/docs/ProjectDocsModalCard';

    export default {
        name: 'ProjectDocsModal',

        components: {
            ProjectDocsModalCard,
            TemplateRightModal
        },

        props: {
            visible: {
                type: Boolean,
                default: false,
            },

            data: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                category: '',
                visitedLinks: [],
            };
        },

        computed: {
            options() {
                return this.data?.options || [];
            },

            initialCategory() {
                return this.data?.initialCategory || '';
            },

            documents() {
                return this.data?.documents || [];
            },

            currentFiles() {
                const currentCategory = this.documents.find(({name}) => name === this.category);

                if (currentCategory) {
                    return currentCategory.documents;
                }

                return [];
            }
        },

        watch: {
            initialCategory(value) {
                if (value) {
                    this.category = value;
                } else {
                    this.category = this.docs[0]?.name || '';
                }
            }
        },

        beforeMount() {
            this.loadVisitedLinks();
        },

        methods: {
            handleVisitLink(link) {
                if (!this.visitedLinks.includes(link)) {
                    this.visitedLinks = [...this.visitedLinks, link];
                    sessionStorage.setItem('docsVisitedLinks', JSON.stringify(this.visitedLinks));
                }
            },

            handleSelectInput(value) {
                this.category = value;
            },

            loadVisitedLinks() {
                const savedData = sessionStorage.getItem('docsVisitedLinks');
                if (savedData) {
                    this.visitedLinks = JSON.parse(savedData);
                }
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectDocsModal {
        //
    }

    .docsList {
        display: flex;
        flex-direction: column;
    }

    .docCard {
        margin-bottom: .8rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
