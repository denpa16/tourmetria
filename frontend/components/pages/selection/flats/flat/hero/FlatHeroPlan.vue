<template>
    <div :class="[$style.FlatHeroPlan, {[$style._modal]: isModal}]">
        <div :class="$style.switchPanel">
            <VSwitch v-if="lot.layout && (lot.layout.plan_without_furnish || lot.layout.plan_only_walls)"
                     :value="planValues.furniture"
                     :class="$style.switch"
                     @input="handleChangePlanValue({furniture: $event})">
                <template #trueLabel>
                    Мебель
                </template>
            </VSwitch>
            <VSwitch v-if="lot.layout && (lot.layout.plan_only_walls || lot.layout.plan_without_partition)"
                     :value="planValues.not_main_wall"
                     :class="$style.switch"
                     @input="handleChangePlanValue({not_main_wall: $event})">
                <template #trueLabel>
                    Перегородки
                </template>
            </VSwitch>
            <VSwitch v-if="activePlan && isHaveSunAngles"
                     :value="planValues.sun"
                     :class="$style.switch"
                     @input="handleChangePlanValue({sun: $event})">
                <template #trueLabel>
                    Солнце
                </template>
            </VSwitch>
        </div>

        <transition name="fade-content">
            <Compass v-show="isModal || ($deviceIs.mobile && !planValues.sun)"
                     :class="$style.compass"
                     :rotate-deg="lot.layout && lot.layout.compass_azimuth"
                     :size="$deviceIs.mobile ? 'small' : 'medium'"
                     :sun-active="planValues.sun" />
        </transition>

        <transition name="fade-content">
            <VSquareButton v-if="!isModal && (!$deviceIs.mobile || !planValues.sun)"
                           :class="$style.btnZoomMobile"
                           aria-label="Открыть планировку на весь экран"
                           @click="$emit('open-plan')">
                <IconFullscreen :class="$style.icon" />
            </VSquareButton>
        </transition>

        <transition name="scroll-right">
            <div v-show="planValues.sun"
                 key="sunTabs"
                 :class="[$style.tabs, {[$style._modal]: isModal}]">
                <VTab v-for="(tab, index) in sunTabs"
                      :key="tab.value + tab.label + index"
                      :tab="tab"
                      :active="tab.value === activeSunTime"
                      :class="$style.tab"
                      @click="handleSunTimeTabClick(tab.value)" />
            </div>
        </transition>

        <ZoomControls v-if="isModal && activePlan"
                      :class="$style.zoomControls"
                      :zoom-in-disabled="scaleLvl >= 3"
                      :zoom-out-disabled="scaleLvl <= 0"
                      :color="($deviceIs.tablet || $deviceIs.mobile) ? 'white' : 'light'"
                      @click-zoom-in="zoomIn"
                      @click-zoom-out="zoomOut" />

        <div ref="wrapper"
             :key="activePlan"
             :class="$style.wrapper"
             @touchmove="wrapperMousemove"
             @touchend="mouseup"
             @mousemove="wrapperMousemove"
             @mouseup="mouseup">
            <div ref="resizeBlock"
                 :class="$style.planWrapper"
                 @mousedown="onMousedown"
                 @touchstart="onMousedown">
                <div v-if="!isModal && activePlan"
                     :class="$style.btnZoom">
                    <VSquareButton aria-label="Открыть на весь экран"
                                   @click="$emit('open-plan')">
                        <IconLoupe :class="$style.icon" />
                    </VSquareButton>
                </div>

                <div v-if="activePlan && lot.layout && lot.layout[activePlan]"
                     :class="[$style.plan, {[$style._modal]: isModal}]"
                     :style="resizeStyles"
                >
                    <img v-for="plan in plans"
                         v-show="plan && plan.name === activePlan"
                         :key="plan.name"
                         :src="plan.src"
                         alt="Планировка квартиры"
                         :class="[$style.planImage, {[$style._modal]: isModal, [$style['_with-sun-path']] : planValues.sun}]"
                         draggable="false"
                    >

                    <transition name="fade-slow">
                        <SunPath v-if="planValues.sun"
                                 :class="[$style.sunPath, {[$style._modal]: isModal}]"
                                 :value="activeSunTime"
                                 :start-angle="Number(lot.sun_start_position)"
                                 :end-angle="Number(lot.sun_stop_position)"
                                 :morning-angle="Number(lot.sun_morning_position)"
                                 :daytime-angle="Number(lot.sun_daytime_position)"
                                 :evening-angle="Number(lot.sun_evening_position)"
                                 color="#FFC700" />
                    </transition>
                </div>
                <div v-else
                     :class="[$style.plan, $style._empty]">
                    <img :src="emptyPlan"
                         alt="Планировка отсутствует"
                         :class="[$style.planImage, $style._empty]"
                         draggable="false"
                    >
                    <p :class="[$style.emptyText, 'h6', 'c-base300']">
                        на данный момент <br> планировка отсутствует
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ZoomControls from '~/components/common/ZoomControls';
    import IconLoupe from '~/components/icons/IconLoupe';
    import Compass from '~/components/common/Compass';
    import IconFullscreen from '~/components/icons/IconFullscreen';
    import SunPath from '~/components/common/SunPath';

    export default {
        name: 'FlatHeroPlan',

        components: {
            SunPath,
            ZoomControls,
            IconLoupe,
            Compass,
            IconFullscreen,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            isModal: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                position: {},
                startPosition: {},
                wrapperPosition: {},
                scaleLvl: 0,
                isPressed: false,
                emptyPlan: '/images/flat/emptyPlan.svg',
                planValues: {
                    furniture: true,
                    not_main_wall: true,
                    sun: false,
                },

                activeSunTime: 'morning',
                sunTabs: [
                    {value: 'morning', label: 'Утро'},
                    {value: 'daytime', label: 'День'},
                    {value: 'evening', label: 'Вечер'},
                ],

                plans: [
                    {
                        name: 'plan_only_walls',
                        src: this.lot?.layout?.plan_only_walls,
                    },
                    {
                        name: 'plan_without_partition',
                        src: this.lot?.layout?.plan_without_partition,
                    },
                    {
                        name: 'plan_without_furnish',
                        src: this.lot?.layout?.plan_without_furnish,
                    },
                    {
                        name: 'plan_full',
                        src: this.lot?.layout?.plan_full,
                    },
                ],
            };
        },

        computed: {
            activePlan() {
                if (!this.planValues.furniture && !this.planValues.not_main_wall) {
                    return 'plan_only_walls';
                } else if (this.planValues.furniture && !this.planValues.not_main_wall) {
                    return 'plan_without_partition';
                } else if (!this.planValues.furniture && this.planValues.not_main_wall) {
                    return 'plan_without_furnish';
                }
                return 'plan_full';
            },

            resizeStyles() {
                const scale = (this.scaleLvl * .15) + 1;
                const x = this?.wrapperPosition?.x || 0;
                const y = this?.wrapperPosition?.y || 0;

                if (!this.$refs.resizeBlock || !this.$refs.wrapper) {
                    return {};
                }

                return {
                    transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
                };
            },

            sunResizeStyles() {
                const scale = (this.scaleLvl * .15) + 1;
                const x = this?.wrapperPosition?.x || 0;
                const y = this?.wrapperPosition?.y || 0;

                if (!this.$refs.resizeBlock || !this.$refs.wrapper) {
                    return {};
                }

                return {
                    transform: `translateX(calc(-50% + ${x}px)) translateY(calc(-50% + ${y}px)) scale(${scale})`,
                };
            },

            isHaveSunAngles() {
                return Boolean(this.lot?.sun_start_position && this.lot?.sun_stop_position);
            }
        },

        mounted() {
            this.wrapperMousemove();
        },

        methods: {
            handleChangePlanValue(val) {
                console.log(val);
                if (Object.keys(val)[0] === 'sun') {
                    this.planValues.sun = val.sun;
                    if (val.sun) {
                        this.$emit('show-sun');
                    } else {
                        this.$emit('hide-sun');
                    }
                }
                this.planValues = {
                    ...this.planValues,
                    ...val,
                };
                this.$emit('change-plan', this.planValues);
            },

            zoomIn() {
                if (this.scaleLvl >= 3) {
                    return;
                }

                this.scaleLvl += 1;
            },

            zoomOut() {
                if (this.scaleLvl <= 0) {
                    return;
                }

                this.scaleLvl--;

                if (this.scaleLvl <= 0) {
                    this.wrapperPosition = {
                        x: 0,
                        y: 0,
                    };
                }
            },

            onMousedown(ev) {
                this.isPressed = true;
                this.startPosition = {
                    y: ev?.touches?.length ? ev.touches[0].clientY : ev.clientY,
                    x: ev?.touches?.length ? ev.touches[0].clientX : ev.clientX,
                };
            },

            mouseup() {
                this.isPressed = false;
            },

            wrapperMousemove(ev) {
                if (!this.isPressed
                    || !this.startPosition
                    || this.scaleLvl === 0
                ) {
                    return;
                }
                ev.preventDefault();

                if (!this.wrapperPosition
                    || this.wrapperPosition.x === undefined
                    || this.wrapperPosition.y === undefined) {
                    this.wrapperPosition = {
                        x: 0,
                        y: 0,
                    };
                }

                const resizeSizes = this.$refs.resizeBlock.getBoundingClientRect();
                const wrapperSizes = this.$refs.wrapper.getBoundingClientRect();
                const maxX = ((resizeSizes.width - wrapperSizes.width) / 2) + 200;
                const maxY = ((resizeSizes.height - wrapperSizes.height) / 2) + 100;

                const clientX = ev?.touches?.length ? ev.touches[0].clientX : ev.clientX;
                const clientY = ev?.touches?.length ? ev.touches[0].clientY : ev.clientY;

                let x = this.wrapperPosition.x + (clientX - this.startPosition.x);
                let y = this.wrapperPosition.y + (clientY - this.startPosition.y);
                if (x > maxX) {
                    x = maxX;
                }

                if (x < -maxX) {
                    x = -maxX;
                }

                if (y > maxY) {
                    y = maxY;
                }

                if (y < -maxY) {
                    y = -maxY;
                }

                this.wrapperPosition = {
                    y,
                    x,
                };

                this.startPosition = {
                    x: clientX,
                    y: clientY,
                };
            },

            handleSunTimeTabClick(val) {
                this.activeSunTime = val;
            }
        }
    };
