<template>
    <div :class="[$style.VFile, classList]">
        <div
            :class="$style.wrapper"
            @drop.prevent="handleFileChange($event, true)"
            @dragover.prevent="() => {}"
        >
            <div :class="$style.container">
                <label
                    for="file"
                    :class="$style.label"
                >
                    <input
                        id="file"
                        ref="file"
                        type="file"
                        :class="$style.input"
                        :accept="acceptedTypes"
                        :multiple="maxFilesCount > 1"
                        @change="handleFileChange($event, false)"
                    >
                </label>

                <div
                    v-if="!files.length"
                    :class="$style.placeholder"
                    v-html="placeholder"
                >
                </div>

                <div
                    v-if="files.length"
                    :class="$style.list"
                >
                    <div
                        v-for="(file, index) in files"
                        :key="`file_${index}_${file.name}`"
                        :class="$style.item"
                    >
                        <div :class="$style.name">
                            {{ file.name }}
                        </div>

                        <div
                            :class="$style.delete"
                            @click.stop="handleDelete(index)"
                        >
                            <svg-icon name="close"></svg-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade-fast">
            <div
                v-if="error || serverError"
                :class="$style.error"
            >
                {{ error || serverError }}
            </div>
        </transition>
    </div>
</template>

<script>
import { plural } from '~/assets/js/utils/text-utils';

/**
 * Позволяет пользователю добавлять файлы для отправки
 *
 * @version 1.0.0
 * @displayName VFile
 */
export default {
    name: 'VFile',

    props: {
        /**
         * Определяет классы, которые будут модифицировать размер
         */
        size: {
            type: String,
            default: 'medium',
            validator: value => ['small', 'medium'].includes(value),
        },

        /**
         * Определяет классы, которые будут модифицировать цвет
         */
        color: {
            type: String,
            default: 'base',
            validator: val => ['base', 'dark'].includes(val),
        },

        /**
         * Текст, который отображается, если файл не выбран
         */
        placeholder: {
            type: String,
            default: 'Выберите файл',
        },

        /**
         * Определяет максимальное количество файлов
         */
        maxFilesCount: {
            type: Number,
            default: 1,
        },

        /**
         * Определяет максимальный размер файла
         */
        maxFileSize: {
            type: Number,
            default: 5e+6,
        },

        /**
         * Определяет выводимое сообщение о превышении макс. размера файла
         */
        maxSizeErrorText: {
            type: String,
            default: 'Размер прикреплённого файла не должен превышать',
        },

        /**
         * Определяет разрешенные типы файлов (если указать пустой массив, то разрешены все)
         */
        fileTypes: {
            type: Array,
            default: () => ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'application/x-rar-compressed'],
        },

        /**
         * Определяет текст ошибка о неверном типе файла
         */
        fileTypeError: {
            type: String,
            default: 'Принимаются только форматы изображений (png, jpeg, pdf, doc, docx, rar)',
        },

        /**
         * Определяет текст ошибки, которая может прилететь с сервера
         */
        serverError: {
            type: String,
            default: '',
        },

        /**
         * Модификатор вида с бордером
         */
        border: {
            type: Boolean,
            default: true,
        },

        /**
         * Это свойство отключает взаимодействие
         */
        disabled: Boolean,
    },

    data() {
        return {
            error: '',
            files: [],
        };
    },

    computed: {
        classList() {
            return {
                [this.$style[`_${this.color}`]]: this.size,
                [this.$style[`_${this.size}`]]: this.size,
                [this.$style._active]: this.files.length,
                [this.$style._disabled]: this.disabled,
                [this.$style._error]: this.error || this.serverError,
                [this.$style._border]: this.border,
            };
        },

        acceptedTypes() {
            return this.fileTypes?.length ? this.fileTypes.join(',') : undefined;
        },

        maxError() {
            return `Не более ${this.maxFilesCount} ${plural(this.maxFilesCount, ['файла', 'файлов', 'файлов'])}`;
        },
    },

    methods: {
        /**
         * Обрабатывает добавление файлов, через диалоги и drag & drop
         *
         * @param {Object} event Объект с файлами
         * @param {Boolean} dropped Был ли файл "брошен" или выбран
         * @public
         */
        handleFileChange(event, dropped) {
            const selectedFiles = !dropped ? event?.currentTarget?.files : event?.dataTransfer?.files;

            if (this.checkFiles(selectedFiles)) {
                this.files.push(...selectedFiles);
                this.error = '';

                /**
                 * Возвращает новое значение в родительский компонент.
                 * @event change
                 * @param {Array} files Массив файлов
                 */
                this.$emit('change', this.files);
            }
        },

        /**
         * Проверяет файлы на соответствие критериям (тип, количество, размер)
         * @param {Array} files Массив файлов
         * @public
         */
        checkFiles(files) {
            if (!files?.length) {
                return false;
            }

            if (this.maxFilesCount && files.length + this.files.length > this.maxFilesCount) {
                this.error = this.maxError;
                return false;
            }

            for (let i = 0; i < files.length; i++) {
                if (this.fileTypes?.length && !this.fileTypes.includes(files[i].type)) {
                    this.error = this.fileTypeError;
                    return false;
                }

                if (files[i].size > this.maxFileSize) {
                    this.error = this.maxSizeErrorText + ' ' + this.maxFileSize;
                    return false;
                }
            }

            return true;
        },

        /**
         * Удаляет файл
         * @param {Number} index индекс файла
         * @public
         */
        handleDelete(index) {
            this.files.splice(index, 1);
            this.error = '';
            this.$refs.file.value = null;
            /**
             * Возвращает новое значение в родительский компонент.
             * @event change
             * @param {Array} files Массив файлов
             */
            this.$emit('change', this.files);
        },
    },
};
</script>


