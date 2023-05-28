<template>
    <TheAccordion :title="title"
                  :value="value"
                  :postfix="postfix"
                  :title-class="$style.title"
                  :icon-class="$style.icon"
                  @change="handleClick">
        <ul :class="$style.links">
            <li v-for="(item, index) of list"
                :key="index"
                :class="$style.link">
                <TheLink :href="item.href"
                         :target="item.target"
                         :to="item.to"
                         :class="[$style.sublink, 'h6']"
                         @click.native="$emit('close')">
                    {{ item.label }}
                </TheLink>
            </li>
        </ul>
    </TheAccordion>
</template>

<script>
    import TheLink from '~/components/common/TheLink';
    import TheAccordion from '~/components/common/TheAccordion';

    export default {
        name: 'HeaderMenuAccordion',

        components: {TheAccordion, TheLink},

        props: {
            title: {
                type: String,
                default: '',
            },

            postfix: {
                type: String,
                default: '',
            },

            list: {
                type: Array,
                default: () => [],
            },

            value: {
                type: [String, Boolean, Number],
                default: false,
            }
        },

        methods: {
            handleClick(value) {
                if (value) {
                    this.$emit('click', this.title);
                    return;
                }

                this.$emit('click');
            }
        }
    };
</script>

<style lang="scss" module>
    .FooterMenuCol {
        //
    }

    .title {
        justify-content: flex-start;
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;
        margin-left: .8rem;
        color: $blue;
    }

    .links {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding-top: 3.2rem;
        row-gap: 3.2rem;
        column-gap: .8rem;
    }

    .link {
        line-height: 1;
        color: $base-800;
        transition: color $default-color-transition;

        @include hover {
            color: $blue;
        }
    }
</style>
