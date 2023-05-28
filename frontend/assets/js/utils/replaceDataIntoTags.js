const mods = {
    U: str => str.toUpperCase(),
    L: str => str.toLowerCase(),
    C: str => str.split(' ').map(s => s[0].toUpperCase() + s.slice(1))
        .join(' ')
};

const replaceDataIntoTags = (content = '', variables = null, options = {tags: ['{{', '}}'], mods}) => {
    const {tags, mods} = options;

    // Проверка переданных аргументов
    if (!content || !variables) {
        console.error('Function "replaceDataIntoTags": Arguments "content" and "variables" are required');
        return;
    } else if (typeof content !== 'string') {
        console.error('Function "replaceDataIntoTags": Argument "content" must be String');
        return;
    } else if (typeof variables !== 'object') {
        console.error('Function "replaceDataIntoTags": Argument "variables" must be Object');
        return;
    }

    // Экранируем скобки для регулярного выражения
    function turnOffSeparators(tag) {
        return tag.split('').map(str => `\\${str}`)
            .join('');
    }

    try {
        // Создаем регулярные выражения для поиска нужных переменных в контенте (со скобками и без)
        const regexWithTags = new RegExp(`(?:)(${turnOffSeparators(tags[0])}.*?${turnOffSeparators(tags[1])})(?=)`, 'gm');
        const regexWithoutTags = new RegExp(`[^${turnOffSeparators(tags[0])}].*[^${turnOffSeparators(tags[1])}]`, 'g');
        // Поиск и замена в тексте объектов внутри указанных скобок
        return content.replace(regexWithTags, matchWithTags => {
            let res = '';
            let key = matchWithTags.match(regexWithoutTags)[0].trim();
            let currentMods = null;
            if (key.includes('|')) {
                const substr = key.split('|');
                key = substr[0];
                currentMods = substr[1].split('');
            }
            // Если ключ имеет вложенные ключи, то ищем значение вглубь по объекту
            if (key.includes('.')) {
                res = key.split('.').reduce((res, subKey) => {
                    if (!res) {
                        return '';
                    }
                    if (res[subKey]) {
                        return res[subKey];
                    }
                    console.error(`Function "replaceDataIntoTags": "variables" doesn't contain ${key}`);
                    return '';
                }, variables);
            } else {
                res = variables[key];
            }
            // Применяем модификаторы
            if (currentMods && res) {
                currentMods.forEach(mod => {
                    res = mods[mod](res);
                });
            }
            return res || '';
        });
    } catch (e) {
        console.error(`[replaceDataIntoTags]: ${e}`);
    }
};

export default replaceDataIntoTags;
