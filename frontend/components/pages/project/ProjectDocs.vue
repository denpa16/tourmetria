<template>
    <div :class="[$style.ProjectDocs, 'container']">
        <ul :class="$style.docs">
            <ProjectDocsCard v-for="doc in documents"
                             :key="doc.name"
                             :class="$style.docCard"
                             elem="li"
                             :title="doc.name"
                             @click.native="openModal(doc.name)"
            />
        </ul>

        <ProjectDocsCard :class="[$style.docCard, $style._mobile]"
                         elem="li"
                         title="застройщика"
                         @click.native="openModal()" />

        <ProjectDocsModal :visible="isModalVisible"
                          :data="data"
                          @close="closeModal" />

        <transition name="overlay-appear">
            <Overlay v-if="isModalVisible"
                     @click="closeModal" />
        </transition>
    </div>
</template>

<script>
    import Overlay from '~/components/layout/modals/Overlay';
    import ProjectDocsCard from '~/components/common/projects/project/docs/ProjectDocsCard';
    import ProjectDocsModal from '~/components/common/projects/project/docs/ProjectDocsModal';

    export default {
        name: 'ProjectDocs',

        components: {
            Overlay,
            ProjectDocsModal,
            ProjectDocsCard
        },

        props: {
            documents: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                isModalVisible: false,
                category: '',
            };
        },

        computed: {
            options() {
                return this.documents.map(({name}) => ({
                    value: name,
                    label: name,
                }));
            },

            data() {
                return {
                    options: this.options,
                    initialCategory: this.category,
                    documents: this.documents,
                };
            }
        },

        methods: {
            openModal(title) {
                this.isModalVisible = true;
                if (title) {
                    this.category = title;
                    return;
                }
                this.category = this.documents[0]?.name;
            },

            closeModal() {
                this.isModalVisible = false;
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectDocs {
        padding-top: 2.4rem;
        padding-bottom: 4rem;

        @include respond-to(sm) {
            padding-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            background-color: $base-50;
        }

        & :global(.v-select__value) {
            font-size: 2rem;
            line-height: 2.8rem;
        }
    }

    .docs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.6rem;
        padding-bottom: 2.4rem;
        border-bottom: .1rem solid $base-100;
        transition: all $default-transition;

        @include respond-to(sm) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .docCard {
        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: flex;
            }
        }
    }
</style>
