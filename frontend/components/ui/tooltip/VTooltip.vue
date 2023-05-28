<template>
    <div
        ref="activator"
        class="v-tooltip"
        @mouseenter="onActivatorEnter"
        @mouseleave="onActivatorLeave"
        @click="onActivatorClick"
    >

        <slot name="activator"></slot>

        <div
            ref="content"
            :class="['v-tooltip__content', {'is-hoverable': hoverable}]"
            :style="position"
            @mouseenter="onContentEnter"
            @mouseleave="onContentLeave"
        >
            <transition name="tooltip">
                <div
                    v-if="isVisible"
                    :class="['v-tooltip__wrapper', wrapperClasses]"
                    :style="wrapperStyles"
                >
                    <span
                        v-if="defaultWrapper"
                        class="v-tooltip__wrapper-arrow"
                        :style="arrowStyles"
                    ></span>

                    <slot></slot>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'VTooltip',

        props: {
            /**
             * Селектор элемента в который будет вставлен тултип.
             * Должен иметь свойство position: relative или  position: absolute
             */
            attach: {
                type: String,
                default: '',
            },

            top: Boolean,
            bottom: Boolean,
            left: Boolean,
            right: Boolean,
            topLeft: Boolean,
            topRight: Boolean,

            hoverable: Boolean,

            /**
             * Отступ от активатора до тултипа
             */
            nudge: {
                type: Number,
                default: 8,
            },

            /**
             * Вертикальный отступ от краев экрана до тултипа
             */
            offsetY: {
                type: Number,
                default: 12,
            },

            /**
             * Горизонтальный отступ от краев экрана до тултипа
             */
            offsetX: {
                type: Number,
                default: 12,
            },

            /**
             * Смещение тултипа по горизонтали относительно активатора при расположении topLeft/topRight
             */
            activatorOffsetX: {
                type: Number,
                default: 0,
            },

            /**
             * Отрисовать дефолтный контейнер для тултипа
             */
            defaultWrapper: {
                type: Boolean,
                default: false,
            },

            /**
             * Размеры
             */
            size: {
                type: String,
                default: 'medium',
                validator(val) {
                    return ['big', 'medium', 'medium-extra', 'small'].includes(val);
                },
            },

            wrapperWidth: {
                type: [String, Number],
                default: '',
            },

            wrapperHeight: {
                type: [String, Number],
                default: '',
            },

            /**
             * Цвета
             */
            color: {
                type: String,
                default: 'white',
                validator(val) {
                    return ['secondary', 'white'].includes(val);
                },
            },

            /**
             * Кастомные стили для обертки
             */
            customWrapperStyles: {
                type: Object,
                default: () => ({}),
            },

            customWrapperClass: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                dimensions: {
                    activator: {
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                    },

                    content: {
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                    },

                    page: {
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                    },

                    attach: {
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                    },
                },

                isVisible: false,
                isDetached: false,
                target: null,
                timeout: null,
                clickTimeout: null,
            };
        },

        computed: {
            position() {
                const {activator, content} = this.dimensions;
                const unknown = !this.bottom && !this.left && !this.top && !this.right && !this.topLeft && !this.topRight;

                let top = 0;
                let left = 0;

                if (this.top || this.bottom || unknown) {
                    top =
                        activator.top +
                        (this.bottom ? activator.height : -content.height) +
                        (this.bottom ? this.nudge : -this.nudge);

                    // eslint-disable-next-line no-mixed-operators
                    left = activator.left + activator.width / 2 - content.width / 2;
                } else if (this.left || this.right) {
                    // eslint-disable-next-line no-mixed-operators
                    top = activator.top + activator.height / 2 - content.height / 2;

                    left =
                        activator.left +
                        (this.right ? activator.width : -content.width) +
                        (this.right ? this.nudge : -this.nudge);
                } else if (this.topLeft || this.topRight) {
                    top = activator.top -content.height - this.nudge;

                    left = activator.left +
                        (!this.topRight ? activator.width - content.width + this.activatorOffsetX : -this.activatorOffsetX);
                }

                top = this.calcYOverflow(top);
                left = this.calcXOverflow(left);

                return {
                    top: `${this.attach ? top - this.dimensions.attach.top : top}px`,
                    left: `${this.attach ? left - this.dimensions.attach.left : left}px`,
                };
            },

            wrapperClasses() {
                return {
                    'is-default': Boolean(this.defaultWrapper),
                    [`_${this.size}`]: Boolean(this.size),
                    [`_${this.color}`]: Boolean(this.color),
                    _top: Boolean(this.top),
                    _right: Boolean(this.right),
                    _bottom: Boolean(this.bottom),
                    _left: Boolean(this.left),
                    [this.customWrapperClass]: this.customWrapperClass,
                };
            },

            wrapperStyles() {
                let styles = {
                    width: this.wrapperWidth,
                    height: this.wrapperHeight,
                };

                if (typeof this.customWrapperStyles === 'object' && this.customWrapperStyles) {
                    styles = {
            ...styles,
            ...this.customWrapperStyles,
                    };
                }

                return styles;
            },

            arrowStyles() {
                const page = this.dimensions?.page || {};
                const content = this.dimensions?.content || {};
                const activator = this.dimensions?.activator || {};

                if (this.top || this.bottom) {
                    const left = parseFloat(this.position.left);

                    if (left === this.offsetX) {
                        return {
                            left: activator.left + 'px',
                        };
                    }

                    if (page.width - left - content.width === this.offsetX) {
                        return {
                            left: ((activator.left - left + activator.width) / 2) + 'px',
                        };
                    }
                }

                if (this.left || this.right) {
                    const top = parseFloat(this.position.top) - page.top;

                    if (top === this.offsetY) {
                        return {
                            top: ((activator.top - page.top - activator.height) / 2) + 'px',
                        };
                    }

                    if (page.height - top - content.height === this.offsetY) {
                        return {
                            top: ((activator.top - top + activator.height) / 2) + 'px',
                        };
                    }
                }

                return {};
            },
        },

        mounted() {
            if (!this.$slots.activator) {
                console.error('[VTooltip] activator slot must be bound');
            }
        },

        beforeDestroy() {
            if (this.isDetached && this.target) {
                this.target.removeChild(this.$refs.content);
            }
        },

        methods: {
            handleInit() {
                if (!this.isDetached) {
                    this.initDetach();
                }

                if (this.timeout && this.isVisible) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                } else {
                    this.$emit('enter');
                    this.isVisible = true;
                    this.$nextTick(() => {
                        this.updateDimensions();
                    });
                }
            },

            onActivatorEnter() {
                if (this.$deviceIs.mobile) {
                    return;
                }

                this.handleInit();
            },

            onActivatorClick() {
                if (this.$deviceIs.mobile) {
                    if (this.isVisible) {
                        this.onActivatorLeave();
                        return;
                    }

                    this.handleInit();

                    this.clickTimeout = setTimeout(() => {
                        this.onActivatorLeave();
                    }, 5000);
                }
            },

            onActivatorLeave() {
                this.hide();
            },

            onContentEnter() {
                if (!this.hoverable) {
                    return;
                }

                clearTimeout(this.timeout);
                this.timeout = null;
            },

            onContentLeave() {
                if (!this.hoverable) {
                    return;
                }
                this.hide();
            },

            hide() {
                this.timeout = setTimeout(() => {
                    this.isVisible = false;
                    clearTimeout(this.timeout);
                    clearTimeout(this.clickTimeout);
                    this.timeout = null;
                    this.clickTimeout = null;
                    this.$emit('blur');
                }, 50);
            },

            updateDimensions() {
                if (this.$refs.activator) {
                    const activatorBounding = this.$refs.activator.getBoundingClientRect();
                    this.dimensions.activator.top = activatorBounding.top + window.pageYOffset + (parseFloat(document.body?.dataset?.scrollY) || 0);
                    this.dimensions.activator.left = activatorBounding.left + window.pageXOffset;
                    this.dimensions.activator.width = activatorBounding.width;
                    this.dimensions.activator.height = activatorBounding.height;
                } else {
                    console.warn('[VTooltip] updateDimensions error - activator is undefined');
                }

                if (this.$refs.content) {
                    const contentBounding = this.$refs.content.getBoundingClientRect();
                    this.dimensions.content.top = contentBounding.top + window.pageYOffset + (parseFloat(document.body?.dataset?.scrollY) || 0);
                    this.dimensions.content.left = contentBounding.left + window.pageXOffset;
                    this.dimensions.content.width = contentBounding.width;
                    this.dimensions.content.height = contentBounding.height;
                } else {
                    console.warn('[VTooltip] updateDimensions error - content is undefined');
                }

                this.dimensions.page.width = document.documentElement.clientWidth || window.innerWidth;
                this.dimensions.page.height =
                    document.documentElement.clientHeight || window.innerHeight;
                this.dimensions.page.top = window.pageYOffset || document.documentElement.scrollTop + (parseFloat(document.body?.dataset?.scrollY) || 0);
                this.dimensions.page.left = window.pageXOffset || document.documentElement.scrollLeft;

                if (this.attach) {
                    const attachEl = document.querySelector(this.attach);
                    if (attachEl) {
                        const attachBounding = attachEl.getBoundingClientRect();
                        this.dimensions.attach.top = attachBounding.top + window.pageYOffset + (parseFloat(document.body?.dataset?.scrollY) || 0);
                        this.dimensions.attach.left = attachBounding.left + window.pageXOffset;
                        this.dimensions.attach.width = attachBounding.width;
                        this.dimensions.attach.height = attachBounding.height;
                    }
                }
            },

            calcYOverflow(top) {
                /**
                 * @param {top} - верхняя граница тултипа
                 */
                const topOverflow = this.dimensions.page.top + this.offsetY - top;
                const bottomOverflow =
                    top +
                    this.dimensions.content.height +
                    this.offsetY -
                    (this.dimensions.page.top + this.dimensions.page.height);

                let attachTopOverflow = 0;
                let attachBottomOverflow = 0;

                if (this.attach) {
                    attachTopOverflow = this.dimensions.attach.top + this.offsetY - top;
                    attachBottomOverflow =
                        top +
                        this.dimensions.content.height +
                        this.offsetY -
                        (this.dimensions.attach.top + this.dimensions.attach.height);
                }

                if (topOverflow > 0) {
                    top = this.dimensions.page.top + this.offsetY;
                } else if (this.attach && attachTopOverflow > 0) {
                    top = this.dimensions.attach.top + this.offsetY;
                } else if (bottomOverflow > 0) {
                    top =
                        this.dimensions.page.top +
                        this.dimensions.page.height -
                        this.offsetY -
                        this.dimensions.content.height;
                } else if (this.attach && attachBottomOverflow > 0) {
                    top =
                        this.dimensions.attach.top +
                        this.dimensions.attach.height -
                        this.offsetY -
                        this.dimensions.content.height;
                }

                return top;
            },

            calcXOverflow(left) {
                const leftOverflow = this.dimensions.page.left + this.offsetX - left;
                const rightOverflow =
                    left +
                    this.dimensions.content.width +
                    this.offsetX -
                    (this.dimensions.page.left + this.dimensions.page.width);

                let attachLeftOverflow = 0;
                let attachRightOverflow = 0;

                if (this.attach) {
                    attachLeftOverflow =
                        this.dimensions.attach.left + this.offsetY - left;
                    attachRightOverflow =
                        left +
                        this.dimensions.content.width +
                        this.offsetY -
                        (this.dimensions.attach.left + this.dimensions.attach.width);
                }

                if (this.attach && attachLeftOverflow > 0) {
                    left = this.dimensions.attach.left + this.offsetY;
                } else if (leftOverflow > 0) {
                    left = this.dimensions.page.left + this.offsetX;
                } else if (this.attach && attachRightOverflow > 0) {
                    left =
                        this.dimensions.attach.left +
                        this.dimensions.attach.width -
                        this.offsetY -
                        this.dimensions.content.width;
                } else if (rightOverflow > 0) {
                    left =
                        this.dimensions.page.left +
                        this.dimensions.page.width -
                        this.offsetX -
                        this.dimensions.content.width;
                }

                return left;
            },

            initDetach() {
                this.attach
                    ? this.target = document.querySelector(this.attach)
                    : this.target = document.body;

                if (!this.target) {
                    console.warn(`[VTooltip] Unable to locate target ${this.attach || '#app'}`, this);
                    return;
                }

                this.target.appendChild(this.$refs.content);
                this.isDetached = true;
            },
        },
    };
