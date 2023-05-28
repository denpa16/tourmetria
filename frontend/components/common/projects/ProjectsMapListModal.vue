<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.ProjectsMapListModal, {[$style._geography]: isGeographyModal}]">
            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="$style.content">
                    <div :class="$style.closeBtn">
                        <VSquareButton color="white"
                                       aria-label="Закрыть"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>

                    <div :class="$style.head">
                        <div :class="$style.title">
                            <span class="c-base300">{{
                                projects.length
                            }} {{ projects.length | plural(['проект', 'проекта', 'проектов']) }}</span>
                        </div>

                        <div :class="$style.closeBtnMobile">
                            <VSquareButton color="light"
                                           size="small"
                                           aria-label="Закрыть"
                                           @click="$emit('close')">
                                <IconPlus :class="$style.closeBtnIcon" />
                            </VSquareButton>
                        </div>
                    </div>

                    <div ref="list"
                         :class="$style.cards">
                        <ProjectsMapList :project-list="projects"
                                         :active-id="activeId"
                                         @change-id="handleChangeId"
                        />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';
    import ProjectsMapList from '~/components/common/projects/ProjectsMapList';

    export default {
        name: 'ProjectsMapListModal',

        components: {
            IconPlus,
            ProjectsMapList,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                activeId: null,
            };
        },

        computed: {
            projects() {
                return this.data.projects || [];
            },

            activeProjectId() {
                return this.data.activeProjectId || null;
            },

            isGeographyModal() {
                return this.data.geographyModal || false;
            }
        },

        mounted() {
            if (!this.isGeographyModal) {
                this.activeId = this.activeProjectId;
            }
        },

        methods: {
            handleChangeId(val) {
                if (this.activeId === val) {
                    this.activeId = null;
                } else {
                    this.activeId = val;
                    this.$nextTick(() => {
                        if (this.isGeographyModal) {
                            return;
                        }
                        this.data.changeId(val);
                    });
                }
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectsMapListModal {
        z-index: 200;
    }

    .wrap {
        align-items: center;
    }

    .content {
        position: relative;
        width: 54.6rem;
        min-height: 90%;
        max-height: calc(100% - 2.4rem);
        margin-top: auto;
        border-radius: 1.6rem 1.6rem 0 0;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(xs) {
            width: 100%;
            min-height: 95%;
            max-height: calc(100% - 1.6rem);
        }
    }

    .head {
        padding: 2.4rem;

        @include respond-to(xs) {
            position: relative;
            padding: 3.4rem 1.6rem 2.6rem;
        }
    }

    .title {
        text-transform: uppercase;
        font-size: 2rem;
        font-weight: 600;
        line-height: 2.8rem;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: unset;
        }
    }

    .closeBtnMobile {
        position: absolute;
        top: 2.4rem;
        right: 1.6rem;
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .closeBtn {
        position: absolute;
        top: 0;
        left: calc(100% + 1.2rem);

        @include respond-to(xs) {
            display: none;
        }
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .cards {
        overflow: auto;
        height: calc(100% - 7.6rem);
        padding: 0 2.4rem;

        @include respond-to(xs) {
            padding: 0 1.6rem;
        }
    }
</style>
