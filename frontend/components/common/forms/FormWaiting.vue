<template>
    <div :class="$style.FormWaiting">
        <div :class="$style.loaderWrap">
            <TheLoader :class="$style.loader" />
        </div>
        <div :class="$style.text">
            <p :class="[$style.title, 'h4']"
               v-html="title"></p>
            <p :class="[$style.subtitle, 'p2']"
               v-html="subtitle"></p>
        </div>
    </div>
</template>

<script>
    import TheLoader from '~/components/common/TheLoader';

    export default {
        name: 'FormWaiting',

        components: {TheLoader},

        props: {
            title: {
                type: String,
                default: 'Проверка доступности объекта',
            },

            subtitle: {
                type: String,
                default: 'Не закрывайте страницу, ожидание может занять некоторое время',
            }
        }


    };
</script>

<style lang="scss" module>
    .FormWaiting {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .loaderWrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.8rem;
        height: 4.8rem;
        border-radius: 50%;
        background-color: $base-50;
    }

    .text {
        margin-top: 2.4rem;
        text-align: center;
    }

    .title {
        margin-bottom: 2.4rem;
        text-transform: uppercase;
        color: $black;
    }

    .subtitle {
        color: rgba($black, .4);
    }

</style>
