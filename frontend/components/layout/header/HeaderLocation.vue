<template>
    <transition name="modal">
        <div v-if="isShow"
             :class="$style.HeaderLocation">
            <p :class="[$style.label, 'p1']">
                <IconMap :class="$style.mapIcon" />
                <transition name="fade-content"
                            mode="out-in">
                    <span :key="currentCity.label">
                        <span class="c-blue">
                            {{ currentCity.label }}
                        </span>
                        <span v-show="!isCityEmpty"> &mdash; где вы ищете недвижимость?</span>
                    </span>
                </transition>
            </p>
            <div :class="$style.btns">
                <VButton color="primary"
                         :class="$style.btn"
                         size="medium"
                         @click.native="handleAcceptBtnClick"
                >
                    <span :class="$style.btnText">
                        Да, все верно
                    </span>
                </VButton>
                <VButton color="light"
                         :class="$style.btn"
                         size="medium"
                         @click.native="handleChangeBtnClick"
                >
                    <span :class="$style.btnText">{{ !isCityEmpty ? 'Выбрать другой' : 'Выбрать город' }}</span>
                </VButton>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconMap from '~/components/icons/IconMap';
    import {mapActions, mapGetters} from 'vuex';
    import {deleteCookie, setCookie} from '~/assets/js/utils/commonUtils';

    export default {
        name: 'HeaderLocation',

        components: {
            IconMap,
        },

        props: {
            citiesInfo: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                isShow: false,
                currentCity: (this.citiesInfo && this.citiesInfo[0]) || {},
            };
        },

        computed: {
            ...mapGetters(['getCurrentCity']),
            isCityEmpty() {
                return !this.currentCity?.value;
            }
        },

        mounted() {
            // По умолчанию решили оставить все города, без предложения выбора города
            // UPD: передумали, решили предлагать выбор города
            if (!localStorage.getItem('accept-location')) {
                this.isShow = true;
            }

            navigator.geolocation.getCurrentPosition(position => {
                const CLOSEST_CITY_RADIUS = 200;

                const closestCity = this.citiesInfo.reduce((res, city) => {
                    if (!city.value) {
                        return res;
                    }

                    const distance = this.calculateDistance(city.coordinates, position.coords);

                    if (!distance || (res.distance && res.distance < distance)) {
                        return res;
                    }
                    return {...city, distance};
                }, {});

                if (closestCity?.distance <= CLOSEST_CITY_RADIUS) {
                    delete closestCity.distance;
                    this.currentCity = closestCity;
                }
            });
        },

        methods: {
            ...mapActions(['setCurrentCity']),
            ...mapActions('projects', ['fetchCurrentCityProject', 'setParams']),

            calculateDistance(a, b) {
                if (!a || !b || !a.latitude || !a.longitude || !b.latitude || !b.longitude) {
                    console.error('[calculateDistance] invalid parameters passed');
                    return;
                }

                const EARTH_RADIUS = 6371;
                const latitudeRadA = this.degToRad(a.latitude);
                const longitudeRadA = this.degToRad(a.longitude);
                const latitudeRadB = this.degToRad(b.latitude);
                const longitudeRadB = this.degToRad(b.longitude);

                return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(Math.pow(Math.sin((latitudeRadB - latitudeRadA) / 2), 2)
                    + (Math.cos(latitudeRadB) * Math.cos(latitudeRadA) * Math.pow(Math.sin((longitudeRadB - longitudeRadA) / 2), 2))));
            },

            degToRad(deg) {
                return deg * (Math.PI / 180);
            },

            handleAcceptBtnClick() {
                if (this.getCurrentCity?.value !== this.currentCity?.value) {
                    this.setCurrentCity(this.currentCity);
                    this.fetchCurrentCityProject(this.currentCity);

                    if (this.currentCity) {
                        const {value, label} = this.currentCity;
                        setCookie('current-city', JSON.stringify({value, label}), 365);
                    } else {
                        deleteCookie('current-city');
                    }
                }

                localStorage.setItem('accept-location', 'true');

                this.isShow = false;
            },

            handleChangeBtnClick() {
                localStorage.setItem('accept-location', 'true');
                this.isShow = false;
                this.$emit('change');
            },
        },
    };
</script>

<style lang="scss" module>
    .HeaderLocation {
        min-width: 32.5rem;
        max-width: 32.5rem;
        padding: 2.4rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .label {
        display: flex;
        align-items: baseline;
        text-transform: uppercase;
        font-weight: 800;
    }

    .mapIcon {
        display: block;
        width: 1.2rem;
        min-width: 1.2rem;
        height: 1.2rem;
        margin-right: .8rem;
        color: $blue;
    }

    .btns {
        display: flex;
        margin-top: 2.4rem;
    }

    .btn {
        margin-right: .8rem;

        &:last-child {
            margin-right: 0;
        }
    }
</style>
