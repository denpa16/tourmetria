<template>
    <div :class="$style.TheHeader">
        <div :class="['container', $style.wrapper]">
            <template v-if="isShowDemoMenu">
                <transition
                    name="fade-fast"
                    mode="out-in"
                >
                    <svg-icon
                        :key="`modalIcon_${isModalOpen}`"
                        :class="$style.sideMenuIcon"
                        :name="!isModalOpen ? 'menu' : 'close'"
                        @click="handleOpenModal"
                    />
                </transition>
            </template>

            <n-link
                to="/"
            >
                <svg-icon
                    :class="$style.logo"
                    name="ida-logo"
                />
            </n-link>

            <div
                v-if="isShowUiKitLink"
                :class="$style.title"
            >
                <n-link
                    to="/release"
                >
                    ui-kit
                </n-link>
            </div>

            <div :class="$style.phoneWrapper">
                <div :class="$style.phone">
                    {{ phone }}
                </div>
                <span>
                    <svg-icon
                        name="arrow"
                    />
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// Components
const SideMenu = () => import('~/components/ui-starter/demo-menu/SideMenu');

export default {
    name: 'TheHeader',

    data() {
        return {
            phone: '+7 495 966 40 21',
            isModalOpen: false,
        };
    },

    computed: {
        ...mapGetters('domain', {
            isTestStage: 'getIsTestStage',
        }),

        isShowDemoMenu() {
            const demoPages = ['examples', 'components', 'release'];
            return demoPages.includes(this.$route.path.split('/')[1]) && this.isTestStage;
        },

        isShowUiKitLink() {
            return this.isTestStage;
        },
    },

    methods: {
        handleOpenModal() {
            if (this.isModalOpen) {
                this.$modal.close();
                return;
            }

            setTimeout(() => {
                this.isModalOpen = true;
            }, 300);

            this.$modal.open(SideMenu, {
                position: 'left',
                isModal: true,
                popover: true,
            }, () => {
                this.isModalOpen = false;
            });
        },
    },
};
</script>

<style lang="scss" module>
    .TheHeader {
        position: fixed;
        z-index: $header-z-index;
        width: 100%;
        height: $header-h;
        background: $base-900;

        &:after {
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: .1rem;
        }

        .wrapper {
            display: flex;
            align-items: center;
            max-width: initial;
            height: 6.2rem;
        }
    }

    .sideMenuIcon {
        width: 2rem;
        height: 2rem;
        margin-right: 3.2rem;
        color: $white;
        cursor: pointer;
        user-select: none;
    }

    .logo {
        flex-shrink: 0;
        width: 6.8rem;
        height: 3.2rem;
        margin-right: 8.4rem;
        color: #fff;
    }

    .phone,
    .title {
        text-transform: uppercase;
        font-size: 1.2rem;
        font-weight: 600;
        font-style: normal;
        line-height: 1;
        letter-spacing: .015em;
        color: #fff;
    }

    .title {
        display: flex;
        flex: 1;
        user-select: none;
    }

    .phone {
        height: 100%;
        padding: .5rem 1.2rem .3rem;
        border-radius: 1rem;
        border: 1px solid rgb(255 255 255 / 18%);
    }

    .phoneWrapper {
        display: flex;
        align-items: center;
        flex-flow: row nowrap;

        span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: #fff;

            svg {
                width: 100%;
                height: .6rem;
                color: $base-900;
            }
        }

        @include respond-to(mobile) {
            display: none;
        }
    }
</style>
