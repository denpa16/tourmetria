<template>
    <div :class="$style.TheAccordion">
        <div :class="[$style.header, titleClass]"
             @click="handleClick">
            <slot v-if="$slots.title"
                  name="title"></slot>
            <span v-else>{{ title }} <span v-if="postfix"
                                           class="c-blue">{{ postfix }}</span></span>
            <IconArrowLeft :class="[$style.icon, {[$style._opened]: currentState}, iconClass]" />
        </div>
        <div ref="content"
             :class="[$style.content, contentClass]">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    export default {
        name: 'TheAccordion',

        components: {IconArrowLeft},

        props: {
            value: {
                type: Boolean,
                default: null,
            },

            title: {
                type: String,
                default: '',
            },

            postfix: {
                type: String,
                default: '',
            },

            titleClass: {
                type: String,
                default: '',
            },

            contentClass: {
                type: String,
                default: '',
            },

            iconClass: {
                type: String,
                default: '',
            }
        },

        data() {
            return {
                resizeObserver: null,
                isContentOpened: false,
            };
        },

        computed: {
            isManualMode() {
                return this.value !== null;
            },

            currentState() {
                return this.isManualMode ? this.value : this.isContentOpened;
            }
        },

        watch: {
            currentState(newValue) {
                if (newValue) {
                    this.$refs.content.style.maxHeight = this.$refs.content.scrollHeight + 'px';
                } else {
                    this.$refs.content.style.maxHeight = null;
                }
            }
        },

        mounted() {
            this.resizeObserver = new ResizeObserver(this.handleResizeObserver);
            if (this.$refs.content) {
                this.resizeObserver.observe(this.$refs.content);
            }

            if (this.value) {
                this.$refs.content.style.maxHeight = this.$refs.content.scrollHeight + 'px';
            }
        },

        beforeDestroy() {
            if (this.$refs.content) {
                this.resizeObserver.observe(this.$refs.content);
            }
        },

        methods: {
            handleClick() {
                if (this.currentState) {
                    if (this.isManualMode) {
                        this.updateValue(false);
                    } else {
                        this.isContentOpened = false;
                    }
                } else if (this.isManualMode) {
                    this.updateValue(true);
                } else {
                    this.isContentOpened = true;
                }
                this.$emit('update');
            },

            handleResizeObserver() {
                if (this.$refs.content && this.currentState && this.$refs.content.scrollHeight) {
                    this.$refs.content.style.maxHeight = parseFloat(this.$refs.content.style.maxHeight) + this.$refs.content.scrollHeight + 'px';
                }
            },

            updateValue(value) {
                this.$emit('change', value);
            }
        }
    };
</script>

<style lang="scss" module>
    .TheAccordion {
        width: 100%;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        color: $base-800;
        transition: color $default-color-transition;
        cursor: pointer;

        @include hover {
            color: $blue;
        }
    }

    .title {
        margin-right: .4rem;
        white-space: nowrap;
    }

    .icon {
        display: block;
        width: 1.2rem;
        min-width: 1.2rem;
        height: 1.2rem;
        transform: rotate(-90deg);
        transition: transform .2s ease-out;

        &._opened {
            transform: rotate(90deg);
        }
    }

    .content {
        overflow: hidden;
        max-height: 0;
        transition: max-height $default-transition;
    }
</style>
