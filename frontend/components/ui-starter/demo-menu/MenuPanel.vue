<template>
    <div
        :class="$style.MenuPanel"
        :style="translating ? {'transition': `all ${timeout}ms ease`} : {}"
    >

        <div
            v-if="list.catTitle"
            :class="[$style.menuHeader, classList]"
            @click="$emit('header-clicked')"
        >
            <span
                v-show="arrow"
                :class="$style.arrow"
            >
            </span>

            {{ list.catTitle }}
        </div>

        <div
            v-else
            :class="$style.headerLink"
            @click="$emit('item-clicked')"
        >
            <nuxt-link
                :class="$style.link"
                to="/"
            >
                На главную
            </nuxt-link>
        </div>

        <VScrollBox
            :class="$style.scrollBox"
            resizable
            skip-offset
        >
            <div
                v-for="(item, index) in list"
                :key="index"
                :class="$style.item"
                @click="onClick($event, item)"
            >
                <template v-if="item.list">
                    <div
                        v-if="item && item.to"
                        :class="[
                            $style.link,
                            isActiveSub(item.to) ? '_exact-link' : ''
                        ]"
                    >
                        {{ item.title }}
                        <span :class="$style.arrow" />
                    </div>
                </template>

                <template v-else>
                    <component
                        :is="handleLinkType(item)"
                        v-if="item.to"
                        :class="[$style.link, {['_exact-link']: item.active}]"
                        :href="item.blank ? item.to : null"
                        :target="item.blank ? '_blank' : null"
                        :to="item.blank ? null : item.to"
                        v-text="item.title"
                    />
                </template>
            </div>
        </VScrollBox>
    </div>
</template>

<script>
import { scrollTo } from '~/assets/js/utils/common-utils';

export default {
    name: 'MenuPanel',

    props: {
        list: {
            type: [Object, Array],
            required: true,
        },

        arrow: {
            type: Boolean,
            default: true,
        },

        translating: {
            type: Boolean,
            default: false,
        },

        timeout: {
            type: Number,
            default: 300,
        },
    },

    computed: {
        currentLocation() {
            const routeArr = this.$route.path.split('/');

            if (routeArr.length > 2) {
                return this.$route.path === this.list?.baseUrl;
            } else {
                return routeArr[1] === this.list?.baseUrl?.split('/')[1];
            }
        },

        classList() {
            return [{
                '_exact-link': this.currentLocation,
            }];
        },
    },

    methods: {
        onClick(e, link) {
            e.preventDefault();
            const anchor = link.to?.hash?.replace(/[^\w]+/g, '');

            if (anchor) {
                this.$nextTick(() => {
                    scrollTo(anchor);
                });
            } else {
                this.$emit('item-clicked', link);
            }
        },

        handleLinkType(link) {
            if (this.currentLocation && link.to?.hash) {
                return 'span';
            }

            return link.blank ? 'a' : 'nuxt-link';
        },

        isActiveSub(item) {
            const routeArr = this.$route.path.split('/');
            const url = item.split('/');
            url.shift();
            routeArr.shift();
            if (url.length === routeArr.length) {
                return routeArr.every(r => url.includes(r));
            } else {
                return routeArr.some(r => url.includes(r));
            }
        },
    },
};
</script>

<style lang="scss" module>
    $primary-color: $body-color;
    $second-color: $violet;
    $header-mobile-h: 0;

    .scrollBox {
        overflow-y: auto;
        height: 100%;
    }

    .menuHeader,
    .link {
        display: flex;
        align-items: center;
        width: 100%;
        font-size: 14px;
        color: $primary-color;
        transition: color .3s ease;
        cursor: pointer;
        user-select: none;

        &:global(._exact-link),
        &:active,
        &:hover {
            color: $second-color;
        }
    }

    .headerLink {
        margin-top: 1.4rem;
        font-weight: bold;
    }

    .link {
        justify-content: space-between;
        padding: 2.4rem 4rem;

        @include respond-to(tablet) {
            padding: 42px 40px;
        }
    }

    .menuHeader {
        justify-content: center;
        margin-top: 1.4rem;
        padding: 4.2rem 0;
        font-weight: bold;

        .arrow {
            position: absolute;
            left: 4.2rem;
            transform: rotate(135deg);
        }
    }

    .item {
        border-top: 1px solid #e9ebf0;

        &:last-child {
            margin-bottom: $header-h;

            @include respond-to(tablet) {
                margin-bottom: $header-mobile-h;
            }
        }

        .arrow {
            transform: rotate(-45deg);
        }
    }

    .arrow {
        display: inline-block;
        padding: 2px;
        border: solid;
        border-width: 0 2px 2px 0;
    }
</style>
