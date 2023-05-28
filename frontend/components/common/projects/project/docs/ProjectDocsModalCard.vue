<template>
    <component :is="elem"
               :class="$style.ProjectDocsModalCard">
        <a :href="file.file"
           target="_blank"
           :class="$style.wrapper"
           @click="handleLinkClick">
            <div :class="$style.content">
                <div class="p2">
                    {{ file.name }}
                </div>
                <div :class="[$style.contentFooter, 'p6', 'c-base400']">
                    <ProjectDocsModalCardLink
                        :class="[$style.link, $style._tablet]"
                        :link="file.file"
                        @click.native="handleLinkClick"
                    />
                    <span>{{ size }}</span>
                    <transition name="fade-content">
                        <span v-show="isVisited"
                              :class="$style.status">
                            Просмотрено
                        </span>
                    </transition>
                </div>
            </div>
            <ProjectDocsModalCardLink
                :class="$style.link"
                :link="file.file"
                @click.native="handleLinkClick"
            />
        </a>
    </component>
</template>

<script>
    import ProjectDocsModalCardLink from '~/components/common/projects/project/docs/ProjectDocsModalCardLink';
    import {bytesToSize} from '~/assets/js/utils/commonUtils';
    export default {
        name: 'ProjectDocsModalCard',

        components: {
            ProjectDocsModalCardLink
        },

        props: {
            elem: {
                type: String,
                default: 'li'
            },

            file: {
                type: Object,
                default: () => ({})
            },

            visitedLinks: {
                type: Array,
                default: () => []
            }
        },

        computed: {
            isVisited() {
                return this.visitedLinks.includes(this.file?.file);
            },

            size() {
                return bytesToSize(this.file?.get_file_size);
            },
        },

        methods: {
            handleLinkClick() {
                this.$emit('visit-link', this.file?.file);
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectDocsModalCard {
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            transform: scale(1.015);
        }
    }

    .wrapper {
        display: flex;
        justify-content: space-between;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;

        @include respond-to(sm) {
            width: 100%;
        }
    }

    .contentFooter {
        display: flex;
        margin-top: .8rem;

        @include respond-to(sm) {
            align-items: center;
        }
    }

    .link {
        @include respond-to(sm) {
            display: none;
        }

        &._tablet {
            display: none;

            @include respond-to(sm) {
                display: flex;
            }
        }
    }

    .status {
        position: relative;
        margin-left: 2rem;

        @include respond-to(sm) {
            margin-left: auto;
        }

        &:before {
            content: "";
            position: absolute;
            top: 50%;
            left: -.8rem;
            width: .4rem;
            height: .4rem;
            border-radius: 50%;
            background-color: $blue;
            transform: translateY(-50%) translateX(-100%);

            @include respond-to(sm) {
                display: none;
            }
        }
    }
</style>
