<template>
    <div v-if="isVisible"
         :class="$style.TheCookies"
    >
        <p :class="[$style.text, 'p6', 'c-base300']">
            Сайт использует cookie
            для персонализации сервисов и удобства пользователей. Используя сайт или кликая на
            <span class="c-blue">
                Принять
            </span>
            вы соглашаетесь с этим, как описано в нашей
            <nuxt-link class="c-blue"
                       :to="privacyLink">
                Политике в отношении файлов cookie.
            </nuxt-link>
            Если нет — Вы можете запретить сохранение cookie в настройках своего браузера.
        </p>
        <VButton color="primary"
                 :class="$style.btn"
                 size="medium"
                 @click.native="acceptCookie"
        >
            <span>
                Принять
            </span>
        </VButton>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'TheCookies',

        components: {},

        data() {
            return {
                isVisible: false,
            };
        },

        computed: {
            ...mapGetters({
                privacyLink: 'getPrivacyLink',
            }),
        },

        mounted() {
            if (localStorage.getItem('accept-cookie')) {
                return;
            }

            this.isVisible = true;
        },

        methods: {
            acceptCookie() {
                this.isVisible = false;
                localStorage.setItem('accept-cookie', 'true');
            },
        },
    };
</script>

<style lang="scss" module>
    .TheCookies {
        position: fixed;
        right: 8.4rem;
        bottom: 2.4rem;
        z-index: 20;
        display: flex;
        flex-direction: column;
        max-width: 59.3rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(sm) {
            right: 24px;
            left: 24px;
            max-width: 100%;
        }
    }

    .text {
        @include respond-to(xs) {
            font-size: 1rem;
            line-height: 1.2;
        }
    }

    .btn {
        align-self: flex-start;
        margin-top: 2.4rem;

        @include respond-to(sm) {
            align-self: flex-end;
        }

        @include respond-to(xs) {
            margin-top: 1.2rem;
        }
    }
</style>
