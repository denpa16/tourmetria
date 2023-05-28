const projectPinSize = [30, 30];
const infraPinSize = [32, 32];
// const locationShieldSize = window.innerWidth <= 920 ? [42, 42] : [68, 68];


const locationShieldSize = [68, 68];

export const apiKey = 'd6a649b7-b263-4ea6-91a7-6b78f9d6ce18';

export const isMobile = () => window.innerWidth < 768;

export const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1280;

export const isDesktop = () => window.innerWidth >= 1281;

export const getPinElement = element => {
    if (!element) {
        return;
    }

    const overlay = element.getOverlaySync();
    const layout = overlay.getLayoutSync();

    return layout.getElement().firstElementChild;
};

export const r_projectPinTemplate = (ymaps, project) => {
    if (!ymaps) {
        return;
    }

    const icon = `<svg class="r-icn-map-marker" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.43301 7.25C5.24056 7.58333 4.75944 7.58333 4.56699 7.25L1.10289 1.25C0.910436 0.916669
            1.151 0.500001 1.5359 0.500001L8.4641 0.5C8.849 0.5 9.08956 0.916666 8.89711 1.25L5.43301 7.25Z"
            fill="#009EAE" stroke="#38ADC2"
            />
            </svg>`;

    const template = ymaps.templateLayoutFactory.createClass(`<div class="map-pin js-project-pin" data-pk="${project.id}">
            <span class="map-pin__name">
                ${project.name}
            </span>
            <span class="map-pin__marker">
                ${icon}
            </span>
        </div>`, {
        build() {
            template.superclass.build.call(this);

            const el = this.getParentElement().getElementsByClassName('js-project-pin')[0];

            const toggleActiveClass = () => {
                const options = this.getData()?.options?._parent?._parent?._parents[0]?._options;

                if (!options) {
                    return;
                }

                options.active
                    ? el.classList.add('_active')
                    : el.classList.remove('_active');
            };

            if (!this.inited && isDesktop()) {
                this.inited = true;

                this.getData().options.events.add('change', function() {
                    toggleActiveClass();
                }, this);
            }

            const options = this.getData().options;

            const projectPinPoints = [
                [45, -40],
                [-45, 10],
            ];

            const iconShape = {
                type: 'Rectangle',
                coordinates: projectPinPoints,
            };

            options.set('shape', iconShape);
        },
    });

    return template;
};

export const rLocationProjectPinTemplate = (ymaps, project, imgProperty) => {
    if (!ymaps) {
        return;
    }

    const icon = `<svg class="r-icn-map-marker" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.43301 7.25C5.24056 7.58333 4.75944 7.58333 4.56699 7.25L1.10289 1.25C0.910436 0.916669
            1.151 0.500001 1.5359 0.500001L8.4641 0.5C8.849 0.5 9.08956 0.916666 8.89711 1.25L5.43301 7.25Z"
            fill="#009EAE" stroke="#38ADC2"
            />
            </svg>`;

    const template = ymaps.templateLayoutFactory.createClass(`<div data-pk="${project.id}"
            class="r-location-shield ${project.disabled ? '_disabled' : ''}">
            <span class="r-location-shield__image"
            style="background-image: url(${project[imgProperty]});"></span>
            <span class="r-location-shield__marker">
                ${icon}
            </span>
         </div>`, {
        build() {
            template.superclass.build.call(this);
            const el = this.getParentElement().getElementsByClassName('r-location-shield')[0];

            const toggleActiveClass = () => {
                if (!this.getData()?.options?._parent?._parent?._parents?.length) {
                    return;
                }

                const options = this.getData().options._parent._parent._parents[0]?._options;

                if (!options) {
                    return;
                }

                options.active
                    ? el.classList.add('_active')
                    : el.classList.remove('_active');
            };

            if (!this.inited && isDesktop()) {
                this.inited = true;

                this.getData().options.events.add('change', function() {
                    toggleActiveClass();
                }, this);
            }

            const options = this.getData().options;

            const projectPinPoints = [
                [-24, -48],
                [24, 0],
            ];

            const iconShape = {
                type: 'Rectangle',
                coordinates: projectPinPoints,
            };
            options.set('shape', iconShape);
        },
    });

    return template;
};

