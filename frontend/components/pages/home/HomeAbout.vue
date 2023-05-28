<template>
    <div :class="$style.HomeAbout">
        <p :class="$style.aboutLabel">
            <IconAboutCompany :class="$style.aboutIcon" />
            <span>О компании</span>
        </p>
        <div :class="$style.container">
            <h2
                :class="[$style.aboutTitle, 'h2']"
                v-html="aboutCompany.title"
            >
            </h2>
            <h2
                :class="[$style.aboutTitle, [$style._subtitle],'h2']"
                v-html="aboutCompany.subtitle"
            >
            </h2>
            <div :class="$style.aboutDescription">
                <p
                    :class="['p4', $style._first]"
                    v-html="aboutCompany.first_description"
                >
                </p>
                <p
                    class="p4"
                    v-html="aboutCompany.second_description"
                >
                </p>
            </div>
            <ul :class="$style.advantageList">
                <li v-for="item in advantageList"
                    :key="item.id"
                    :class="$style.advantageItem">
                    <h3 :class="[$style.advantageTitle, 'h3']">
                        {{ item.title }}
                    </h3>
                    <p :class="[$style.advantageDescription, 'p3']">
                        {{ item.description }}
                    </p>
                </li>
            </ul>
            <VButton :class="[$style.aboutBtn]"
                     link="/about"
                     size="large-resp"
                     blank>
                О компании
            </VButton>
        </div>
    </div>
</template>

<script>
    import IconAboutCompany from '~/components/icons/IconAboutCompany';
    export default {
        name: 'HomeAbout',
        components: {IconAboutCompany},
        props: {
            aboutCompany: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {};
        },

        computed: {
            advantageList() {
                return [
                    {
                        id: 0,
                        title: this.aboutCompany.area,
                        description: 'квадратных метров построили'
                    },
                    {
                        id: 1,
                        title: this.aboutCompany.families,
                        description: 'семей проживают в наших проектах'
                    },
                    {
                        id: 2,
                        title: this.aboutCompany.facilities,
                        description: 'объектов сданы точно в срок'
                    },
                    {
                        id: 3,
                        title: this.aboutCompany.years,
                        description: 'лет на рынке'
                    },
                ];
            }
        },
    };
</script>

<style lang="scss" module>
    .HomeAbout {
        position: relative;
        display: flex;
        padding: 10.4rem 4.4rem 5.4rem;
        background: url("/images/vectorTop.svg") no-repeat top left, url("/images/vectorBottom.svg") no-repeat bottom left, $base-800;
        background-size: contain;

        @include respond-to(sm) {
            padding: 17.6rem 4.4rem 6.4rem;
        }

        @include respond-to(xs) {
            padding: 120px 16px 64px 40px;
        }
    }

    .container {
        width: 100%;
        max-width: 68rem;
        margin: auto;
    }

    .aboutTitle {
        text-transform: uppercase;
        color: $base-0;

        @include respond-to(xs) {
            font-size: 2.4rem;
            line-height: 3.2rem;
        }

        &._subtitle {
            margin-bottom: 6.4rem;
            color: $blue;

            @include respond-to(xs) {
                margin-bottom: 2.4rem;
            }
        }
    }

    .aboutDescription {
        max-width: 56.6rem;
        margin-bottom: 10.4rem;
        color: $white-48;

        @include respond-to(xs) {
            margin-bottom: 4rem;
            font-size: 1.4rem;
            line-height: 2.4rem;
        }

        ._first {
            margin-bottom: 2.4rem;

            @include respond-to(xs) {
                margin-bottom: 1.6rem;
            }
        }
    }

    .advantageList {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8rem;
        margin-bottom: 8rem;

        @include respond-to(xs) {
            grid-template-columns: initial;
            gap: 3.2rem;
            margin-bottom: 4rem;
        }
    }

    .advantageItem {
        width: 100%;
        max-width: 28.6rem;

        @include respond-to(xs) {
            max-width: 100%;
        }
    }

    .advantageTitle {
        position: relative;
        width: 100%;
        margin-bottom: 1.6rem;
        padding: 0 0 4rem 0;
        color: $base-0;

        @include respond-to(xs) {
            padding: 0 0 1.6rem 0;
            font-size: 2.4rem;
        }

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: .1rem;
            background-color: $base-0;
            opacity: .12;
        }
    }

    .advantageDescription {
        max-width: 14rem;
        color: $white-48;

        @include respond-to(xs) {
            max-width: 100%;
            font-size: 1.2rem;
        }
    }

    .aboutBtn {
        width: 28.6rem;

        @include respond-to(sm) {
            width: 100%;
        }

        @include respond-to(xs) {
            width: 15rem;
        }
    }

    .aboutLabel {
        position: absolute;
        top: 41.9rem;
        left: 2.4rem;
        display: flex;
        align-items: center;
        white-space: nowrap;
        font-size: 1.2rem;
        line-height: 1.6rem;
        color: $base-0;

        @include respond-to(sm) {
            top: 9.6rem;
        }

        @include respond-to(xs) {
            top: 6.4rem;
            left: 1.6rem;
            font-size: 14px;
            line-height: 16px;
        }
    }

    .aboutIcon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: .8rem;
        transform: translateY(-1px);

        @include respond-to(xs) {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            transform: translateY(-2px);
        }
    }
</style>
