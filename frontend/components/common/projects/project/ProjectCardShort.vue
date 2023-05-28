<template>
    <div :class="$style.ProjectCardShort">
        <div :class="$style.tags">
            <VTag v-if="project.deadline_year"
                  color="white">
                {{ deadlineText }}
            </VTag>
        </div>

        <VSquareButton size="xsmall"
                       :class="$style.btn"
                       role="presentation"
                       tabindex="-1">
            <IconArrowRight :class="$style.icon" />
        </VSquareButton>

        <ImageLazy
            :preview="image_preview"
            :image="image_display"
        />

        <div :class="$style.info">
            <p :class="[$style.text, 'h4', 'c-base0']">
                {{ project.name }}
            </p>
            <!-- todo заменить значение как будет готово на беке-->
            <p :class="[$style.text, 'h4', 'c-blue']">
                от 4.9 млн Р
            </p>
        </div>
    </div>
</template>

<script>
    import {isDeadlinePassed} from '~/assets/js/utils/numberUtils';
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowRight from '~/components/icons/IconArrowRight';

    export default {
        name: 'ProjectCardShort',

        components: {
            IconArrowRight,
            ImageLazy,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            image_preview() {
                return this.project?.project_card_images[0]?.image_preview || '';
            },

            image_display() {
                return this.project?.project_card_images[0]?.image_display || '';
            },

            deadlineText() {
                const quarter = this.project.deadline_quarter;
                const year = this.project.deadline_year;

                if (isDeadlinePassed(year, quarter)) {
                    return 'Объект сдан';
                }

                if (quarter && year) {
                    return `Срок сдачи ${quarter} кв. ${year}`;
                }

                if (year) {
                    return `Срок сдачи ${year} г.`;
                }

                return '';
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectCardShort {
        position: relative;
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        width: 100%;
        height: 23.5rem;
        border-radius: .8rem;

        &:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 2;
            width: 100%;
            height: 70%;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
            opacity: .5;
        }
    }

    .tags {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        padding: 1.6rem 4rem 1.6rem 1.6rem;
    }

    .btn {
        position: absolute;
        top: 1.6rem;
        right: 1.6rem;
        z-index: 2;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .info {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        padding: 1.6rem;
        text-transform: uppercase;
    }
</style>