export const generateLocationProjectPin = (ymaps, coords, template) => {
    if (!ymaps) {
        return;
    }

    return new ymaps.Placemark([coords[1], coords[0]], {}, {
        iconLayout: template,
        iconOffset: [-30, -30],
        zIndex: 680,
    });
};

export const RGenerateLocationProjectPin = (ymaps, coords, template) => {
    if (!ymaps) {
        return;
    }

    return new ymaps.Placemark([coords[0], coords[1]], {}, {
        iconLayout: template,
        iconOffset: [-36, -36],
        zIndex: 680,
    });
};

export const getClusterProjectTemplate = ymaps => {
    if (!ymaps) {
        return;
    }

    return ymaps.templateLayoutFactory.createClass(`<div class="index-map-cluster">
            <div class="index-map-cluster__number">{{ properties.geoObjects.length }}</div>
            <div class="index-map-cluster__pin"></div>
        </div>`);
};

export const r_getClusterProjectTemplate = ymaps => {
    if (!ymaps) {
        return;
    }

    const icon = `<svg class="r-icn-map-marker" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.43301 7.25C5.24056 7.58333 4.75944 7.58333 4.56699 7.25L1.10289 1.25C0.910436 0.916669
            1.151 0.500001 1.5359 0.500001L8.4641 0.5C8.849 0.5 9.08956 0.916666 8.89711 1.25L5.43301 7.25Z"
            fill="#009EAE" stroke="#38ADC2"
            />
            </svg>`;

    return ymaps.templateLayoutFactory.createClass(`<div class="map-cluster">
            <div class="map-cluster__number">
                <span class="map-cluster__text">+{{ properties.geoObjects.length }}</span>
            </div>
            <span class="map-cluster__marker">
                    ${icon}
            </span>
        </div>`);
};

export const h_getClusterProjectTemplate = ymaps => {
    if (!ymaps) {
        return;
    }

    const icon = `<svg class="r-icn-map-marker" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.43301 7.25C5.24056 7.58333 4.75944 7.58333 4.56699 7.25L1.10289 1.25C0.910436 0.916669
            1.151 0.500001 1.5359 0.500001L8.4641 0.5C8.849 0.5 9.08956 0.916666 8.89711 1.25L5.43301 7.25Z"
            fill="#009EAE" stroke="#38ADC2"
            />
            </svg>`;

    return ymaps.templateLayoutFactory.createClass(`<div class="map-cluster _hover">
            <div class="map-cluster__number">
                <span class="map-cluster__text">+{{ properties.geoObjects.length }}</span>
            </div>
            <span class="map-cluster__marker">
                    ${icon}
            </span>
        </div>`);
};

export const r_getClusterInfraTemplate = ymaps => {
    if (!ymaps) {
        return;
    }

    function getBackground(objects) {
        calculateFractions(objects);
        return 'background: conic-gradient(red 0deg 80deg, green 80deg 190deg, blue 190deg 360deg);';
    }

    function calculateFractions(objects) {
        objects.reduce((res, object) => {
            console.log(object);
            return res;
        }, {});
    }

    return ymaps.templateLayoutFactory.createClass(`<div class="infra-cluster" style="${getBackground()}">
            <div class="infra-cluster__donut"></div>
            <span class="infra-cluster__text">{{ properties.geoObjects.length }}</span>
        </div>`);
};

