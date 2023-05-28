<template>
    <transition name="form-appear"
                @after-enter="$emit('after-enter')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="$style.FormExample1">
            <div :class="$style.wrap">
                <h5 :class="$style.title">
                    Form Example 1
                </h5>

                <button :class="$style.btn"
                        @click="openModal">
                    Open Example 2
                </button>
            </div>
        </div>
    </transition>
</template>

<script>
    import FormExample2 from '~/components/layout/modals/FormExample2';

    export default {
        props: {
            submited: {
                type: Boolean,
                default: false
            },

            visible: Boolean
        },

        methods: {
            openModal() {
                this.$modal.open(FormExample2, {classList: 'is-article'});
            }
        }
    };
</script>

<style lang="scss" module>
    .FormExample1 {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: 16px;
        pointer-events: none;

        &:global(.form-appear-enter-active) {
            transition: transform .8s;
        }

        &:global(.form-appear-leave-active) {
            transition: transform .4s;
        }

        &:global(.form-appear-enter),
        &:global(.form-appear-leave-to) {
            transform: translateX(110%);
        }
    }

    .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 460px;
        height: 100%;
        border-radius: 4px;
        background-color: #fff;
        pointer-events: all;
    }

    .title {
        font-size: 24px;
    }

    .btn {
        margin-top: 16px;
    }
</style>
