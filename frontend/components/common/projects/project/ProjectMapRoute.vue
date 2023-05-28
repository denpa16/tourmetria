<template>
    <div :class="$style.ProjectMapRoute">
        <p v-if="title"
           :class="[$style.title, 'p5', 'c-base400']">
            {{ title }}
        </p>
        <div :class="$style.fields">
            <VInput
                :class="[$style.field, $style._static]"
                :value="projectName"
                preset-value
                disabled
            />
            <VInput
                :class="$style.field"
                :value="address"
                placeholder="Ваш адрес"
                preset-value
                @input="$emit('update-address', $event)"
                @enter="buildRoute"
            />
        </div>
        <div :class="[$style.transportMods, {[$style._hidden]: !transportType}]">
            <div v-for="type in transportTypes"
                 :key="type.name"
                 :class="[$style.transportModItem, {[$style._disabled]: transportType && transportType !== type.name}]"
                 @click="changeType(type.name)"
            >
                <component
                    :is="type.icon"
                    :class="$style.transportModItemIcon"
                />
                <VSpinner v-show="isRouteLoading && transportType === type.name"
                          size="small"
                          color="primary" />
                <span v-show="!isRouteLoading && transportType === type.name"
                      :class="[$style.transportModItemDuration, 'p6']">
                    <span>{{ routeDuration }}</span>
                </span>
            </div>
        </div>
        <div :class="$style.btns">
            <VButton :class="$style.btn"
                     color="primary"
                     :disabled="!address || isRouteLoading"
                     :spinner="isRouteLoading"
                     @click="buildRoute"
            >
                Применить
            </VButton>
            <VButton :class="$style.btn || isRouteLoading"
                     color="light"
                     :disabled="!address || isRouteLoading"
                     @click="resetRoute"
            >
                Сбросить
            </VButton>
        </div>
    </div>
</template>

<script>
    import IconWalk from '~/components/icons/IconWalk';
    import IconBus from '~/components/icons/IconBus';
    import IconCar from '~/components/icons/IconCar';

    export default {
        name: 'ProjectMapRoute',

        components: {
            IconWalk,
            IconBus,
            IconCar,
        },

        props: {
            title: {
                type: String,
                default: ''
            },

            address: {
                type: String,
                default: ''
            },

            projectName: {
                type: String,
                default: ''
            },

            routeDuration: {
                type: String,
                default: ''
            },

            transportType: {
                type: String,
                default: ''
            },

            isRouteLoading: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                transportTypes: [
                    {
                        name: 'pedestrian',
                        icon: 'IconWalk'
                    },
                    {
                        name: 'masstransit',
                        icon: 'IconBus'
                    },
                    {
                        name: 'auto',
                        icon: 'IconCar'
                    },
                ],
            };
        },

        methods: {
            buildRoute() {
                this.$emit('build-route');
            },

            resetRoute() {
                this.$emit('reset-route');
            },

            changeType(value) {
                this.$emit('update-transport-type', value);
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectMapRoute {
        //
    }

    .title {
        margin-bottom: 1.6rem;
    }

    .field {
        margin-bottom: .8rem;

        &:last-child {
            margin-bottom: 0;
        }

        &._static {
            &:global(.v-input--default.is-disabled) {
                opacity: 1;
            }
        }
    }

    .transportMods {
        overflow: hidden;
        display: flex;
        align-items: center;
        height: 4.4rem;
        margin-top: .8rem;
        padding: .2rem;
        background-color: $base-50;
        transition: all $default-transition;

        &._hidden {
            height: 0;
            margin-top: 0;
            padding: 0;
        }
    }

    .transportModItem {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        padding: 0 1.4rem;
        border-radius: .4rem;
        background-color: $base-0;
        color: $blue;
        transition: all $default-transition;
        cursor: pointer;

        &._disabled {
            flex: unset;
            background-color: transparent;
            color: $base-800;
        }

        @include hover {
            color: $blue;
        }
    }

    .transportModItemIcon {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: .8rem;
    }

    .transportModItemDuration {
        margin-top: .3rem;
    }

    .btns {
        display: flex;
        margin-top: 1.2rem;
    }

    .btn {
        flex: 1;
        margin-right: 1.2rem;

        &:last-child {
            margin-right: 0;
        }
    }

    .spinner {
        width: 1.6rem;
        height: 1.6rem;
    }
</style>