export const projectPinTemplate = (ymaps, project) => {
    if (!ymaps) {
        return;
    }

    const leftClass = project.map_text_to_left ? '_left' : '';

    const template = ymaps.templateLayoutFactory.createClass(`<div class="index-map-pin ${leftClass} js-project-pin" data-pk="${project.id}">
            <span class="index-map-pin__name">${project.name}</span>
        </div>`, {
        build() {
            template.superclass.build.call(this);

            const el = this.getParentElement().getElementsByClassName('js-project-pin')[0];

            const toggleActiveClass = () => {
                const options = this.getData()?.options?._parent?._parent?._parents[0]?._options;

                if (!options) {
                    return;
                }

                options.active
                    ? el.classList.add('_active')
                    : el.classList.remove('_active');
            };

            if (!this.inited && isDesktop()) {
                this.inited = true;

                this.getData().options.events.add('change', function() {
                    toggleActiveClass();
                }, this);
            }

            const options = this.getData().options;

            const projectWidth = Math.ceil(el.firstElementChild.offsetWidth);
            const halfProjectWidth = Math.ceil(projectWidth / 2);
            const projectPinPoints = [
                [-halfProjectWidth, -44],
                [halfProjectWidth, -44],
                [halfProjectWidth, -18],
                [12, -18],
                [0, 8],
                [-12, -18],
                [-halfProjectWidth, -18],
            ];
            const inversePoints = [
                [-halfProjectWidth, 42],
                [halfProjectWidth, 42],
                [halfProjectWidth, 18],
                [12, 18],
                [0, 0],
                [-12, 18],
                [-halfProjectWidth, 18],
            ];

            const iconShape = {
                type: 'Polygon',
                coordinates: [
                    leftClass ? inversePoints : projectPinPoints,
                ],
            };
            options.set('shape', iconShape);
        },
    });

    return template;
};

export const r_officePinTemplate = (ymaps, image) => {
    if (!ymaps && !image) {
        return;
    }

    return ymaps.templateLayoutFactory.createClass(`<div class="r-project-d-office__pin" style="background-image: url(${image})"></div>`);
};

export const r_finalPointPinTemplate = (ymaps, name) => {
    if (!ymaps) {
        return;
    }

    const icon =
        `<svg class="r-icn-map-marker" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.243 10.982L8 15.2l-4.243-4.218a5.932 5.932 0 01-1.3-6.5 5.972 5.972 0 012.21-2.677
            6.025 6.025 0 016.666 0 5.973 5.973 0 012.21 2.677 5.932 5.932 0 01-1.3 6.5zM8 8.09c.354 0
            .693-.14.943-.388a1.322 1.322 0 000-1.875 1.337 1.337 0 00-1.886 0 1.322 1.322 0 000
            1.875c.25.249.59.388.943.388z" fill="currentColor"/>
        </svg>`;

    return ymaps.templateLayoutFactory.createClass(`<div class="r-map-routes-form-pin">
            <span class="r-map-routes-form-pin__name">
                <div class="r-map-routes-form-pin__marker">
                    ${icon}
                </div>
                <span class="r-map-routes-form-pin__title">${name}</span>
            </span>
        </div>`);
};

export const infraPinTemplate = (ymaps, obj, dropColor) => {
    if (!ymaps) {
        return;
    }

    let template;
    const description = obj.name.length > 140 ? `${obj.name.slice(0, 139)}...` : obj.name;

    if (obj.image) {
        template = `<div class="location-shield js-location-marker" data-pk="${obj.id}">
                        <span class="location-shield__image" style="background-image: url(${obj.image})"></span>
                        <span class="location-shield__name" style="color: #000"> ${description}</span>
                    </div>`;
    } else if (obj.category_icon_content) {
        template = `<div class="project-d-location-map__marker js-location-marker" data-pk="${obj.id}">
                        <div class="project-d-location-map__svg" style="background-color: ${dropColor}">
                            ${obj.category_icon_content}
                        </div>
                        <div class="project-d-location-map__hint">${description}</div>
                    </div>`;
    } else {
        template = `<div class="project-d-location-map__marker js-location-marker" data-pk="${obj.id}">
                        <div class="project-d-location-map__hint">${description}</div>
                    </div>`;
    }

    const layout = ymaps.templateLayoutFactory.createClass(template, {
        build() {
            layout.superclass.build.call(this);

            const el = this.getParentElement().getElementsByClassName('js-location-marker')[0];

            if (!el) {
                return;
            }

            const svgPaths = el.querySelectorAll('.project-d-location-map__svg path');

            if (svgPaths?.length) {
                svgPaths.forEach(path => path.setAttribute('fill', 'currentColor'));
            }

            const options = this.getData().options;

            const iconShape = {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 16
            };

            options.set('shape', iconShape);
        },
    });

    return layout;
};

