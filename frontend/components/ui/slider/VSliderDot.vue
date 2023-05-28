<template>
    <div class="v-slider-dot"
         :class="{_hover: hovering, _dragging: dragging }"
         :style="styles"
         tabindex="0"
         @focus="onMouseEnter"
         @blur="onMouseLeave"
         @mouseenter="onMouseEnter"
         @mouseleave="onMouseLeave"
         @mousedown.prevent="onMouseDown"
         @touchstart="onMouseDown"
         @keydown.left="onLeftKeyDown"
         @keydown.right="onRightKeyDown"
         @keydown.down.prevent="onLeftKeyDown"
         @keydown.up.prevent="onRightKeyDown">

        <div v-if="showTooltip"
             class="v-slider-dot__tooltip">
            {{ formatValue }}
        </div>

        <div class="v-slider-dot__handle"></div>
    </div>
</template>

<script>
    export default {
        name: 'VSliderDot',

        props: {
            value: {
                type: Number,
                default: 0,
            },

            vertical: {
                type: Boolean,
                default: false,
            },

            dragging: {
                type: Boolean,
                default: false,
            },

            focus: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                hovering: false,
                isClick: false,
                startX: 0,
                currentX: 0,
                startY: 0,
                currentY: 0,
                startPosition: 0,
            };
        },

        computed: {
            disabled() {
                return this.$parent.$disabled;
            },

            max() {
                return this.$parent.max;
            },

            min() {
                return this.$parent.min;
            },

            step() {
                return this.$parent.step;
            },

            tooltip() {
                return this.$parent.tooltip;
            },

            precision() {
                return this.$parent.precision;
            },

            enableFormat() {
                return this.$parent.tooltipFormat instanceof Function;
            },

            formatValue() {
                return (this.enableFormat && this.$parent.tooltipFormat(this.value)) || this.value;
            },

            //
            // Вычисляет текущение положение ползунка
            // @return {String} - процент относительно начала
            //
            currentPosition() {
                return `${((this.value - this.min) / (this.max - this.min)) * 100}%`;
            },

            styles() {
                if (this.vertical) {
                    return {
                        bottom: this.currentPosition,
                        transition: this.dragging ? 'bottom 0s ease' : 'bottom .5s ease',
                    };
                }
                return {
                    left: this.currentPosition,
                    transition: this.dragging ? 'left 0s ease' : 'left .5s ease',
                };
            },

            showTooltip() {
                switch (this.tooltip) {
                    case 'always':
                        return true;
                    case 'never':
                        return false;
                    case 'focus':
                        return this.focus || this.hovering;
                    default:
                        return false;
                }
            },
        },

        methods: {
            onMouseEnter() {
                this.hovering = true;
                this.$emit('mouse-enter');
            },

            onMouseLeave() {
                this.hovering = false;
                this.$emit('mouse-leave');
            },

            //
            // Управление ползунками с помощью клавиатуры
            //
            onLeftKeyDown() {
                if (!this.disabled) {
                    this.setPosition(parseFloat(this.currentPosition) - ((this.step / (this.max - this.min)) * 100));
                    this.$parent.emitChange();
                }
            },

            //
            // Управление ползунками с помощью клавиатуры
            //
            onRightKeyDown() {
                if (!this.disabled) {
                    this.setPosition(parseFloat(this.currentPosition) + ((this.step / (this.max - this.min)) * 100));
                    this.$parent.emitChange();
                }
            },

            //
            // Когда кликнули на ползунок, вешаем события на драг и тач
            //
            onMouseDown(e) {
                if (!this.disabled) {
                    this.onDragStart(e);
                    this.bindEvents();
                }
            },

            //
            // Начало драга, ппроверяем не был ли это просто клик и вычиляем начальное положение
            // ползунка
            //
            onDragStart(event) {
                this.$emit('dragstart');

                this.isClick = true;
                if (event.type === 'touchstart') {
                    event.clientY = event.touches[0].clientY;
                    event.clientX = event.touches[0].clientX;
                }
                if (this.vertical) {
                    this.startY = event.clientY;
                } else {
                    this.startX = event.clientX;
                }
                this.startPosition = parseFloat(this.currentPosition);
            },

            //
            // На каждый драг устанавливаем новое положение ползунка
            // Это вызовет изменение значения в родительском компоненте, который в свою очередь
            // вызовет изменение пропса value
            //
            onDragging(event) {
                if (this.dragging) {
                    this.isClick = false;
                    // this.$parent.resetSize();
                    let diff = 0;
                    if (event.type === 'touchmove') {
                        event.clientY = event.touches[0].clientY;
                        event.clientX = event.touches[0].clientX;
                    }
                    if (this.vertical) {
                        this.currentY = event.clientY;
                        diff = ((this.startY - this.currentY) / this.$parent.sliderSize) * 100;
                    } else {
                        this.currentX = event.clientX;
                        diff = ((this.currentX - this.startX) / this.$parent.sliderSize) * 100;
                    }
                    this.setPosition(this.startPosition + diff);
                }
            },

            //
            // После драга убираем события
            //
            onDragEnd() {
                if (this.dragging) {
                    setTimeout(() => {
                        this.$emit('dragend');
                        if (!this.isClick) {
                            this.$parent.emitChange();
                        } else {
                            this.isClick = false;
                        }
                    }, 0);
                    this.unbindEvents();
                }
            },

            //
            // Вычисление значения слайдера относительно процентного смещения
            // @param {percent}
            //
            setPosition(percent) {
                if (percent === null || isNaN(percent)) {
                    return;
                }
                if (percent < 0) {
                    percent = 0;
                }
                if (percent > 100) {
                    percent = 100;
                }

                // Далее идет блок с расчетом значения относительно процентного смещения и
                // относительно длины шага. Это нужно просто принять...
                const lengthPerStep = 100 / ((this.max - this.min) / this.step);
                const steps = Math.round(percent / lengthPerStep);
                let value = (steps * lengthPerStep * (this.max - this.min) * 0.01) + this.min;
                value = parseFloat(value.toFixed(this.precision));

                // И наконец мы эмитим инпут, в результате чего отрабатывает наш v-model
                this.$emit('input', value);

                // this.$nextTick(() => {
                //     this.displayTooltip();
                //     this.$refs.tooltip && this.$refs.tooltip.updatePopper();
                // });
            },

            //
            // Биндим обработчики событий для слежения за драгом ползунка
            //
            bindEvents() {
                window.addEventListener('mousemove', this.onDragging);
                window.addEventListener('touchmove', this.onDragging);
                window.addEventListener('mouseup', this.onDragEnd);
                window.addEventListener('touchend', this.onDragEnd);
                window.addEventListener('contextmenu', this.onDragEnd);
            },

            //
            // Убиваем обработчики событий для слежения за драгом ползунка
            //
            unbindEvents() {
                window.removeEventListener('mousemove', this.onDragging);
                window.removeEventListener('touchmove', this.onDragging);
                window.removeEventListener('mouseup', this.onDragEnd);
                window.removeEventListener('touchend', this.onDragEnd);
                window.removeEventListener('contextmenu', this.onDragEnd);
            },
        },
    };
</script>

<style lang="scss">
    .v-slider-dot {
        position: absolute;
        top: calc(50% - .5px);
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .6rem;
        text-align: center;
        line-height: normal;
        transform: translate(-50%, -50%);
        -webkit-user-select: none;
        user-select: none;

        @include hover {
            .v-slider-dot__handle {
                transform: translate3d(0, 0, 0) scale(1.14);
            }
        }

        @include respond-to(sm) {
            padding: .7rem;
        }

        &__handle {
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            -webkit-user-select: none;
            user-select: none;
            transition: all .3s ease 0s;

            @include respond-to(xs) {
                width: 8px;
                height: 8px;
            }
        }

        &__tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            padding: 4px;
            font-size: 1.6rem;
            color: $base-1000;
            transform: translateX(-50%);
            pointer-events: none;
        }
    }
</style>
