<template>
    <a :class="$style.ProjectDocsModalCardLink"
       :href="formattedLink"
       download>
        <IconDownload :class="$style.icon" />
    </a>
</template>

<script>
    import {mapGetters} from 'vuex';

    import IconDownload from '~/components/icons/IconDownload';

    export default {
        name: 'ProjectDocsModalCardLink',

        components: {
            IconDownload
        },

        props: {
            link: {
                type: String,
                default: ''
            }
        },

        computed: {
            ...mapGetters({
                storageLink: 'getStorageLink',
            }),

            formattedLink() {
                return '/storage' + this.link.split(this.storageLink)[1];
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectDocsModalCardLink {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.4rem;
        height: 2.4rem;
        margin-left: .8rem;
        border-radius: .4rem;
        background-color: $blue;
        transition: opacity $default-transition;
        cursor: pointer;

        @include respond-to(sm) {
            margin-right: 1.6rem;
            margin-left: 0;
        }

        @include hover {
            opacity: .8;
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        color: $base-0;
    }
</style>
