import {splitThousands} from 'assets/js/utils/numberUtils';

/* Has filter */
export function roundToMillions(num, accuracy = 1) {
    if (typeof num !== 'number' && !Number.isNaN(num)) {
        console.warn('[Utils/roundToMillions] Аргумент "num" должен быть Number: ', num);
        return '';
    }
    if (typeof accuracy !== 'number' && !Number.isNaN(accuracy)) {
        console.warn('[Utils/roundToMillions] Аргумент "accuracy" должен быть Number: ', num);
        return '';
    }

    return (Number(num) / 1000000).toFixed(accuracy);
}

/* Has filter */
export function prettyPhone(rawPhoneNumber) {
    return rawPhoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
}

export function prettyPhoneNumber(rawPhoneNumber) {
    return rawPhoneNumber(rawPhoneNumber).replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '8 $2 $3 $4 $5');
}

export function cleanPhone(prettyPhoneNumber) {
    return prettyPhoneNumber.replace(/ |-|\(|\)|_/g, '');
}

/* Has filter */
export function bytesToSize(bytes) {
    if (bytes === undefined || bytes === null) {
        console.warn('[bytesToSize] Wrong bytes ', bytes);
        return '';
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) {
        return `${bytes} ${sizes[i]}`;
    }
    return `${((bytes / (1024 ** i))).toFixed(1)} ${sizes[i]}`;
}

/* Has filter */
export function dateToString(date) {
    if (!date || !(date instanceof Date)) {
        console.warn('[dateToString] Wrong date, ', date);
        return '';
    }

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
}

export function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (encodeURIComponent(value) || '') + expires + '; path=/';
}

export function getCookie(name, cookies) {
    let decodedCookie = '';

    if (typeof document === 'undefined') {
        decodedCookie = decodeURIComponent(cookies);
    } else {
        decodedCookie = decodeURIComponent(cookies || document.cookie);
    }

    const ca = decodedCookie.trim().split(';');
    let value = '';
    ca.forEach(item => {
        const param = item.split('=');
        if (param[0].trim() === name) {
            value = param[1];
        }
    });
    return value;
}

export function deleteCookie(name, path='/', domain='') {
    if (getCookie(name)) {
        document.cookie = `${name}=;path=${path};domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
}

export function chunkArray(arr, chunkSize) {
    const copy = arr.slice(0);
    const results = [];

    while (copy.length) {
        results.push(copy.splice(0, chunkSize));
    }

    return results;
}

export function formDataToObject(formData) {
    if (!formData || typeof formData !== 'object') {
        console.warn('[formDataToObject] wrong FormData');
        return {};
    }
    const obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

export function getOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
    };
}

export function getValueByPath(targetObj, path) {
    // eslint-disable-next-line no-unused-vars
    let currentObj = null;
    let currentPath = '';
    let pathStr = typeof path === 'string' ? path : String(path);

    if (pathStr.includes('[') || pathStr.includes(']')) {
        pathStr = pathStr.replace(/(\[)|(])/gm, '.');
        pathStr = pathStr.replace(/\.\./gm, '.');
    }

    if (pathStr.includes('.')) {
        return pathStr.split('.').reduce((res, subKey) => {
            if (!res) {
                return undefined;
            }

            if (isNaN(Number(subKey))) {
                currentPath += currentPath ? '.' + subKey : subKey;
            } else {
                currentPath += currentPath ? `[${subKey}]` : subKey;
            }

            if (res && res[subKey]) {
                currentObj = res[subKey];
                return res[subKey];
            }

            console.warn(`[Utils/getValueByPath]: target object doesn't contain ${currentPath}`);
            return undefined;
        }, targetObj);
    }

    return targetObj[path];
}

// Not stable
export function truncText(el, t) {
    const text = t || el.textContent;
    const wordArray = text.split(' ');

    while (el.scrollHeight > el.clientHeight) {
        wordArray.pop();
        el.innerHTML = wordArray.join(' ') + '...';
    }
}

export function isIe() {
    const ua = process.browser ? window?.navigator?.userAgent : '';
    const msie = ua.indexOf('MSIE ') > 0 || Boolean(ua.match(/Trident.*rv:11\./));

    return msie > 0;
}

export function scrollTo(id = false, offset = 0, force = false) {
    if (!id) {
        window.scroll({top: 0, left: 0, behavior: force ? 'instant' : 'smooth'});
    } else {
        const target = document.getElementById(id);
        if (target) {
            const position =
                target.getBoundingClientRect().top + window.pageYOffset;
            window.scroll({
                top: position - offset,
                left: 0,
                behavior: force ? 'instant' : 'smooth',
            });
        }
    }
}

export function getFontSize() {
    const html = window.document.documentElement;
    const style = window.getComputedStyle(html, null).getPropertyValue('font-size');
    return parseFloat(style);
}

export function convertToObject(data) {
    const result = {};
    data.forEach(item => {
        if (item.choices) {
            if (Array.isArray(item.choices)) {
                result[item.name] = [...item.choices];
            } else {
                result[item.name] = item.choices;
            }
        }

        if (item.range) {
            result[item.name] = {...item.range};
        }
        if (item.ranges) {
            result[item.name] = {...item.ranges};
        }
    });

    return result;
}

export function getFileNameAndExt(file) {
    const splitFileName = file.name.split('.');

    const ext = splitFileName[splitFileName.length -1];
    const name = splitFileName.slice(0, splitFileName.length -1).join('.');
    return {
        ext,
        name
    };
}