export const RInfraPinTemplate = (ymaps, obj, dropColor) => {
    if (!ymaps) {
        return;
    }

    let template;
    const description = obj.name.length > 30 ? `${obj.name.slice(0, 30)}...` : obj.name;

    if (obj.category_icon_text) {
        template = `<div class="r-project-d-location-map__marker js-location-marker">
                        <div class="r-project-d-location-map__shield" style="background-color: ${dropColor} ">
                            ${obj.category_icon_text}
                        </div>
                        <div class="r-project-d-location-map__hint">
                            <span class="r-project-d-location-map__description">${description}</span>
                            <span class="r-project-d-location-map__group"></span>
                            <span class="r-project-d-location-map__button">
                                <svg width="6" height="8">
                                    <use xlink:href="#r-icn-arrow-right"></use>
                                </svg>
                            </span>
                        </div>
                    </div>`;
    } else {
        template = `<div class="project-d-location-map__marker js-location-marker">
                        <div class="project-d-location-map__hint">${description}</div>
                    </div>`;
    }

    const layout = ymaps.templateLayoutFactory.createClass(template, {
        build() {
            layout.superclass.build.call(this);
            const el = this.getParentElement().getElementsByClassName('js-location-marker')[0];

            if (!el) {
                return;
            }

            const toggleActiveClass = () => {
                const options = this.getData()?.options?._parent?._parent?._parents[0]?._options;

                if (!options) {
                    return;
                }

                options.active
                    ? el.classList.add('_active')
                    : el.classList.remove('_active');
            };

            if (!this.inited) {
                this.inited = true;
                this.getData().options.events.add('change', function() {
                    toggleActiveClass();
                }, this);
            }
        },
    });

    return layout;
};

export const generateInfraPin = (object = {}, template) => {
    const coords = object.coords;
    const sizes = object.image ? locationShieldSize : infraPinSize;

    return {
        type: 'Feature',
        id: object.id,
        geometry: {
            type: 'Point',
            coordinates: coords ? coords.split(',') : [],
        },
        properties: {
            id: object.category,
            name: object.name,
            color: object.category_color,
            icon: object.category_icon_text,
        },
        options: {
            iconColor: object.category_color,
            iconLayout: template,
            iconOffset: [-sizes[0] / 2, -sizes[1]],
            iconShape: {
                type: 'Rectangle',
                coordinates: [
                    [0, 0], sizes,
                ],
            },
            active: false,
        },
    };
};

export const generateProjectPin = (ymaps, coords, template) => {
    if (!ymaps) {
        return;
    }

    return new ymaps.Placemark([coords[0], coords[1]], {}, {
        iconLayout: template,
        iconOffset: [-projectPinSize[0] / 2, -projectPinSize[1]],
        iconShape: {
            type: 'Rectangle',
            // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
            coordinates: [
                [0, 0], projectPinSize,
            ],
        },
    });
};

export const infraClusterBalloon = ymaps => {
    if (!ymaps) {
        return;
    }

    return ymaps.templateLayoutFactory.createClass([`
        <div class="infra-cluster-balloon">
            {% for geoObject in properties.geoObjects %}
                <div class="infra-cluster-balloon__item">
                    <div class="infra-cluster-balloon__icon" style="color: {{ geoObject.properties.color }}"></div>

                    <div class="infra-cluster-balloon__label">{{ geoObject.properties.name }}</div>
                </div>
            {% endfor %}
        </div>
        `].join(''));
};


export function exponeaTrackObj(name, obj = {}) {
    /* eslint-disable */
    if (!window.exponea) return;

    exponea.track(name, obj);
    /* eslint-enable */
}

export function exponeaTrack(name, type, value = true) {
    /* eslint-disable */
    if (!window.exponea) return;

    exponea.track(name, {
        [type]: value,
    });
    /* eslint-enable */
}

