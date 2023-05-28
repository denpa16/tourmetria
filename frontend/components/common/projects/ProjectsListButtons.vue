<template>
    <div :class="$style.ProjectsListButtons">
        <div :class="$style.wrapper">
            <VButton color="light"
                     :class="[$style.btn, $style.filterBtn]"
                     @click="$emit('open-filter')"
            >
                Фильтр
                <template #icon>
                    <IconFilters :class="$style.icon" />
                </template>
            </VButton>

            <VButton color="light"
                     :class="[$style.btn, $style.mapBtn]"
                     @click="$emit('open-map')"
            >
                На карте
                <template #icon>
                    <IconMap :class="$style.icon" />
                </template>
            </VButton>
        </div>
    </div>
</template>

<script>
    import IconFilters from '~/components/icons/IconFilters';
    import IconMap from '~/components/icons/IconMap';

    export default {
        name: 'ProjectsListButtons',

        components: {
            IconFilters,
            IconMap,
        }
    };
</script>

<style lang="scss" module>
    .ProjectsListButtons {
        //
    }

    .wrapper {
        display: flex;
        width: 100%;
    }

    .btn {
        width: 50%;
    }

    .filterBtn {
        margin-right: 1.6rem;

        &:global(.v-button--large) {
            justify-content: space-between;
            padding: 0 1.6rem;
        }

        @include respond-to(xs) {
            margin-right: 1.2rem;
        }
    }

    .mapBtn {
        .icon {
            display: none;
        }

        @include respond-to(xs) {
            display: flex;

            .icon {
                display: block;
            }

            &:global(.v-button--large) {
                justify-content: space-between;
                padding: 0 1.6rem;
            }
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }
</style>
