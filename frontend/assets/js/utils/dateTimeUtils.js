/* eslint-disable no-inline-comments */
import {leadingZero} from '~/assets/js/utils/numberUtils';

export const dayByIndex = (index, short) => {
    const fullList = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресение',
    ];

    const shortList = [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс',
    ];

    return short ? shortList[index] : fullList[index];
};

export const monthByIndex = (index, short, plural) => {
    const fullList = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    const pluralList = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря',
    ];

    const shortList = [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ];

    if (short) {
        return shortList[index];
    }

    return plural ? pluralList[index] : fullList[index];
};

export const isValidDate = date => !isNaN(Date.parse(date));
export const isDateObject = date => date instanceof Date;
export const toDateObject = date => isDateObject(date) ? date : new Date(date);

export const formatDateTime = (date, pattern) => {
    if (!date) {
        return '';
    }

    const d = isValidDate(date) ? new Date(date) : new Date();

    const params = {
        // Date
        $d: leadingZero(d.getDate()), // Day of the month, 2 digits with leading zeros. // '01' to '31'
        $j: d.getDate(), // Day of the month without leading zeros. // '1' to '31'

        // Days of the week
        $D: dayByIndex(d.getDay(), true), // Day of the week, textual, 3 letters. // 'Пн', 'Вт'
        $l: dayByIndex(d.getDay()), // Day of the week, textual, long. // 'Пятница'

        // Month
        $m: leadingZero(d.getMonth() + 1), // Month, 2 digits with leading zeros. // '01' to '12'
        $n: d.getMonth() + 1, // Month without leading zeros. // '1' to '12'
        $M: monthByIndex(d.getMonth(), true), // Month, textual, 3 letters. // 'Янв'
        $b: monthByIndex(d.getMonth(), true).toLowerCase(), // Month, textual, 3 letters, lowercase. // 'янв'
        $F: monthByIndex(d.getMonth()), // Month, textual, long. // 'Январь'
        $E: monthByIndex(d.getMonth(), false, true), // Month, plural, long. // 'Января'
        $e: monthByIndex(d.getMonth(), false, true).toLowerCase(), // Month, plural, long, lowercase // 'января'

        // Year
        $y: d.getFullYear(), // Year, 4 digits. // 1993

        // Time
        // Hours
        $g: Math.floor(d.getHours() / 2), // Hour, 12-hour format without leading zeros. // '1' to '12'
        $G: d.getHours(), // Hour, 24-hour format without leading zeros. // '0' to '23'
        $h: leadingZero(Math.floor(d.getHours() / 2)), // Hour, 12-hour format. // '01' to '12'
        $H: leadingZero(d.getHours()), // Hour, 24-hour format. // '01' to '23'

        // Minutes
        $i: d.getMinutes(), // Minutes, without leading zeros. // '1' to '59'
        $I: leadingZero(d.getMinutes()), // Minutes. // '01' to '59'

        // Seconds
        $s: d.getSeconds(), // Seconds, without leading zeros. // '1' to '59'
        $S: leadingZero(d.getSeconds()), // Seconds. // '1' to '59'
    };

    const symbols = pattern.match(/[$][a-zA-Z]/gm);
    let result = pattern;

    symbols.forEach(s => {
        result = result.replace(s, params[s]);
    });

    return result;
};

export function toISO(string, separator = '.') {
    if (typeof string !== 'string') {
        console.warn('[Utils/toISO] Аргумент "string" должен быть String: ', string);
        return '';
    }

    if (!string.includes(separator)) {
        console.warn('[Utils/toISO] Аргумент "string" должен содержать "separator": ', string, separator);
        return '';
    }

    const [date, month, year] = string.split(separator);

    return `${year?.length === 2 ? '20' + year : year}-${month}-${date}`;
}

export function splitDot(string) {
    if (!string) {
        return;
    }

    if (typeof string !== 'string') {
        console.warn('[Utils/splitDash] Аргумент "string" должен быть String: ', string);
        return '';
    }
    return string.replace(/\/|\\/g, '.');
}

export function splitSlash(string) {
    if (!string) {
        return;
    }

    if (typeof string !== 'string') {
        console.warn('[Utils/splitDash] Аргумент "string" должен быть String: ', string);
        return '';
    }
    return string.replace(/\./g, '/');
}

export function calculateDaysBetweenDates(startDate, endDate) {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        console.warn('[Utils/calculateDaysBetweenDates] Аргумент "startDate" и "endDate" должны быть датами', startDate, endDate);
        return 0;
    }

    const diff = toDateObject(startDate).getTime() - toDateObject(endDate).getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
}

export function calculateTimeBetweenTimes(start, end) {
    if (!start.includes(':') || !end.includes(':')) {
        return '';
    }

    const startTime = start.split(':').map(Number);
    const endTime = end.split(':').map(Number);
    const minutesDiff = endTime[1] - startTime[1];
    const hoursDiff = minutesDiff < 0 ? endTime[0] - startTime[0] - 1 : endTime[0] - startTime[0];

    return `${hoursDiff}h ${Math.abs(minutesDiff)}m`;
}

export function isToday(date) {
    if (!isValidDate(date)) {
        console.warn('[Utils/isToday] Аргумент "date" должен быть датой', date);
        return 0;
    }

    return !calculateDaysBetweenDates(toDateObject(date), new Date());
}

export function getCloseDayNameByDate(date) {
    if (!isValidDate(date)) {
        console.warn('[Utils/getCloseDayNameByDate] Аргумент "date" должен быть датой', date);
        return '';
    }

    const d = toDateObject(date);
    const today = new Date();
    const totalDays = calculateDaysBetweenDates(d, today);

    if (Math.abs(totalDays) > 2) {
        return '';
    }

    switch (totalDays) {
    case -2:
        return 'позавчера';

    case -1:
        return 'вчера';

    case 0:
        return 'сегодня';

    case 1:
        return 'завтра';

    case 2:
        return 'послезавтра';

    default:
        return '';
    }
}

export function compareDate(a, b) {
    if (!isValidDate(a) || !isValidDate(b)) {
        console.warn('[Utils/compareDate] Аргумент "a" и "b" должны быть датами', a, b);
        return 0;
    }

    const dateTimeA = toDateObject(a).getTime();
    const dateTimeB = toDateObject(b).getTime();

    return dateTimeA > dateTimeB ? 1 : dateTimeA < dateTimeB ? -1 : 0;
}
