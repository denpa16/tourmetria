<template>
    <div :class="$style.DemoPage">
        <div :class="['page', 'container']">
            <div
                :class="$style.demosWrap"
                v-html="versionInfo"
            >
            </div>
        </div>
    </div>
</template>

<script>
const version = require('~/assets/docs/VERSION.md');

export default {
    name: 'DemoPage',

    data() {
        return {
            versionInfo: version.default,
        };
    },
};
</script>

<style lang="scss" module>
    .DemoPage {
        :global {
            h1 {
                margin-bottom: 1.2rem;
                font-family: Kinetika, sans-serif;
                font-size: 4rem;
                color: $violet;

                &:not(:first-child) {
                    margin-top: 3.2rem;
                }
            }

            h2 {
                font-family: Kinetika, sans-serif;
                font-size: 2.4rem;
            }

            h3 {
                font-family: Kinetika, sans-serif;
                font-size: 2rem;
            }

            h4 {
                font-family: Kinetika, sans-serif;
                font-size: 1.8rem;
            }

            h5 {
                font-family: Kinetika, sans-serif;
                font-size: 1.6rem;
            }

            h6 {
                font-family: Kinetika, sans-serif;
                font-size: 1.4rem;
            }

            ol,
            ul {
                li {
                    list-style-position: inside;
                    line-height: 1.4;
                }
            }

            ul {
                & > li {
                    list-style-type: disc;
                }
            }

            ol {
                & > li {
                    list-style-type: decimal;
                }

                ul {
                    padding: 1.8rem 0 0 2.5rem;
                }
            }
        }
    }

    .demosWrap {
        width: 80rem;
        margin: 6.2rem auto;

        @include respond-to(mobile) {
            width: 100%;
        }
    }
</style>
