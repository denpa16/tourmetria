<template>
    <div :class="$style.FooterMenuCol">
        <div v-if="title"
             :class="[$style.link, 'p6']"
             @click="handleClick({link, href})">
            <span :class="$style.title">{{ title }}</span>
            <IconArrowLeft :class="[$style.icon, {[$style._opened]: isListOpened}]" />
        </div>
        <ul ref="list"
            :class="[$style.links, {[$style.onlySublinks]: onlySublinks}]"
        >
            <li v-for="(item, index) of list"
                :key="`${index}-${item.name}`"
                :class="$style.sublinkWrapper">
                <TheLink :class="[$style.sublink, 'p6', {[$style.onlySublinks]: onlySublinks}]"
                         :to="item.to"
                         :href="item.href"
                         :target="item.target">
                    {{ item.name }}
                </TheLink>
            </li>
        </ul>
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import TheLink from '~/components/common/TheLink';


    export default {
        name: 'FooterMenuCol',

        components: {IconArrowLeft, TheLink},

        props: {
            title: {
                type: String,
                default: '',
            },

            link: {
                type: String,
                default: '',
            },

            href: {
                type: String,
                default: '',
            },

            list: {
                type: Array,
                default: () => [],
            },

            onlySublinks: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                isListOpened: false,
            };
        },

        methods: {
            handleClick(val) {
                if (this.$deviceIs.laptop || this.$deviceIs.desktop) {
                    if (val.link) {
                        this.$router.push(val.link);
                    } else if (val.href) {
                        window.open(val.href, '_blank');
                    }
                } else if (this.$refs.list.style.maxHeight) {
                    this.$refs.list.style.maxHeight = null;
                    this.isListOpened = false;
                } else {
                    this.$refs.list.style.maxHeight = this.$refs.list.scrollHeight + 'px';
                    this.isListOpened = true;
                }
            }
        }
    };
</script>

<style lang="scss" module>
    .FooterMenuCol {
        //
    }

    .link {
        color: $base-600;
        transition: $default-color-transition;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;

        @include hover {
            color: $blue;
        }

        @include respond-to(sm) {
            display: flex;
            align-items: center;
        }
    }

    .title {
        white-space: nowrap;

        @include respond-to(sm) {
            margin-right: .4rem;
        }
    }

    .icon {
        display: none;

        @include respond-to(sm) {
            display: block;
            width: 1.2rem;
            min-width: 1.2rem;
            height: 1.2rem;
            transform: rotate(-90deg);
            transition: transform .2s ease-out;

            &._opened {
                transform: rotate(90deg);
            }
        }
    }

    .links {
        padding-top: 4.8rem;

        &.onlySublinks {
            padding-top: 0;
        }

        @include respond-to(sm) {
            overflow: hidden;
            max-height: 0;
            padding-top: 0;
            transition: max-height .2s ease-out;
        }
    }

    .sublinkWrapper {
        &:not(:last-child) {
            margin-bottom: .8rem;
        }

        @include respond-to(sm) {
            &:first-child {
                margin-top: 2rem;
            }
        }
    }

    .sublink {
        white-space: nowrap;
        color: $base-300;
        transition: $default-color-transition;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;

        &.onlySublinks {
            color: $base-600;
        }

        @include hover {
            color: $blue;
        }
    }
</style>
