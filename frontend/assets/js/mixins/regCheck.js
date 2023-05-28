export const regCheck = {
    data() {
        return {
            regex: {
                rus: /^[а-я\s-]+$/i,
                eng: /^[a-z\s-]+$/i,
                cyrillic: /^[а-яё\s-]+$/i,
                multyLang: /^[а-яёa-z\s-]+$/i,
                date: /^\d{2}\/\d{2}\/\d{4}$/,
                phone: /^\+7\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
                email: /^[a-z0-9./=?_-]+@[a-z0-9]+\.[a-z0-9]+/i,
                snils: /^[0-9]{3}-[0-9]{3}-[0-9]{3}\s[0-9]{2}$/,
                passport: /^[0-9]{4}\s[0-9]{6}$/,
                passportSeries: /^[0-9]{4}/,
                passportNumber: /^[0-9]{6}/,
                innCommercial: /^[0-9]{10}$/,
                inn: /^[0-9]{12}$/,
                lettersNum: /^[а-яa-z\s\d]+$/i,
            },
        };
    },

    methods: {
        regCheck(val, param, required = false, length = false, limit) {
            let reg = '';
            let msg = '';

            if (required) {
                const noSpaces = val.replace(/\s/g, '');
                if ((val !== '' && !noSpaces.length) || !val) {
                    return 'Пожалуйста, заполните это поле';
                }
            }

            if (length) {
                if (val.length > limit) {
                    return 'Превышено кол-во символов';
                }
            }

            if (param) {
                if (param === 'letters') {
                    if (val !== '') {
                        reg = val.charAt(0).match(this.regex.rus)
                            ? this.regex.rus
                            : this.regex.eng;
                    }
                    if (
                        val !== '' &&
                        !val.match(reg) &&
                        val.match(this.regex.multyLang)
                    ) {
                        msg =
                            'Пожалуйста, используйте только одну языковую раскладку';
                    } else {
                        msg = 'Пожалуйста, используйте только буквы';
                    }
                } else if (param === 'cyrillic') {
                    reg = this.regex.cyrillic;
                    msg = 'Используйте только кириллицу';
                } else if (!this.regex[param]) {
                    console.log('error regCheck: regular expression is not found');
                } else {
                    reg = this.regex[param];
                    msg = 'Неверный формат';
                }
            }

            return val !== '' && !val.match(reg) ? msg : '';
        },

        dateCheck(val, canFuture = false, canPast = true, required = false) {
            if (required) {
                const noSpaces = val.replace(/\s/g, '');
                if ((val !== '' && !noSpaces.length) || !val) {
                    return 'Пожалуйста, заполните это поле';
                }
            }

            const curYear = new Date().getFullYear();
            const splitDate = val.split('/');

            if (val !== '' && !val.match(this.regex.date)) {
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
        },

        yearCheck(val, required = false) {
            if (required) {
                const noSpaces = val.replace(/\s/g, '');
                if ((val !== '' && !noSpaces.length) || !val) {
                    return 'Пожалуйста, заполните это поле';
                }
            }

            const curYear = new Date().getFullYear();

            if (val > curYear) {
                return 'Год не может быть больше текущего';
            } else if (val < 1900) {
                return 'Год не может быть меньше 1900х';
            }
            return '';
        },

        lengthCheck(val, limit) {
            if (val.length > limit) {
                return 'Превышено кол-во символов';
            }
        },
    },
};
