<template>
    <div :class="[$style.ProjectMapListItem, {[$style._active]: active}]">
        <div :class="$style.head"
             @click="$emit('click', project.id)">
            <p :class="$style.title">
                {{ project.name }}
            </p>
            <p :class="[$style.title, $style.minPrice, 'c-blue']">
                от {{ project.flat_min_price | splitShort }} млн р
            </p>
            <IconArrowLeft :class="$style.headIcon" />
        </div>
        <ProjectCardRealty :class="$style.info"
                           :project="project"
                           :btn-text="($deviceIs.laptop || $deviceIs.desktop) ? 'Смотреть проект' : 'Подробнее о проекте'"
        />
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import ProjectCardRealty from '~/components/common/projects/project/ProjectCardRealty';

    export default {
        name: 'ProjectMapListItem',

        components: {
            IconArrowLeft,
            ProjectCardRealty,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },

            activeId: {
                type: Number,
                default: null,
            }
        },

        computed: {
            active() {
                return this.project.id === this.activeId;
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectMapListItem {
        margin-bottom: .8rem;

        &._active {
            .head {
                border-bottom: 1px solid $base-100;
            }

            .headIcon {
                transform: translateY(-50%) rotate(90deg);
            }

            .info {
                max-height: 50rem;
            }

            .minPrice {
                @include respond-to(sm) {
                    max-height: 0;
                    opacity: 0;
                }
            }
        }
    }

    .head {
        position: relative;
        padding: 1.5rem 1.6rem;
        border-radius: .4rem;
        border-bottom: 1px solid transparent;
        background-color: $base-50;
        transition: all $default-color-transition;
        cursor: pointer;

        @include hover {
            background-color: $base-110;
        }
    }

    .minPrice {
        @include respond-to(sm) {
            overflow: hidden;
            max-height: 10rem;
            opacity: 1;
            transition: all .3s linear;
        }
    }

    .headIcon {
        position: absolute;
        top: 50%;
        right: 1.6rem;
        width: 1.2rem;
        height: 1.2rem;
        transform: translateY(-50%) rotate(-90deg);
        transition: transform $default-color-transition;
    }

    .title {
        text-transform: uppercase;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.9rem;
    }

    .info {
        overflow: hidden;
        max-height: 0;
        background-color: $base-50;
        transition: max-height .4s;
    }
</style>
