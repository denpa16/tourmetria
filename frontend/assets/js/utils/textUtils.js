export function plural(num, postfixes) {
    if (!num && isNaN(num)) {
        return '';
    }

    const cases = [2, 0, 1, 1, 1, 2];
    return postfixes[num % 100 > 4 && num % 100 < 20 ? 2 : cases[Math.min(num % 10, 5)]];
}

export function toSentenceCase(text) {
    if (typeof text !== 'string') {
        console.warn('[Utils/toSentenceCase] Аргумент "text" должен быть строкой', text);
        return text;
    }

    if (!text) {
        return '';
    }

    return text[0].toUpperCase() + text.slice(1);
}

export function toShortName(names, initialsWhitespace, fields = {}) {
    const lastName = toSentenceCase(names[fields.lastName]);
    const firstName = names[fields.name] ? ` ${names[fields.name][0].toUpperCase()}.` : '';
    const patronymic = names[fields.patronymic] ? `${initialsWhitespace ? ' ' : ''}${names[fields.patronymic][0].toUpperCase()}.` : '';

    return lastName + firstName + patronymic;
}

export function toShortNameByString(fullName, initialsWhitespace = false) {
    if (typeof fullName !== 'string') {
        console.warn('[Utils/toShortNameByString] Аргумент "fullName" должен быть строкой', fullName);
        return fullName;
    }

    const names = fullName.split(' ');
    return toShortName(names, initialsWhitespace, {lastName: 0, name: 1, patronymic: 2});
}

export function toShortNameByObject(
    user,
    initialsWhitespace = false,
    fields = {
        lastName: 'last_name',
        name: 'first_name',
        patronymic: 'patronymic',
    },
) {
    if (user && typeof user !== 'object') {
        console.warn('[Utils/toShortNameByObject] Аргумент "user" должен быть объектом', user);
        return '';
    }

    return toShortName(user, initialsWhitespace, fields);
}

export function clearDoubleSpaces(str) {
    if (typeof str !== 'string') {
        console.warn('[Utils/clearDoubleSpaces] argument must be string');
        return;
    }

    return str.replace(/  +/g, ' ').trim();
}
