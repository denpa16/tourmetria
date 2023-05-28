<template>
    <div :class="$style.CareDescription">
        <p :class="[$style.step, 'c-base0']">
            {{ block.title }}
        </p>
        <p :class="[$style.text, 'p4', 'c-base300']">
            {{ block.description }}
        </p>
        <VButton v-if="block.buttons && block.buttons.text"
                 :class="$style.btn"
                 v-bind="btnAttrs"
                 color="primary"
        >
            {{ block.buttons.text }}
        </VButton>
    </div>
</template>

<script>
    import VButton from '~/components/ui/buttons/VButton';
    export default {
        name: 'CareDescription',
        components: {VButton},
        props: {
            block: {
                type: Object,
                default: () => ({})
            },

            isLastBlock: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            btnAttrs() {
                if (this.block?.buttons?.link.includes('http')) {
                    return {
                        href: this.block.buttons.link,
                        blank: true,
                    };
                }
                return {
                    to: this.block.buttons.link,
                    blank: true,
                };
            }
        }
    };
</script>

<style lang="scss" module>
    .step {
        margin-bottom: 2.4rem;
        font-size: 1.4rem;
        line-height: 2rem;

        @include respond-to(xs) {
            margin-bottom: .8rem;
            font-size: 1.6rem;
        }
    }

    .btn {
        margin-top: 3.2rem;

        @include respond-to(xs) {
            width: 100%;
            margin-top: 4rem;
        }
    }
</style>
