<template>
    <div :class="$style.ViewPage">
        <VButton :class="$style.btn"
                 color="light"
                 icon-first
                 :link="$route.query.backLink">
            Назад
            <template #icon>
                <IconArrowLeft :class="$style.icon" />
            </template>
        </VButton>
        <iframe ref="iframe"
                :src="$route.query.link"
                :class="$style.frame"
        ></iframe>
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    export default {
        name: 'ViewPage',
        components: {IconArrowLeft},
        layout: 'empty',
    };
</script>

<style lang="scss" module>
    .ViewPage {
        position: relative;
        width: 100%;
        min-height: 100vh;
        max-height: 100vh;

        @include respond-to(sm) {
            min-height: var(--vh-full-page);
            max-height: var(--vh-full-page);
        }
    }

    .frame {
        width: 100%;
        min-height: calc(100vh - .5rem);
        max-height: 100vh;

        @include respond-to(sm) {
            min-height: var(--vh-full-page);
            max-height: var(--vh-full-page);
        }
    }

    .btn {
        position: absolute;
        top: 2.4rem;
        left: 2.4rem;
        z-index: 2;

        &:global(.v-button.is-icon-first .v-button__icon-wrap) {
            margin: 0 1.8rem 0 0;
        }

        @include respond-to(xs) {
            top: 1.6rem;
            left: 1.6rem;
        }
    }

    .icon{
        width: 1.2rem;
        height: 1.2rem;
        transform: translateY(-1px);
    }
</style>
