/* eslint-disable no-mixed-operators */
const regex = {
    cyrillic: /^[а-я\s-]+$/i,
    latin: /^[a-z\s]+$/i,
    multilang: /^[а-яёa-z\s]+$/i,
    text: /^[а-яёa-z,\s]+$/i,
    date: /^\d{2}\/\d{2}\/\d{4}$/,
    time: /^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/,
    phone: /^\+7\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
    email: /^[a-z0-9./=?_-]{1,63}@[a-z0-9-]{1,63}\.[a-z]{2,6}$/i,
    snils: /^[0-9]{3}-[0-9]{3}-[0-9]{3}\s[0-9]{2}$/,
    payment: /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
    passport: /^[0-9]{4}\s[0-9]{6}$/,
    innCommercial: /^[0-9]{10}$/,
    inn: /^[0-9]{12}$/,
    ogrn: /^[0-9]{13}$/,
    password: /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/,
};

export function strValidate(val, param = '', required = false, minLength, maxLength, isDirty) {
    let reg = '';
    let msg = '';

    if (required) {
        const noSpaces = val.replace(/\s/g, '');
        if (val !== '' && !noSpaces.length || !val) {
            return 'Пожалуйста, заполните это поле';
        }
    }

    if (isDirty && minLength && val.length < minLength) {
        return `Должно быть не короче ${minLength} символов`;
    }

    if (maxLength && val.length > maxLength) {
        return 'Превышено кол-во символов';
    }

    if (param === '') {
        return '';
    } else if (param === 'letters') {
        if (val !== '') {
            reg = val.charAt(0)
                .match(regex.cyrillic)
                ? regex.cyrillic
                : regex.latin;
        }

        if (
            val !== '' &&
            !val.match(reg) &&
            val.match(regex.multilang)
        ) {
            msg = 'Пожалуйста, используйте только одну языковую раскладку';
        } else {
            msg = 'Пожалуйста, используйте только буквы';
        }
    } else if (param === 'cyrillic') {
        reg = regex.cyrillic;
        msg = 'Используйте только кириллицу';
    } else if (param === 'password') {
        reg = regex.password;
        msg = 'Используйте заглавные и строчные буквы, цифры';
    } else if (!regex[param]) {
        console.log('error validate-utils: regular expression is not found');
    } else {
        reg = regex[param];
        msg = 'Неверный формат';
    }
    return val !== '' && !val.match(reg) ? msg : '';
}

export function dateValidate(val, canFuture = true, canPast = true, required = false) {
    if (required) {
        const noSpaces = val.replace(/\s/g, '');
        if (val !== '' && !noSpaces.length || !val) {
            return 'Пожалуйста, заполните это поле';
        }
    }

    const curYear = new Date().getFullYear();
    const splitDate = val.split('/');

    if (val !== '' && !val.match(regex.date)) {
        return 'Неверный формат даты';
    } else if (splitDate[0] > 31) {
        return 'День не может быть больше 31';
    } else if (splitDate[1] > 12) {
        return 'Месяц не может быть больше 12';
    } else if (!canFuture && splitDate[2] > curYear) {
        return 'Год не может быть больше текущего';
    } else if (!canPast && splitDate[2] < 1900) {
        return 'Год не может быть меньше 1900х';
    } 
    return '';
}