</script>

<style lang="scss" module>
    .FlatHeroPlan {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;

        @include respond-to(xs) {
            padding-bottom: 6.8rem;
        }

        &._modal {
            @include respond-to(sm) {
                padding-bottom: 12rem;

                .planImage {
                    height: 85%;
                }
            }

            @include respond-to(xs) {
                .switchPanel {
                    margin-bottom: 3.2rem;
                    padding: 3.2rem 6.4rem 2.2rem 1rem;
                }

                .switch {
                    &:not(:last-child) {
                        margin-bottom: 2.2rem;
                    }
                }

                .compass {
                    bottom: 4.7rem;
                    left: 2.7rem;
                }
            }
        }
    }

    .switchPanel {
        //margin-bottom: 5rem;
        padding: 2.4rem 2.4rem;

        @include respond-to(xs) {
            margin-bottom: 3.2rem;
            padding: .5rem 0;
        }
    }

    .switch {
        &:not(:last-child) {
            margin-right: 1.4rem;

            @include respond-to(xs) {
                margin-right: 1.1rem;
            }
        }
    }

    .compass {
        position: absolute;
        bottom: 4rem;
        left: 4rem;
        display: none;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            bottom: 2.7rem;
            left: 1.7rem;
        }
    }

    .zoomControls {
        position: absolute;
        top: calc(50% + 9rem);
        right: 2.4rem;
        z-index: 2;
        transform: translateY(-50%);

        @include respond-to(sm) {
            top: unset;
            bottom: 2.4rem;
            transform: unset;

            & :global(.v-square-button--custom) {
                width: 4rem;
                height: 4rem;
            }
        }

        @include respond-to(xs) {
            right: 1.6rem;
            bottom: 4rem;
        }
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        width: 90%;
        margin: 0 auto;
    }

    .planWrapper {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        @include respond-to(sm) {
            padding: 4.8rem 0;
        }

        @include respond-to(xs) {
            padding: 0;
        }
    }

    .plan {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 41%;
        height: 100%;
        margin: 0 auto;

        @include hover {
            .btnWrapper {
                opacity: 1;
            }
        }

        &._modal {
            min-width: 30%;
        }

        &._empty {
            flex-direction: column;
            height: 84%;
        }

        @include respond-to(md) {
            min-width: 57%;

            &._modal {
                min-width: 38%;
            }
        }

        @include respond-to(sm) {
            min-height: unset;

            &._modal {
                min-width: 38%;
            }
        }

        @include respond-to(xs) {
            &._modal {
                min-width: 60%;
            }

            &._empty {
                flex-direction: column;
                height: 73%;
            }
        }

        @media (max-width: 1160px) {
            min-width: 40%;
        }

        @media (max-width: 996px) {
            min-width: 46%;
        }

        @media (max-width: 880px) {
            min-width: 54%;
        }

        @media (max-width: 767px) {
            min-width: 33%;
        }

        @media (max-width: 645px) {
            min-width: 38%;
        }

        @media (max-width: 570px) {
            min-width: 43%;
        }

        @media (max-width: 500px) {
            min-width: 50%;
        }

        @media (max-width: 430px) {
            min-width: 60%;
        }

        @media (max-width: 360px) {
            min-width: 70%;
        }
    }

    .planImage {
        position: relative;
        width: 100%;
        max-width: 39.8rem;
        height: 100%;
        max-height: 39.8rem;
        margin: 0 auto;
        object-fit: contain;
        transition: all $default-transition;

        @include respond-to(sm) {
            max-width: 39.1rem;
            max-height: 39.1rem;
        }

        @include respond-to(xs) {
            max-width: 21rem;
            max-height: 21rem;
        }

        &._modal {
            max-width: 55.6rem;
            max-height: 55.6rem;

            @include respond-to(sm) {
                max-width: 41.2rem;
                max-height: 41.2rem;
            }

            @include respond-to(xs) {
                max-width: 34.3rem;
                max-height: 34.3rem;
            }

            &._with-sun-path {
                width: 60%;
                height: 60%;

                @include respond-to(sm) {
                    width: 65%;
                    height: 65%;
                }

                @include respond-to(xs) {
                    width: 50%;
                    height: 50%;
                }
            }
        }

        &._with-sun-path {
            width: 67%;
            height: 67%;

            @include respond-to(lg) {
                width: 55%;
                height: 55%;
            }

            @include respond-to(md) {
                width: 56%;
                height: 56%;
            }
        }

        &._empty {
            height: 75%;
        }
    }

    .sunPath {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120%;
        height: 120%;
        transform: translateY(-53%) translateX(-50%);

        @include respond-to(xs) {
            height: 100%;
        }

        &._modal {
            width: 110%;
            height: 110%;

            @include respond-to(sm) {
                width: 120%;
                height: 120%;
            }

            @include respond-to(xs) {
                width: 100%;
            }
        }
    }

    .emptyText {
        margin-top: auto;
        text-align: center;
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.4rem;
            line-height: 1.6rem;
        }
    }

    .btnZoom {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        display: none;
        border-radius: .8rem;
        background-color: $base-0;
        transform: translate(-50%, -50%);
        transition: opacity $default-color-transition;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .btnZoomMobile {
        position: absolute;
        right: 0;
        bottom: 2rem;
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;
    }

    .tabs {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 5;
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 2.4rem;
        border-radius: 1.6rem;
        background-color: $base-0;
        transform: translateY(calc(100% + 1.2rem));

        @include respond-to(xs) {
            padding: 0 0 1.6rem;
            transform: unset;
        }

        &._modal {
            @include respond-to(sm) {
                bottom: 4rem;
                left: 50%;
                width: auto;
                padding: 0;
                background-color: transparent;
                transform: translateX(-50%);
            }

            @include respond-to(xs) {
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 6rem 0 3.6rem;
                background-color: $base-0;
                transform: unset;
            }
        }
    }

    .tab {
        &:not(:last-child) {
            margin-right: .8rem;
        }
    }
</style>