export function getStatus(num) {
    const statuses = {
        // Открыт в продажу
        1: 'FREE',
        // Платная бронь
        2: 'BOOKED',
        // Не для продажи
        3: 'UNAVAILABLE',
        // Контракт
        4: 'SOLD',
        // Закрыт в продажу
        5: 'CLOSED',
        // Переуступка
        6: 'ASSIGNMENT',
    };

    const textStatus = statuses[num];

    return {
        isShow: textStatus === 'FREE' || textStatus === 'BOOKED',
        isFree: textStatus === 'FREE',
        isBooked: textStatus === 'BOOKED',
        isSold: textStatus === 'SOLD',
    };
}

export function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function getPageTitle() {
    return document.getElementsByTagName('title')[0].innerHTML || '';
}

export function clearDoubleSpaces(str) {
    if (typeof str !== 'string') {
        console.warn('[utils/clearDoubleSpaces] argument must be string');
        return;
    }

    return str.replace(/  +/g, ' ').trim();
}

export function clearAllSpaces(str) {
    if (typeof str !== 'string') {
        console.warn('[utils/clearDoubleSpaces] argument must be string');
        return;
    }

    return str.replace(/\s+/g, ' ').trim();
}

export function getFilterLabel(name) {
    if (typeof name !== 'string') {
        console.warn('[utils/getFilterLabel] argument must be string');
        return;
    }

    const filters = {
        area_max: 'Макс.площадь',
        area_min: 'Мин.площадь',
        city: 'Город',
        completion_date: 'Срок сдачи',
        has_promotions: 'Акция',
        price_max: 'Макс.цена',
        price_min: 'Мин.цена',
        property_type: 'Тип недвижимости',
        rooms: 'Комнатность',
        building: 'Литер',
        floor_max: 'Макс.этаж',
        floor_min: 'Макс.этаж',
        project: 'Проект',
        cost: 'Цена объекта',
        creditPeriod: 'Срок кредита',
        developmentprojectSlug: 'Проект',
        initialPayment: 'Первоначальный взнос',
        mortgageType: 'Тип ипотеки',

    };

    return filters[name] || '';
}

export function convertFilterValuesToOrderDetails(values, specs) {
    const entries = Object.entries(values);

    function findSpecsLabel(value, key) {
        return specs[key].find(item => item?.value === value)?.label || '';
    }

    const res = entries.map(([key, value]) => {
        const filterLabel = getFilterLabel(key);

        if (!value || !value?.length || !filterLabel) {
            return null;
        }

        let valueLabel = value;

        if (Array.isArray(specs[key])) {
            if (Array.isArray(valueLabel)) {
                valueLabel = valueLabel.map(value => findSpecsLabel(value, key)).join(',');
            } else {
                valueLabel = findSpecsLabel(valueLabel, key);
            }
        }

        if (!Number.isNaN(Number(valueLabel))) {
            return `${filterLabel}: ${splitThousands(Number(valueLabel))}`;
        }

        return `${filterLabel}: ${valueLabel}`;
    }).filter(Boolean);

    if (!res.length) {
        return '';
    }

    return res.join('; ');
}

export function getPropertyLabel(value) {
    const properties = {
        commercial: 'Коммерческое помещение',
        flat: 'Квартира',
        hotelroom: 'Гостиничный номер',
        parking: 'Парковочное место',
        storage: 'Кладовое помещение',
    };

    return properties[value] || '';
}

export function pluralToSingular(text) {
    if (typeof text !== 'string') {
        console.warn('[Utils/pluralToSingular] Аргумент "text" должен быть строкой', text);
        return text;
    }

    const lastChars = text.slice(-3);

    if (lastChars[lastChars.length - 1] !== 's') {
        return text;
    }

    if (lastChars.length < 3) {
        return text.slice(0, -1);
    }

    if (lastChars === 'ies') {
        return text.slice(0, -3) + 'y';
    }

    if (lastChars.slice(-2) === 'es') {
        return text.slice(0, -2);
    }

    return text.slice(0, -1);
}

// необходим и для плиток с названиями, поэтому выносим в скоуп внешнего модуля чтобы избежать дублирования
// создаем map для работы с форматами
// Внимание для расширения валидации по другим форматам, дописываем сюда новые форматы и их значения для файллоадера
const patternTypesFiles = new Map([
    ['pdf', 'application/pdf'],
    ['png', 'image/png'],
    ['webp', 'image/webp'],
    ['jpg', 'image/jpg'],
    ['jpeg', 'image/jpeg'],
    ['tiff', 'image/tiff'],
    ['xls', 'application/vnd.ms-excel'],
    ['doc', 'application/msword'],
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['docs', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['ppt', 'application/vnd.ms-powerpoint'],
    ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['aac', 'audio/aa'],
    ['wav', 'audio/wa'],
    ['opus', 'audio/opu'],
    ['oga', 'audio/og'],
    ['mp3', 'audio/mpeg'],
]);

export function fileTypeValidation(listTypesFile, file) {
    return listTypesFile.some(format => patternTypesFiles.get(format.toLowerCase()) === file.type);
}

export function getErrorObject(object) {
    const keys = Object.keys(object);
    const obj = {};

    if (keys.length === 0) {
        return obj;
    }

    keys.forEach(item => {
        obj[item] = object[item]?.toString();
    });

    return obj;
}

export function debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
        // eslint-disable-next-line
        const context = this;
        const args = arguments;

        function later() {
            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        }

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}
