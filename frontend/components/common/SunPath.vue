<template>
    <div v-if="startAngle && endAngle"
         ref="main"
         :class="$style.SunPath">
        <div ref="wrapper"
             :class="$style.wrapper"
             :style="wrapperStyles">
            <svg
                :class="$style.path"
                :viewBox="`0 0 ${diameter} ${diameter}`"
            >
                <path fill="none"
                      :stroke="color"
                      :stroke-width="stroke"
                      stroke-dasharray="6"
                      :d="describeArc" />
            </svg>

            <span :class="$style.point"
                  :style="startPointStyles"></span>
            <span :class="$style.point"
                  :style="endPointStyles"></span>

            <span :class="[$style.text, 'p8']"
                  :style="startTextStyles">Восход</span>
            <span :class="[$style.text, 'p8']"
                  :style="endTextStyles">Закат</span>

            <IconSun :class="[$style.icon, {[$style._loaded]: isLoaded}]"
                     :style="iconStyles" />
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import IconSun from '~/components/icons/IconSun';

    export default {
        name: 'SunPath',

        components: {
            IconSun
        },

        props: {
            value: {
                type: String,
                default: 'morning',
                validator(value) {
                    return ['morning', 'daytime', 'evening'].indexOf(value) !== -1;
                },
            },

            padding: {
                type: Number,
                default: 10,
            },

            stroke: {
                type: Number,
                default: 2,
            },

            color: {
                type: String,
                default: '#000000'
            },

            startAngle: {
                type: Number,
                required: true,
            },

            endAngle: {
                type: Number,
                required: true,
            },

            morningAngle: {
                type: Number,
                required: true,
            },

            daytimeAngle: {
                type: Number,
                required: true,
            },

            eveningAngle: {
                type: Number,
                required: true,
            },
        },

        data() {
            return {
                main: null,
                wrapper: null,
                diameter: 0,
                isLoaded: false,
            };
        },

        computed: {
            activeAngle() {
                switch (this.value) {
                    case 'morning':
                        return this.morningAngle;
                    case 'daytime':
                        return this.daytimeAngle;
                    case 'evening':
                        return this.eveningAngle;
                    default:
                        return this.morningAngle;
                }
            },

            wrapperStyles() {
                if (this.diameter) {
                    return {
                        height: this.diameter + 'px',
                        width: this.diameter + 'px',
                    };
                }

                return {
                    height: '100%',
                    width: '100%'
                };
            },

            iconStyles() {
                return {
                    color: this.color,
                    left: this.radiusWithoutStroke + 'px',
                    top: this.radiusWithoutStroke + 'px',
                    transform: `rotate(${this.isDirectDirection ? '' : '-'}${this.activeAngle}deg) translateY(-${this.radius + 'px'}) rotate(${this.isDirectDirection ? '' : '-'}${this.activeAngle}deg)`,
                };
            },

            startTextStyles() {
                return {
                    left: this.radiusWithoutStroke + 'px',
                    top: this.radiusWithoutStroke + 'px',
                    transform: `rotate(${this.isDirectDirection ? '' : '-'}${this.startAngle}deg) translateY(calc((${this.radius + 'px'} + 100%) * -1)) rotate(${this.isDirectDirection ? '-' : ''}${this.startAngle}deg)`,
                };
            },

            endTextStyles() {
                return {
                    left: this.radiusWithoutStroke + 'px',
                    top: this.radiusWithoutStroke + 'px',
                    transform: `rotate(${this.isDirectDirection ? '' : '-'}${this.endAngle}deg) translateY(calc((${this.radius + 'px'} + 100%) * -1)) rotate(${this.isDirectDirection ? '-' : ''}${this.endAngle}deg)`,
                };
            },

            pointStyles() {
                return {
                    backgroundColor: this.color,
                };
            },

            startPointStyles() {
                return {
                    ...this.pointStyles,
                    left: this.start.x + 'px',
                    top: this.start.y + 'px',
                };
            },

            endPointStyles() {
                return {
                    ...this.pointStyles,
                    left: this.end.x + 'px',
                    top: this.end.y + 'px',
                };
            },

            radius() {
                return (this.diameter - (this.padding * 2)) / 2;
            },

            radiusWithoutStroke() {
                return this.radius - (this.stroke * 2);
            },

            center() {
                return {
                    x: this.radius + this.padding,
                    y: this.radius + this.padding,
                };
            },

            start() {
                return this.polarToCartesian(this.startAngle);
            },

            end() {
                return this.polarToCartesian(this.endAngle);
            },

            isDirectDirection() {
                return this.endAngle >= this.startAngle;
            },

            describeArc() {
                const largeArcFlag = this.endAngle - this.startAngle <= 180 ? '0' : '1';

                const d = [
                    'M',
                    this.end.x,
                    this.end.y,
                    'A',
                    this.radius,
                    this.radius,
                    0,
                    largeArcFlag,
                    0,
                    this.start.x,
                    this.start.y
                ].join(' ');

                return d;
            },
        },

        mounted() {
            if (this.$refs.main) {
                this.main = this.$refs.main;
                addResizeListener(this.main, this.calculateDiameter);
            }

            if (this.$refs.wrapper) {
                this.wrapper = this.$refs.wrapper;
            }

            this.$nextTick(this.calculateDiameter);
        },

        beforeDestroy() {
            if (this.main) {
                removeResizeListener(this.main, this.calculateDiameter);
            }
        },

        methods: {
            calculateDiameter() {
                this.isLoaded = false;
                if (this.main?.offsetWidth && this.main?.offsetHeight) {
                    this.diameter = Math.min(this.main.offsetWidth, this.main.offsetHeight);
                } else {
                    this.diameter = 0;
                }

                setTimeout(() => this.isLoaded = true, 100);
            },

            polarToCartesian(angleInDegrees) {
                const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;

                return {
                    x: this.center.x + (this.radius * Math.cos(angleInRadians)),
                    y: this.center.y + (this.radius * Math.sin(angleInRadians)),
                };
            },
        }
    };
</script>

<style lang="scss" module>
    .SunPath {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        user-select: none;
    }

    .wrapper {
        position: relative;
    }

    .path {
        width: 100%;
        height: 100%;
    }

    .point {
        position: absolute;
        display: block;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        transform: translateX(-50%) translateY(-50%);
    }

    .text {
        position: absolute;
        top: 0;
        left: 0;
        color: $base-400;
    }

    .icon {
        position: absolute;
        z-index: 1;
        width: 2.8rem;
        height: 2.8rem;

        &._loaded {
            transition: transform 2s ease;
        }
    }
</style>
