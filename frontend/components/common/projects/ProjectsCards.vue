<template>
    <div :class="$style.ProjectsCards">
        <transition v-if="projects.length"
                    name="fade-content"
                    mode="out-in">
            <div :class="$style.wrap">
                <ProjectCard v-for="(project, idx) of projectsList"
                             :key="project.id"
                             :class="$style.card"
                             :project="project"
                             :style="`order: ${idx + 1}`"
                />
                <div v-if="promoList.length"
                     :class="[$style.card, $style.promoCard]"
                     :style="{order: 3}">
                    <PromotionCard :promotion="promoList[0]"
                                   :preferred-project-slug="preferredProjectSlugs"
                                   mobile-images />
                </div>
                <div v-if="promoList.length > 1 && projects.length > 7"
                     :class="[$style.card, $style.promoCard]"
                     :style="promoStyle">
                    <PromotionCard :promotion="promoList[1]"
                                   :preferred-project-slug="preferredProjectSlugs"
                                   mobile-images />
                </div>
            </div>
        </transition>
        <transition v-else
                    name="fade-content"
                    mode="out-in">
            <div>
                <div :class="$style.emptyProjects">
                    <p :class="['h4', 'c-base300', $style.emptyText]">
                        По заданным параметрам проектов нет.
                    </p>
                    <p :class="['h4', $style.emptyText]">
                        Измените параметры и попробуйте снова
                    </p>
                    <VButton color="light"
                             :class="$style.emptyBtn"
                             @click="$emit('open-call-modal')">
                        Консультация
                    </VButton>
                </div>
            </div>
        </transition>

        <div v-if="mainPage && hasNext && pagiCount > 0"
             :class="$style.btnWrapper">
            <VButton
                color="light"
                :class="$style.btn"
                @click="loadMore"
            >
                <span>+ {{ pagiCount }} {{ pagiCount | plural(['проект', 'проекта', 'проектов']) }}</span>
            </VButton>
        </div>
    </div>
</template>

<script>
    import ProjectCard from '~/components/common/projects/project/ProjectCard';
    import PromotionCard from '~/components/common/promotions/PromotionCard';

    export default {
        name: 'ProjectsCards',

        components: {
            ProjectCard,
            PromotionCard,
        },

        props: {
            projects: {
                type: Array,
                default: () => [],
            },

            mainPage: {
                type: Boolean,
                default: false,
            },

            promoList: {
                type: Array,
                default: () => [],
            }
        },

        data() {
            return {
                lastIndex: 10,
                pagiCount: 0,
                isLoadedMore: false,
            };
        },

        computed: {
            promoStyle() {
                return this.isLoadedMore ? {order: 10} : {order: 9};
            },

            projectsList() {
                if (this.mainPage) {
                    return this.projects.slice(0, this.lastIndex);
                }
                return this.projects;
            },

            hasNext() {
                return this.lastIndex < this.projects.length;
            },

            preferredProjectSlugs() {
                return this.projects.map(project => project.slug);
            }
        },

        mounted() {
            this.pagiCount = this.projects.length - this.lastIndex;
        },

        methods: {
            loadMore() {
                this.isLoadedMore = true;
                if (this.lastIndex < this.projects.length) {
                    this.lastIndex += this.pagiCount;
                    this.pagiCount = this.projects.length - this.lastIndex;
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectsCards {
        //
    }

    .wrap {
        display: flex;
        flex-wrap: wrap;
        margin: -.8rem;
    }

    .card {
        width: 33.333333333%;
        min-height: 58.4rem;
        padding: .8rem;

        @include respond-to(sm) {
            width: 50%;
            min-height: 52rem;
        }

        @include respond-to(xs) {
            width: 100%;
            min-height: 50.8rem;
        }
    }

    .promoCard {
        @include respond-to(xs) {
            height: 50.8rem;
        }
    }

    .btnWrapper {
        margin-top: 5.6rem;
        text-align: center;

        @include respond-to(sm) {
            margin-top: 3.2rem;
        }
    }

    .btn {
        @include respond-to(sm) {
            width: 100%;
        }
    }

    .emptyProjects {
        padding: 15rem 0 19.2rem 0;
        text-align: center;

        @include respond-to(sm) {
            padding: 18.4rem 0 15.2rem 0;
        }

        @include respond-to(sm) {
            padding: 8rem 0 8rem 0;
        }
    }

    .emptyText {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.6rem;
        }
    }

    .emptyBtn {
        margin-top: 2.4rem;
    }
</style>
