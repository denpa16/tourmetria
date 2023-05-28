<template>
    <div :class="$style.TagsList">
        <VTag v-for="(tag, index) in tags.slice(0, shownTagsCount)"
              :key="index"
              :class="$style.tag"
              :label="tag.label"
              :color="tag.color"
              :link="tag.link"
              :blank="tag.blank"
        />

        <VTooltip v-if="tags.length > shownTagsCount"
                  top
                  :nudge="12">
            <template #activator>
                <VTag
                    :class="[$style.tag, $style._plus]"
                    :label="`+${tags.length - shownTagsCount}`"
                    :color="colorActivator"
                />
            </template>
            <div :class="$style.tooltip">
                <VTag v-for="(tag, index) in tags.slice(shownTagsCount)"
                      :key="index"
                      :class="$style.tag"
                      :label="tag.label"
                      :color="colorAdditionalTags"
                />
            </div>
        </VTooltip>
    </div>
</template>

<script>
    export default {
        name: 'TagsList',

        props: {
            tags: {
                type: Array,
                default: () => [],
            },

            shownTagsCount: {
                type: Number,
                default: 2,
            },

            colorActivator: {
                type: String,
                default: 'light',
                validator(value) {
                    return ['primary', 'white', 'light', 'transparent'].indexOf(value) !== -1;
                },
            },

            colorAdditionalTags: {
                type: String,
                default: 'light',
                validator(value) {
                    return ['primary', 'white', 'light', 'transparent'].indexOf(value) !== -1;
                },
            },
        },
    };
</script>

<style lang="scss" module>
    .TagsList {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    .tag {
        margin-bottom: .4rem;

        &:not(:last-child) {
            margin-right: .4rem;
        }
    }

    .tooltip {
        display: flex;
        flex-wrap: wrap;
        max-width: 20rem;
        padding: 1rem 1rem .6rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        &:before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 0;
            height: 0;
            border-color: $base-0 transparent transparent transparent;
            border-style: solid;
            border-width: .6rem .6rem 0 .6rem;
            transform: translateX(-50%);
        }
    }
</style>
