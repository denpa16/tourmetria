const tokens = {
    '#': {pattern: /\d/},
    S: {pattern: /[a-zA-Z]/},
    A: {pattern: /[0-9a-zA-Z]/},
    U: {pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase()},
    L: {pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase()},
};

export const numberInputs = [
    'phone',
    'date',
    'time',
    'number',
    'snils',
    'inn',
    'passport',
    'payment',
    'code',
    'percent',
    'year',
    'month',
];

export const masks = {
    phone: '+7 (###) ###-##-##',
    date: '##/##/####',
    datedot: '##.##.####',
    time: '##:##',
    number: '##########',
    snils: '###-###-### ##',
    inn: '############',
    passport: '#### ######',
    payment: '#### #### #### ####',
    percent: '####',
    year: '####',
    pin: '####',
    months: '####',
};

export function addMask(value, mask, keepMasked = true) {
    let iMask = 0;
    let iValue = 0;
    let output = '';
    while (iMask < mask.length && iValue < value.length) {
        let cMask = mask[iMask];
        const masker = tokens[cMask];
        const cValue = value[iValue];
        if (masker) {
            if (masker.pattern.test(cValue)) {
                output += masker.transform ? masker.transform(cValue) : cValue;
                iMask++;
            }
            iValue++;
        } else {
            if (masker) {
                iMask++;
                cMask = mask[iMask];
            }
            if (keepMasked) {
                output += cMask;
            }
            if (cValue === cMask) {
                iValue++;
            }
            iMask++;
        }
    }

    return output;
}

export function getNextCursorPosition(prevPos, oldValue, newValue, delimiter, delimiters) {
    // If cursor was at the end of value, just place it back.
    // Because new value could contain additional chars.
    return oldValue.length === prevPos
        ? newValue.length
        : prevPos + getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters);
}

function getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters) {
    const oldRawValue = stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
    const newRawValue = stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
    const lengthOffset = oldRawValue.length - newRawValue.length;

    return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
}

function stripDelimiters(value, delimiter) {
    // single delimiter
    // if (delimiters.length === 0) {
    const delimiterRE = delimiter
        ? new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g')
        : '';

    return value.replace(delimiterRE, '');
    // }

    // multiple delimiters Добавить третим аргументов delimeters
    // delimiters.forEach(function (current) {
    //     current.split('').forEach(function (letter) {
    //         value = value.replace(owner.getDelimiterREByDelimiter(letter), '');
    //     });
    // });
    // return value;
}

export function setSelection(element, position) {
    if (element === document.activeElement) {
        if (element && element.value.length <= position) {
            return;
        }

        if (element.createTextRange) {
            const range = element.createTextRange();
            range.move('character', position);
            range.select();
        } else {
            try {
                element.setSelectionRange(position, position);
            } catch (e) {
                console.warn('The input element type does not support selection');
            }
        }
    }
}

export function setCursor(el, position) {
    if (el === document.activeElement) {
        el.setSelectionRange(position, position);
        setTimeout(() => {
            el.setSelectionRange(position, position);
        }, 0);
    }
}

// export function getRawNumber(value) {
//     return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
// }
