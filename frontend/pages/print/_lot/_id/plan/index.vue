<template>
    <div :class="$style.FlatPlan">
        <div :class="$style.header">
            <IconLogo :class="$style.iconLogo" />
        </div>

        <div :class="$style.wrapper">
            <Compass :rotate-deg="flat.layout && flat.layout.compass_azimuth"
                     :class="$style.compass"
                     size="large" />
            <div v-if="plan"
                 :class="$style.imgBox">
                <img :class="$style.plan"
                     :src="plan"
                     alt="Планировка квартиры"
                >
            </div>
            <div v-else
                 :class="[$style.imgBox, $style.emptyBox]">
                <img :class="[$style.plan, $style.planEmpty]"
                     src="/images/flat/emptyPlan.svg"
                     alt="Планировка квартиры"
                >

                <p :class="$style.textEmpty"
                >
                    на данный момент <br> планировка отсутствует
                </p>
            </div>
        </div>

        <div :class="$style.footer">
            <qrcode :class="$style.qrCode"
                    :value="link.href"
                    :options="{ width: 90, margin: 0 }"
            />

            <div :class="$style.footerText">
                <div :class="$style.qrText">
                    <p :class="$style.title">
                        Смотреть квартиру
                    </p>
                    <p :class="$style.text">
                        Отсканируйте qr-код <br> и посмотрите на {{ link.domain }}
                    </p>
                    <p :class="[$style.text, $style.date]">
                        Документ создан: {{ setDate }} - {{ currentTime }}
                    </p>
                </div>

                <div :class="$style.info">
                    <p :class="$style.text">
                        Номер квартиры: {{ flat.number }}
                    </p>
                    <p :class="$style.text">
                        Проект: {{ flat.project_name }}
                    </p>
                    <p :class="$style.text">
                        Литер: {{ flat.building }} литер
                    </p>
                    <p :class="$style.text">
                        Подъезд: {{ flat.section }} <span v-if="flat.section_count">из {{ flat.section_count }}</span>
                    </p>
                    <p :class="$style.text">
                        Этаж:  {{ flat.floor }} <span v-if="flat.floor_count">из {{ flat.floor_count }}</span>
                    </p>
                    <div :class="$style.offer">
                        <p :class="$style.smallText">
                            Не является публичной офертой. Цена может быть скорректирована.
                        </p>
                        <p :class="$style.smallText">
                            Информация взята с сайта СК "Неометрия": {{ link.domain }}
                        </p>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
    import IconLogo from '~/components/icons/IconLogo';
    import Compass from '~/components/common/Compass';
    import {mapGetters} from 'vuex';

    export default {
        name: 'FlatPlan',

        components: {
            IconLogo,
            Compass,
        },

        layout: 'empty',

        async asyncData({app, params, query, error}) {
            try {
                const flatRes = await app.$axios.$get(app.$api[params.lot].id(params.id));

                return {
                    flat: flatRes ? flatRes : {},
                    planValues: {
                        furniture: query.furniture === 'true',
                        not_main_wall: query.not_main_wall === 'true',
                    },

                    currentTime: query.time,
                };
            } catch (err) {
                console.warn('[Lot print plan page/asyncData] request failed: ', err);
                return error({statusCode: 404});
            }
        },

        data() {
            return {
                flat: {},
                planValues: {},
                currentTime: '',
            };
        },

        computed: {
            ...mapGetters('domain', {domain: 'getDomainAddress'}),
            plan() {
                if (!this.planValues.furniture && !this.planValues.not_main_wall) {
                    return this.flat?.layout?.plan_only_walls;
                } else if (this.planValues.furniture && !this.planValues.not_main_wall) {
                    return this.flat?.layout?.plan_without_partition;
                } else if (!this.planValues.furniture && this.planValues.not_main_wall) {
                    return this.flat?.layout?.plan_without_furnish;
                }
                return this.flat?.layout?.plan_full;
            },

            link() {
                return {
                    href: `${this.domain}/selection/flats/${this.flat.id}`,
                    domain: this.domain,
                };
            },

            setDate() {
                return new Date().toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });
            },
        },
    };
</script>

<style lang="scss" module>
    .FlatPlan {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 1190px;
        height: 1670px;
    }

    .header {
        width: 100%;
        margin-bottom: 100px;
        padding: 30px 50px;
    }

    .iconLogo {
        width: 150px;
        height: 32px;
    }

    .wrapper {
        position: relative;
        padding-top: 130px;
    }

    .compass {
        position: absolute;
        top: 20px;
        right: 0;
    }

    .imgBox {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 950px;
        height: 950px;
        margin: 0 auto;
    }

    .emptyBox {
        flex-direction: column;
    }

    .plan {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .planEmpty {
        width: 80%;
        height: 80%;
        object-fit: contain;
        opacity: .4;
    }

    .textEmpty {
        margin-top: 2.8rem;
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 700;
        line-height: 40px;
        color: $base-300;
    }

    .footer {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: auto;
        padding: 50px;
    }

    .footerText {
        flex: 1;
        display: flex;
        height: fit-content;
    }

    .qrCode {
        width: 90px;
        height: 90px;
        margin-right: 30px;
    }

    .text {
        font-size: 14px;
        line-height: 24px;
    }

    .smallText {
        font-size: 11px;
        line-height: 14px;
    }

    .info {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 80px;
    }

    .title {
        font-size: 16px;
        margin-bottom: 10px;
        font-weight: 600;
        color: $blue;
    }

    .date {
        padding-bottom: 10px;
        border-bottom: 1px solid $base-100;
    }

    .offer {
        margin-top: auto;
        padding-bottom: 5px;
    }
</style>