<style lang="scss" module>
    /* Colors */
    $alert-color: $error;
    $grey-color: $grey;

    // base
    $base-color: $violet;
    $base-black: $base-600;
    $base-white: #fff;

    .VFile {
        width: 100%;
        transition: opacity $default-transition;

        /* Sizes */

        &._small {
            .container {
                padding: .8rem 0;
                border-radius: .4rem;

                &:before,
                &:after {
                    bottom: -.1rem;
                    height: .1rem;
                    border-radius: .6rem;
                }
            }

            .placeholder,
            .name {
                font-size: 1.2rem;
                line-height: 1;
            }

            .item {
                &:not(:last-child) {
                    margin-bottom: .8rem;
                }
            }

            .delete {
                width: 1.2rem;
                height: 1.2rem;
                margin-left: .8rem;

                & > svg {
                    width: 1.2rem;
                    height: 1.2rem;
                }
            }

            .error {
                margin-top: .8rem;
                font-size: 1.2rem;
            }
        }

        &._medium {
            .container {
                padding: 1.2rem 0;
                border-radius: .4rem;

                &:before,
                &:after {
                    bottom: -.2rem;
                    height: .2rem;
                    border-radius: .6rem;
                }
            }

            .placeholder,
            .name {
                font-size: 1.6rem;
                line-height: 1;
            }

            .item {
                &:not(:last-child) {
                    margin-bottom: 1.2rem;
                }
            }

            .delete {
                width: 1.6rem;
                height: 1.6rem;
                margin-left: .8rem;

                & > svg {
                    width: 1.6rem;
                    height: 1.6rem;
                }
            }

            .error {
                margin-top: .8rem;
                font-size: 1.2rem;
            }
        }

        /* Colors */
        &._base {
            .container {
                background-color: $base-white;

                @include hover {
                    &:hover {
                        border-color: $base-color;
                    }
                }
            }

            .placeholder {
                color: $grey-color;
            }

            .name {
                color: $base-black;
            }

            .delete {
                @include hover {
                    &:hover {
                        color: $base-color;
                    }
                }
            }
        }

        &._dark {
            .container {
                background-color: transparent;

                @include hover {
                    &:hover {
                        border-color: $base-color;
                    }
                }
            }

            .placeholder {
                color: $base-white;
                opacity: .7;
            }

            .name {
                color: $base-white;
            }

            .delete {
                color: $base-white;

                @include hover {
                    &:hover {
                        color: $base-color;
                    }
                }
            }
        }

        /* Mods */
        &._border {
            .container {
                &:before,
                &:after {
                    content: "";
                    position: absolute;
                    left: 0;
                    width: 100%;
                }

                &:before {
                    z-index: 1;
                    background-color: $base-color;
                }

                &:after {
                    z-index: 2;
                    background-color: $base-color;
                    transform: scaleX(0);
                    transform-origin: left center;
                    transition: all $default-transition;
                }
            }
        }

        &._error {
            .container:after {
                background-color: $alert-color;
                transform: scaleX(1);
            }
        }

        &._disabled {
            opacity: .5;
            pointer-events: none;
        }

        /* Когда файл выбран */
        &._active {
            //
        }
    }

    .wrapper {
        position: relative;
        width: 100%;
    }

    .container {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        user-select: none;
    }

    .label {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .input {
        display: none;
    }

    .list {
        width: 100%;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .delete {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color $default-transition;
        cursor: pointer;
    }

    .error {
        color: $alert-color;
    }
</style>
