<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.PdfModal]">

            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="$style.content">
                    <div :class="$style.head">
                        <h5 :class="$style.title">
                            Сохранить в PDF
                        </h5>
                    </div>

                    <div :class="$style.buttons">
                        <button :class="$style.btn"
                                value="Брошюра со всей информацией">
                            <IconFile :class="$style.icon" />
                            <span>Брошюра со всей информацией</span>
                        </button>

                        <button :class="$style.btn"
                                value="Скачать только планировку">
                            <IconDownload :class="$style.icon" />
                            <span>Скачать только планировку</span>
                        </button>
                    </div>

                    <div :class="$style.closeBtn">
                        <VSquareButton color="light"
                                       size="small"
                                       aria-label="Закрыть"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';
    import IconFile from '~/components/icons/IconFile';
    import IconDownload from '~/components/icons/IconDownload';

    export default {
        name: 'PdfModal',

        components: {
            IconPlus,
            IconFile,
            IconDownload,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },
    };
</script>

<style lang="scss" module>
    .PdfModal {
        z-index: 200;
    }

    .wrap {
        right: 0;
        max-width: 100vw;
        transform: translateX(0);
    }

    .content {
        position: relative;
        margin-top: auto;
        padding-right: 1.6rem;
        padding-left: 1.6rem;
        border-radius: .8rem .8rem 0 0;
        background-color: $base-0;
    }

    .head {
        position: relative;
        padding-top: 3.4rem;
        padding-bottom: 3.4rem;
    }

    .title {
        text-transform: uppercase;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .closeBtn {
        position: absolute;
        top: 2.4rem;
        right: 1.6rem;
        transform: translateX(0);
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .buttons {
        display: flex;
        flex-direction: column;
        padding-bottom: 4rem;
    }

    .btn {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1.5rem 1.6rem 1.3rem;
        border-radius: .4rem;
        border: 1px solid $base-200;
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.6rem;
        color: $base-700;

        &:not(:last-child) {
            margin-bottom: .8rem;
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1.2rem;
        transform: translateY(-.2rem);
    }
</style>
