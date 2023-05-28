<template>
    <div :class="$style.HelloModal">
        <div :class="$style.wrapper">
            <h3
                v-if="title"
                :class="$style.title"
            >
                {{ title }} {{ count }}
            </h3>

            <p
                v-if="description"
                :class="$style.description"
                v-html="description"
            >
            </p>

            <button
                :class="$style.button"
                @click="openHelloModal"
            >
                Open another one modal
            </button>

            <button
                :class="$style.button"
                @click="$emit('close')"
            >
                Close modal
            </button>
        </div>
    </div>
</template>

<script>
const HelloModal = () => import('@/components/modals/HelloModal');

export default {
    name: 'HelloModal',

    props: {
        title: {
            type: String,
            default: '',
        },

        description: {
            type: String,
            default: '',
        },

        count: {
            type: Number,
            default: 1,
        },
    },

    methods: {
        openHelloModal() {
            this.$modal.open(HelloModal, {
                title: 'Hello world!',
                count: this.count + 1,
                description: 'It\'s modal example, glad&nbsp;to&nbsp;see you!',
            });
        },
    },
};
</script>

<style lang="scss" module>
    .HelloModal {
        display: flex;
        justify-content: center;
        padding-top: 4rem;
    }

    .title {
        text-align: center;
    }

    .description {
        margin-top: $aside-padding;
        text-align: center;
    }

    .button {
        margin-top: 2rem;
        padding: 1.2rem;
        border-radius: 1rem;
        background: #e4e4e4;
        font-size: 1.2rem;
        transition: opacity .3s;
        cursor: pointer;
        user-select: none;

        &:hover {
            opacity: .7;
        }
    }
</style>