export const endWaypointPinTemplate = (ymaps, type) => {
    if (!ymaps) {
        return;
    }

    const iconWalk = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.44286 5.082L6.31244 3.724C6.52232 3.57041 6.77759 3.49155 7.03752 3.5C7.35457 3.50791 7.66127 3.6144 7.915 3.80467C8.16873 3.99493 8.35687 4.25953 8.45327 4.56167C8.56177 4.90175 8.66094 5.13158 8.75077 5.25117C9.0222 5.6133 9.37431 5.90719 9.77913 6.1095C10.184 6.31181 10.6304 6.41698 11.0829 6.41667V7.58333C10.4805 7.58399 9.88547 7.45108 9.34058 7.19417C8.7957 6.93726 8.31455 6.56275 7.93177 6.09758L7.52519 8.40467L8.72744 9.41383L10.0242 12.9768L8.92752 13.3758L7.73752 10.1068L5.76002 8.44725C5.59774 8.31621 5.47356 8.14405 5.40041 7.94871C5.32726 7.75337 5.30782 7.54199 5.34411 7.33658L5.64102 5.65367L5.24611 5.94067L4.00536 7.64867L3.06152 6.96267L4.43294 5.075L4.44286 5.082ZM7.87461 3.20833C7.56519 3.20833 7.26844 3.08542 7.04965 2.86662C6.83086 2.64783 6.70794 2.35109 6.70794 2.04167C6.70794 1.73225 6.83086 1.4355 7.04965 1.21671C7.26844 0.997916 7.56519 0.875 7.87461 0.875C8.18403 0.875 8.48077 0.997916 8.69956 1.21671C8.91836 1.4355 9.04127 1.73225 9.04127 2.04167C9.04127 2.35109 8.91836 2.64783 8.69956 2.86662C8.48077 3.08542 8.18403 3.20833 7.87461 3.20833ZM6.14094 10.8972L4.26611 13.1314L3.37244 12.3818L5.10844 10.3133L5.54361 9.04167L6.58836 9.91667L6.14094 10.8972Z"
        fill="currentColor" />
        </svg>`;
    const iconCar = `<svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6663 13.3334H3.33301V14.0001C3.33301 14.1769 3.26277 14.3465 3.13775 14.4715C3.01272 14.5965 2.84315 14.6667 2.66634 14.6667H1.99967C1.82286 14.6667 1.65329 14.5965 1.52827 14.4715C1.40325 14.3465 1.33301 14.1769 1.33301 14.0001V8.00008L3.00834 3.53208C3.10363 3.27788 3.27424 3.05882 3.49738 2.90418C3.72051 2.74955 3.98553 2.66671 4.25701 2.66675H11.7423C12.0138 2.66671 12.2788 2.74955 12.502 2.90418C12.7251 3.05882 12.8957 3.27788 12.991 3.53208L14.6663 8.00008V14.0001C14.6663 14.1769 14.5961 14.3465 14.4711 14.4715C14.3461 14.5965 14.1765 14.6667 13.9997 14.6667H13.333C13.1562 14.6667 12.9866 14.5965 12.8616 14.4715C12.7366 14.3465 12.6663 14.1769 12.6663 14.0001V13.3334ZM2.75701 8.00008H13.2423L11.7423 4.00008H4.25701L2.75701 8.00008ZM4.33301 11.3334C4.59822 11.3334 4.85258 11.2281 5.04011 11.0405C5.22765 10.853 5.33301 10.5986 5.33301 10.3334C5.33301 10.0682 5.22765 9.81384 5.04011 9.62631C4.85258 9.43877 4.59822 9.33342 4.33301 9.33342C4.06779 9.33342 3.81344 9.43877 3.6259 9.62631C3.43836 9.81384 3.33301 10.0682 3.33301 10.3334C3.33301 10.5986 3.43836 10.853 3.6259 11.0405C3.81344 11.2281 4.06779 11.3334 4.33301 11.3334ZM11.6663 11.3334C11.9316 11.3334 12.1859 11.2281 12.3734 11.0405C12.561 10.853 12.6663 10.5986 12.6663 10.3334C12.6663 10.0682 12.561 9.81384 12.3734 9.62631C12.1859 9.43877 11.9316 9.33342 11.6663 9.33342C11.4011 9.33342 11.1468 9.43877 10.9592 9.62631C10.7717 9.81384 10.6663 10.0682 10.6663 10.3334C10.6663 10.5986 10.7717 10.853 10.9592 11.0405C11.1468 11.2281 11.4011 11.3334 11.6663 11.3334Z"
            fill="currentColor" />
            </svg>`;
    const iconBus = `<svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.583 13.3333H4.91634V14C4.91634 14.1768 4.8461 14.3464 4.72108 14.4714C4.59605 14.5964 4.42649 14.6667 4.24967 14.6667H2.91634C2.73953 14.6667 2.56996 14.5964 2.44494 14.4714C2.31991 14.3464 2.24967 14.1768 2.24967 14V8H1.58301V5.33333H2.24967V3.33333C2.24967 2.97971 2.39015 2.64057 2.6402 2.39052C2.89025 2.14048 3.22939 2 3.58301 2H12.9163C13.27 2 13.6091 2.14048 13.8591 2.39052C14.1092 2.64057 14.2497 2.97971 14.2497 3.33333V5.33333H14.9163V8H14.2497V14C14.2497 14.1768 14.1794 14.3464 14.0544 14.4714C13.9294 14.5964 13.7598 14.6667 13.583 14.6667H12.2497C12.0729 14.6667 11.9033 14.5964 11.7783 14.4714C11.6532 14.3464 11.583 14.1768 11.583 14V13.3333ZM3.58301 3.33333V8H12.9163V3.33333H3.58301ZM5.24967 12C5.51489 12 5.76924 11.8946 5.95678 11.7071C6.14432 11.5196 6.24967 11.2652 6.24967 11C6.24967 10.7348 6.14432 10.4804 5.95678 10.2929C5.76924 10.1054 5.51489 10 5.24967 10C4.98446 10 4.7301 10.1054 4.54257 10.2929C4.35503 10.4804 4.24967 10.7348 4.24967 11C4.24967 11.2652 4.35503 11.5196 4.54257 11.7071C4.7301 11.8946 4.98446 12 5.24967 12ZM11.2497 12C11.5149 12 11.7692 11.8946 11.9568 11.7071C12.1443 11.5196 12.2497 11.2652 12.2497 11C12.2497 10.7348 12.1443 10.4804 11.9568 10.2929C11.7692 10.1054 11.5149 10 11.2497 10C10.9845 10 10.7301 10.1054 10.5426 10.2929C10.355 10.4804 10.2497 10.7348 10.2497 11C10.2497 11.2652 10.355 11.5196 10.5426 11.7071C10.7301 11.8946 10.9845 12 11.2497 12Z"
            fill="currentColor" />
            </svg>`;

    function getInitialIcon(iconType) {
        return type === iconType ? '_active' : '';
    }

    const template = ymaps.templateLayoutFactory.createClass(`<div class="end-waypoint">
            <span class="end-waypoint__icon end-waypoint__icon_pedestrian ${getInitialIcon('pedestrian')}">
                ${iconWalk}
            </span>
            <span class="end-waypoint__icon end-waypoint__icon_auto ${getInitialIcon('auto')}">
                ${iconCar}
            </span>
            <span class="end-waypoint__icon end-waypoint__icon_masstransit ${getInitialIcon('masstransit')}">
                ${iconBus}
            </span>
         </div>`, {
        build() {
            template.superclass.build.call(this);
            // const el = this.getParentElement().getElementsByClassName('end-waypoint')[0];
            //
            // const toggleIcon = () => {
            //     const options = this.getData()?.options?._parent?._parent?._parent?._parent?._parent?._parent?._options;
            //     if (!options) {
            //         return;
            //     }
            //
            //     const activeIcon = el.querySelector('._active');
            //     const currentIcon = el.querySelector(`.end-waypoint__icon_${options.type}`);
            //
            //     if (activeIcon) {
            //         activeIcon.classList.remove('_active');
            //     }
            //     if (currentIcon) {
            //         activeIcon.classList.add('_active');
            //     }
            // };
            //
            // if (!this.inited && isDesktop()) {
            //     this.inited = true;
            //
            //     this.getData()
            //         .options
            //         .events
            //         .add('change', function() {
            //             toggleIcon();
            //         }, this);
            // }

            const options = this.getData().options;

            const iconShape = {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 16
            };
            options.set('shape', iconShape);
        },
    });

    return template;
};
