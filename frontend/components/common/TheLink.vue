<template>
    <component :is="component"
               :class="[$style.TheLink, classes]"
               v-bind="link"
    >
        <slot></slot>
    </component>
</template>

<script>
    export default {
        name: 'TheLink',

        props: {
            to: {
                type: String,
                default: ''
            },

            href: {
                type: String,
                default: ''
            }
        },

        computed: {
            component() {
                if (this.to) {
                    return 'nuxt-link';
                }

                if (this.href) {
                    return 'a';
                }

                return 'div';
            },

            link() {
                if (this.to) {
                    return {
                        to: this.to,
                    };
                }

                if (this.href) {
                    return {
                        href: this.href,
                    };
                }

                return {};
            },

            classes() {
                return {
                    [this.$style['is-default']]: this.component === 'div'
                };
            }
        }
    };
</script>

<style lang="scss" module>
    .TheLink {
        &.is-default {
            display: inline;
        }
    }
</style>
