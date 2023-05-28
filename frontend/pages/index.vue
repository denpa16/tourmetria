<template>
    <div :class="['page', $style.MainPage]">

        <div :class="['container', $style.container]">
            <svg-icon
                :class="$style.logo"
                name="ida-front"
            />

            <h1
                title="Nuxt.js template"
                :class="$style.title"
            >
                Nuxt.js template, current domain: {{ siteDomain }}
            </h1>

            <button
                :class="$style.modalBtn"
                @click="openHelloModal"
            >
                Open modal
            </button>
        </div>
    </div>
</template>

<script>
// Vuex
import { mapGetters } from 'vuex';

// Components
const HelloModal = () => import('~/components/modals/HelloModal');

export default {
    name: 'IndexPage',

    computed: {
        ...mapGetters({
            siteDomain: 'domain/getDomainAddress',
        }),
    },

    methods: {
        openHelloModal() {
            this.$modal.open(HelloModal, {
                title: 'Hello world!',
                description: 'It\'s modal example, glad&nbsp;to&nbsp;see you!',
            });
        },
    },
};
</script>

<style lang="scss" module>
    .MainPage {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 76.8rem;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .logo {
        display: block;
        flex-shrink: 0;
        width: 22rem;
    }

    .title {
        margin-top: $aside-padding;
    }

    .modalBtn {
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