</script>

<style lang="scss">
    .v-tooltip {
        cursor: pointer;

        &__content {
            position: absolute;
            z-index: 200;
            pointer-events: none;

            &.is-hoverable {
                pointer-events: all;
            }
        }

        &__wrapper {
            &-arrow {
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
            }

            &.is-default {
                position: relative;

                &._top {
                    box-shadow: 0 0 8px rgba(0, 0, 0, .04), 0 16px 12px rgba(0, 0, 0, .06);

                    & .v-tooltip__wrapper-arrow {
                        bottom: 0;
                        left: 50%;
                        border-width: .8rem .8rem 0 .8rem;
                        transform: translate(-50%, 100%);
                    }
                }

                &._right {
                    box-shadow: 0 0 8px rgba(0, 0, 0, .04), -16px 0 12px rgba(0, 0, 0, .06);

                    & .v-tooltip__wrapper-arrow {
                        bottom: 50%;
                        left: 0;
                        border-width: .8rem .8rem .8rem 0;
                        transform: translate(-100%, 50%);
                    }
                }

                &._bottom {
                    box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 -16px 12px rgba(0, 0, 0, .06);

                    & .v-tooltip__wrapper-arrow {
                        top: 0;
                        left: 50%;
                        border-width: 0 .8rem .8rem .8rem;
                        transform: translate(-50%, -100%);
                    }
                }

                &._left {
                    box-shadow: 0 0 8px rgba(0, 0, 0, .04), 16px 0 12px rgba(0, 0, 0, .06);

                    & .v-tooltip__wrapper-arrow {
                        right: 0;
                        bottom: 50%;
                        border-width: .8rem 0 .8rem .8rem;
                        transform: translate(100%, 50%);
                    }
                }

                // Цвета
                &._white {
                    background-color: $base-0;

                    &._top {
                        & .v-tooltip__wrapper-arrow {
                            border-color: $base-0 transparent transparent transparent;
                        }
                    }

                    &._right {
                        & .v-tooltip__wrapper-arrow {
                            border-color: transparent $base-0 transparent transparent;
                        }
                    }

                    &._bottom {
                        & .v-tooltip__wrapper-arrow {
                            border-color: transparent transparent $base-0 transparent;
                        }
                    }

                    &._left {
                        & .v-tooltip__wrapper-arrow {
                            border-color: transparent transparent transparent $base-0;
                        }
                    }
                }

                &._secondary {
                    background-color: $base-50;

                    &._top {
                        &:before {
                            border-color: $base-50 transparent transparent transparent;
                        }
                    }

                    &._right {
                        &:before {
                            border-color: transparent $base-50 transparent transparent;
                        }
                    }

                    &._bottom {
                        &:before {
                            border-color: transparent transparent $base-50 transparent;
                        }
                    }

                    &._left {
                        &:before {
                            border-color: transparent transparent transparent $base-50;
                        }
                    }
                }

                // Размеры
                &._small {
                    padding: .8rem;
                    border-radius: .4rem;
                }

                &._medium {
                    padding: 1.6rem;
                    border-radius: .4rem;
                }

                &._medium-extra {
                    padding: 1.6rem 2rem;
                    border-radius: .8rem;
                }

                &._big {
                    padding: 2.4rem;
                    border-radius: .8rem;
                }
            }
        }
    }

    .tooltip-enter-active {
        transition: opacity .3s, transform .3s;
    }

    .tooltip-leave-active {
        transition: opacity .15s, transform .15s;
    }

    .tooltip-enter,
    .tooltip-leave-active {
        opacity: 0;
        transform: translateY(-16px);
    }
</style>
