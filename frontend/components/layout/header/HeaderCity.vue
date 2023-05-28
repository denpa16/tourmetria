<template>
    <div :class="$style.HeaderCity">
        <VSelect
            v-show="!$deviceIs.mobile"
            :class="[$style.select, 'p6']"
            :options="citiesInfo"
            :value="getCurrentCity.value"
            :is-forced-open="forcedOpen"
            margin-dropdown="3rem"
            min-width-dropdown="49.6rem"
            bordered
            search
            :is-tabs="isAnyRegions"
            @input="handleInput"
        >
            <template #icon>
                <IconLocation :class="$style.icon" />
            </template>
        </VSelect>

        <VButton v-show="$deviceIs.mobile"
                 :class="$style.btn"
                 color="light"
                 @click="openModal"
        >
            <span>{{ getCurrentCity.label }}</span>
            <template #icon>
                <IconLocation :class="$style.icon" />
            </template>
        </VButton>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    import IconLocation from '~/components/icons/IconLocation';
    import SelectModal from '~/components/layout/modals/SelectModal';
    import {deleteCookie, setCookie} from '~/assets/js/utils/commonUtils';

    export default {
        name: 'HeaderCity',

        components: {
            IconLocation,
        },

        props: {
            citiesInfo: {
                type: Array,
                default: () => [],
            },

            defaultCity: {
                type: Object,
                default: () => ({})
            },

            forcedOpenCitySelect: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                forcedOpen: false,
                modalTitle: 'Ваш город'
            };
        },

        computed: {
            ...mapGetters(['getCurrentCity']),

            isAnyRegions() {
                return this.citiesInfo.some(city => city.group);
            },
        },

        watch: {
            forcedOpenCitySelect: function(newVal) {
                if (newVal) {
                    this.forcedOpen = true;
                }
                setTimeout(() => this.forcedOpen = false, 100);
            }
        },

        methods: {
            ...mapActions(['setCurrentCity']),
            ...mapActions('projects', ['fetchCurrentCityProject', 'setParams']),

            handleInput(value) {
                const {value: cityValue, label: cityLabel} = this.citiesInfo.find(city => (city.value === value) || (city.value === value?.value)) || this.citiesInfo[0];
                const city = {value: cityValue, label: cityLabel};
                this.setCurrentCity(city);
                this.fetchCurrentCityProject(city);

                if (city?.value) {
                    setCookie('current-city', JSON.stringify(city), 365);
                } else {
                    deleteCookie('current-city');
                }
            },

            openModal() {
                this.$modal.open(SelectModal, {
                    title: this.modalTitle,
                    options: this.citiesInfo,
                    value: this.getCurrentCity.value,
                    type: 'value',
                    filter: this.handleInput,
                    search: true,
                    isTabs: true
                });
            },
        }
    };
</script>

<style lang="scss" module>
    .HeaderCity {
        //
    }

    .select {
        min-width: 16.1rem;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .btn {
        width: 100%;
    }
</style>
