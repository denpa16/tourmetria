<template>
    <div :class="[$style.VAccordionItem, classList]">
        <div
            :class="$style.header"
            @click="toggle(!isOpen)"
        >
            <slot name="header-content"></slot>

            <slot name="header-icon" :open="isOpen">
                <svg-icon
                    :class="$style.icon"
                    name="arrow"
                />
            </slot>
        </div>

        <div
            ref="content"
            :class="$style.contentWrap"
        >
            <div :class="$style.content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
    name: 'VAccordionItem',

    data() {
        return {
            isOpen: false,
        };
    },

    computed: {
        classList() {
            return [{
                [this.$style._expanded]: this.isOpen,
                [this.$style[`_${this.$parent.color}`]]: this.$parent.color,
                [this.$style._shadow]: this.$parent.shadow,
            }];
        },
    },

    beforeMount() {
        this.$parent.register(this);
    },

    beforeDestroy() {
        this.$parent.unregister(this);
    },

    methods: {
        toggle(value) {
            if (value !== this.isOpen) {
                this.isOpen = value;
                this.$parent.setOpen(this, this.isOpen);
            }

            this.animate();
        },

        animate() {
            if (!this.$refs.content) {
                return;
            }

            if (this.isOpen) {
                gsap.to(this.$refs.content, {
                    duration: .4,
                    height: 'auto',
                });
            } else {
                gsap.to(this.$refs.content, {
                    duration: .4,
                    height: 0,
                });
            }
        },
    },
};
</script>

<style lang="scss" module>
    .VAccordionItem {
        position: relative;
        transition: background-color $default-transition, color $default-transition;

        &:first-child {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;

            &:before {
                border-top: 1px solid;
            }
        }

        &:last-child {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;

            &:before {
                border-bottom: 1px solid;
            }
        }

        &:not(:first-child) {
            &:after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                border-top: 1px solid;
                transition: border-color $default-transition;
            }
        }

        &:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: inherit;
            border-right: 1px solid;
            border-left: 1px solid;
        }

        &._expanded {
            & .icon {
                transform: rotateZ(-90deg);
            }
        }

        &._shadow {
            &:before {
                z-index: -1;
                border: none;
                box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 10%), 0 1px 5px 0 rgb(0 0 0 / 12%);
            }
        }

        /* Colors */
        &._base {
            background-color: $white;
            color: $base-600;

            &:before {
                border-color: rgba($base-600, .12);
            }

            &:not(:first-child) {
                &:after {
                    border-color: rgba($base-600, .12);
                }
            }
        }

        &._dark {
            background: $base-600;
            color: $white;

            &:before {
                border-color: rgba($white, .12);
            }

            &:not(:first-child) {
                &:after {
                    border-color: rgba($white, .12);
                }
            }
        }
    }

    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.6rem 2.4rem;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        cursor: pointer;
        user-select: none;
    }

    .contentWrap {
        overflow: hidden;
        height: 0;
    }

    .content {
        padding: 0 2.4rem 1.6rem;
    }

    .icon {
        flex-shrink: 0;
        width: 1.6rem;
        height: 1.6rem;
        margin-left: 1.6rem;
        transform: rotateZ(90deg);
        transition: transform $default-transition;
    }
</style>
