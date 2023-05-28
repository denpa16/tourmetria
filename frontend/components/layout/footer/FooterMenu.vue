<template>
    <div :class="$style.FooterMenu">
        <div :class="$style.footerMenuInner">
            <FooterMenuCol
                title="Проекты"
                link="/projects"
                :list="projectsList"
                :class="[$style.col, $style.projectCol]"
            />

            <div :class="$style.columnsWrapper">
                <div :class="$style.row">
                    <FooterMenuCol
                        title="Проекты"
                        link="/projects"
                        href=""
                        :list="projectsList"
                        :class="[$style.col, $style.projectColMobile]"
                    />
                    <FooterMenuCol
                        title="Квартиры"
                        link="/selection/flats"
                        href=""
                        :list="flatsList"
                        :class="$style.col"
                    />
                    <FooterMenuCol
                        title="Способы покупки"
                        link=""
                        href="/how-buy"
                        :list="purchaseWaysList"
                        :class="$style.col"
                    />
                    <FooterMenuCol
                        title="Компания"
                        link=""
                        href="/about"
                        :list="companyList"
                        :class="$style.col"
                    />
                </div>

                <div :class="[$style.row, $style.desktopRow]">
                    <FooterMenuCol
                        :list="propertiesList"
                        :class="[$style.col, $style._noBorder]"
                        only-sublinks
                    />
                    <FooterMenuCol
                        :list="newsList"
                        :class="[$style.col, $style._noBorder]"
                        only-sublinks
                    />
                    <div :class="[$style.col, $style._noBorder]">
                        <FooterMenuCol
                            :list="aboutList"
                            only-sublinks
                        />
                        <div :class="$style.text"
                             v-html="footerText"></div>
                    </div>
                </div>

                <ul :class="[$style.mobileRow]">
                    <li v-for="(item, index) of newsList"
                        :key="`${index}-${item.name}`"
                        :class="$style.sublinkWrapper">
                        <TheLink :class="[$style.sublink, 'p6']"
                                 :to="item.to"
                                 :href="item.href"
                                 :target="item.target">
                            {{ item.name }}
                        </TheLink>
                    </li>

                    <li v-for="(item, index) of aboutList"
                        :key="index"
                        :class="$style.sublinkWrapper">
                        <TheLink :class="[$style.sublink, 'p6']"
                                 :to="item.to"
                                 :href="item.href"
                                 :target="item.target">
                            {{ item.name }}
                        </TheLink>
                    </li>
                </ul>
            </div>
        </div>

        <div :class="$style.mobileCol">
            <SocialsPanel :socials="socials" />
            <div :class="$style.text"
                 v-html="footerText"></div>
        </div>
    </div>
</template>

<script>
    import FooterMenuCol from '~/components/layout/footer/FooterMenuCol';
    import SocialsPanel from '~/components/common/SocialsPanel';
    import TheLink from '~/components/common/TheLink';

    export default {
        name: 'FooterMenu',

        components: {
            FooterMenuCol,
            SocialsPanel,
            TheLink,
        },

        props: {
            flatsList: {
                type: Array,
                default: () => [],
            },

            purchaseWaysList: {
                type: Array,
                default: () => [],
            },

            companyList: {
                type: Array,
                default: () => [],
            },

            projectsList: {
                type: Array,
                default: () => [],
            },

            propertiesList: {
                type: Array,
                default: () => [],
            },

            newsList: {
                type: Array,
                default: () => [],
            },

            aboutList: {
                type: Array,
                default: () => [],
            },

            footerText: {
                type: String,
                default: '',
            },

            socials: {
                type: Array,
                default: () => [],
            }
        },
    };
</script>

<style lang="scss" module>
    .FooterMenu {
        width: 100%;

        @include respond-to(sm) {
            display: flex;
            border-top: 1px solid $base-100;
        }

        @include respond-to(xs) {
            flex-direction: column;
        }
    }

    .footerMenuInner {
        display: flex;
        width: 100%;

        @include respond-to(sm) {
            flex: 1;
            width: unset;
            flex-direction: column;
        }
    }

    .col {
        padding-top: 1.6rem;
        border-top: 1px solid $base-100;

        &._noBorder {
            padding-top: 0;
            border-top: unset;
        }

        @include respond-to(sm) {
            border-top: unset;
        }
    }

    .projectCol {
        width: calc(25% - 1.6rem);
        margin-right: 1.6rem;

        @include respond-to(sm) {
            display: none;
        }
    }

    .projectColMobile {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }

    .columnsWrapper {
        flex: 1;

        @include respond-to(sm) {
            display: flex;
            width: 100%;
        }

        @include respond-to(xs) {
            // display: flex;
            // flex-direction: column;
        }
    }

    .row {
        display: flex;
        width: 100%;

        &:not(:first-child) {
            margin-top: 3.2rem;
        }

        & .col {
            width: calc(33.33333% - 1.6rem);

            &:not(:last-child) {
                margin-right: 1.6rem;
            }

            @include respond-to(sm) {
                flex: unset;
                width: 100%;
            }
        }

        &.desktopRow {
            @include respond-to(sm) {
                display: none;
            }
        }

        @include respond-to(sm) {
            flex: 1;
            flex-direction: column;
            width: unset;
        }
    }

    .text {
        margin-top: 4.8rem;
        font-family: $accent-font-family;
        font-size: 1rem;
        line-height: 1.6rem;
        color: $base-300;

        @include respond-to(sm) {
            margin-top: 3.2rem;
        }
    }

    .mobileRow {
        display: none;

        @include respond-to(sm) {
            display: block;
            flex: 1;
        }

        @include respond-to(xs) {
            flex: unset;
            min-width: 10rem;
        }
    }

    .sublinkWrapper {
        padding-top: 1.6rem;
    }

    .mobileCol {
        display: none;
        flex-direction: column;
        align-items: flex-end;
        width: 36%;
        padding-top: 1.6rem;

        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            align-items: flex-start;
            width: 100%;
            padding-top: 3.2rem;
        }
    }
</style>
