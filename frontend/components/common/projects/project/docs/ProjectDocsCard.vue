<template>
    <component :is="elem"
               :class="$style.ProjectDocsCard">
        <div>
            <h3 :class="[$style.title, 'h4', 'c-base300']">
                Документы
            </h3>
            <p :class="[$style.subtitle, 'h4']">
                {{ title }}
            </p>
        </div>
        <div :class="$style.iconWrapper">
            <IconDocs :class="$style.iconItem" />
            <IconArrowRight :class="[$style.iconItem, $style._mobile]" />
        </div>
    </component>
</template>

<script>
    import IconDocs from '~/components/icons/IconDocs';
    import IconArrowRight from '~/components/icons/IconArrowRight';

    export default {
        name: 'ProjectDocsCard',

        components: {
            IconArrowRight,
            IconDocs
        },

        props: {
            elem: {
                type: String,
                default: 'div'
            },

            title: {
                type: String,
                default: ''
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectDocsCard {
        display: flex;
        flex-direction: column;
        padding: 2rem 1.6rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
        text-transform: uppercase;
        opacity: 1;
        transition: all $default-transition;
        user-select: none;
        cursor: pointer;

        @include respond-to(xs) {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 1.6rem;
            background-color: $base-0;
        }

        @include hover {
            transform: scale(1.02);
        }

        &:hover .subtitle {
            color: $blue;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: flex;
            }
        }
    }

    .title {
        @include respond-to(xs) {
            font-size: 1.6rem;
            line-height: 1.2;
        }
    }

    .subtitle {
        margin-bottom: .8rem;
        transition: all $default-color-transition;

        @include respond-to(xs) {
            margin-bottom: 0;
            font-size: 1.6rem;
            line-height: 1.2;
        }
    }

    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-end;
        width: 4.4rem;
        height: 4.4rem;
        border-radius: 4px;
        background-color: $base-0;

        @include respond-to(xs) {
            align-self: unset;
            width: 3.2rem;
            height: 3.2rem;
            background-color: $blue;
        }
    }

    .iconItem {
        width: 1.6rem;
        height: 1.6rem;
        color: $base-800;

        @include respond-to(xs) {
            display: none;
            width: 1.2rem;
            height: 1.2rem;
            color: $base-0;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: block;
            }
        }
    }
</style>
