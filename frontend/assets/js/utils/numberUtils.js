export const leadingZero = num => num < 10 ? `0${num}` : num;

export function splitThousands(val) {
    if (isNaN(val)) {
        return val;
    }

    val = Math.floor(Number(val));
    const prefix = val < 0 ? '-' : '';

    return prefix + val
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function splitShort(num, separator = '.') {
    if (isNaN(num)) {
        return num;
    }

    num = Math.floor(Number(num));
    const prefix = num < 0 ? '-' : '';

    const result = prefix + num
        .toString().replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, `${separator}`);

    const res = result.split(`${separator}`);
    const first = res[0];
    const last = res[1] && Number(res[1].charAt(0)) !== 0 ? `${separator}${res[1].charAt(0)}` : '';
    return `${first}${last}`;
}

export const splitMillionsToShort = num => {
    if (isNaN(num)) {
        return num;
    }

    return `${Math.sign(num)*(Math.abs(num)/1000000).toFixed(1)}`;
};

export function roundToMillions(num, accuracy = 1) {
    if (num === undefined || num === null) {
        return '';
    }

    return (Number(num) / 1000000).toFixed(accuracy);
}

export function onlyNumbers(val) {
    return val
        .toString()
        .replace(/\D/g, '');
}

export function onlyLetters(val) {
    return val
        .toString()
        .replace(/[^a-zA-Z ]+/g, '');
}

export function changeSeparatorToComma(val) {
    if (!val) {
        return;
    }

    return val
        .toString()
        .replace(/\./g, ',');
}

export function changeSeparatorToDot(val) {
    return val
        .toString()
        .replace(/,/g, '.');
}

export function getPrice(num) {
    if (isNaN(num)) {
        return num;
    }

    let price;

    if (num >= 1) {
        price = num.toString()
            .replace(/\./g, ',');
    } else {
        price = Number(num) * 1000;
    }

    return price;
}

export function shortToFull(num) {
    if (isNaN(num)) {
        return num;
    }

    return splitThousands(Number(num) * 1000000);
}

export function prettyPhone(rawPhoneNumber) {
    return onlyNumbers(rawPhoneNumber).replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
}

export function prettyPhoneNumber(rawPhoneNumber) {
    return onlyNumbers(rawPhoneNumber).replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '8 $2 $3 $4 $5');
}

export function quaterToRoman(num) {
    if (!Number.isInteger(num)) {
        console.warn('[Utils/prettyQuarter] Аргумент "num" должен быть Number: ', num);
        return '';
    }

    switch (num) {
    case 1:
        return ' I';
    case 2:
        return ' II';
    case 3:
        return ' III';
    default:
        return 'IV';
    }
}

export function getQuarter(date = new Date()) {
    return Math.floor((date.getMonth() + 3) / 3);
}

export function isDeadlinePassed(year, quarter) {
    const yearNumber = Number.isInteger(year) ? year : parseInt(year, 10);
    const quarterNumber = Number.isInteger(quarter) ? quarter : parseInt(quarter, 10);

    if (!yearNumber) {
        console.warn('[Utils/isDeadlinePassed] Аргумент "year" обязательный: ', year);
        return false;
    }

    const currentYear = new Date().getFullYear();
    const currentQuarter = getQuarter();

    if (quarterNumber && yearNumber) {
        return currentYear > yearNumber || (currentYear === yearNumber && currentQuarter > quarterNumber);
    }

    return currentYear > yearNumber;
}

export function getFlatTitle(flat) {
    switch (flat) {
    case 0:
        return {
            full: 'Студия',
            fullNumber: 'Студия',
            short: 'Студия',
        };
    case 1:
        return {
            full: 'Однокомнатная',
            fullNumber: '1-комнатная',
            short: '1-комн',
        };
    case 2:
        return {
            full: 'Двухкомнатная',
            fullNumber: '2-комнатная',
            short: '2-комн',
        };
    case 3:
        return {
            full: 'Трехкомнатная',
            fullNumber: '3-комнатная',
            short: '3-комн',
        };
    case 4:
        return {
            full: 'Четырехкомнатная',
            fullNumber: '4-комнатная',
            short: '4-комн',
        };
    default: return {
        full: 'Четырехкомнатная',
        fullNumber: '4-комнатная',
        short: '4-комн',
    };
    }
}

export function replaceDotWithComma(val) {
    return val
        .toString()
        .replace(/\./g, ',');
}


// non-stable
export function getCorrectEnding(str, num) {
    const vowels = 'аяуюоеёэиы';
    const hising = 'жшщч';
    const none = 'ь';
    const hard = 'пбфвтдсзцкгхмнрл';

    const isNumComposite = num > 20;
    const lastStrChar = str[str.length - 1].toLowerCase();
    const isVowelEnding = vowels.includes(lastStrChar);
    const isHisingEnding = hising.includes(lastStrChar);
    const isNoneEnding = none.includes(lastStrChar);
    const isHardEnding = !isVowelEnding && !isHisingEnding && !isNoneEnding && hard.includes(lastStrChar);

    function addEnding(ending, sliceCount = 0) {
        return str.slice(0, str.length - sliceCount) + ending;
    }

    if (num === 1 || (isNumComposite && num % 10 === 1)) {
        return addEnding('');
    }

    if ((num > 1 && num < 5) || (isNumComposite && num % 10 > 1 && num % 10 < 5)) {
        if (isNoneEnding) {
            return addEnding('и', 1);
        }
        if (isVowelEnding) {
            if (isHisingEnding) {
                return addEnding('и');
            }
            return addEnding('ы', 1);
        }
        return addEnding('а');
    }

    if ((num >= 5 && !isNumComposite) || (isNumComposite && [0, 5, 6, 7, 8, 9].includes(num % 10))) {
        if (isVowelEnding) {
            return addEnding('', 1);
        }
        if (isHardEnding) {
            return addEnding('ов');
        }
        if (isNoneEnding) {
            return addEnding('ей', 1);
        }
        return addEnding('ей');
    }

    return addEnding('');
}
