<template>
    <VInput
        class="v-search"
        :value="searchStr"
        v-bind="$attrs"
        @input="onSearchInput"
    >
        <template v-if="isPrependIcon"
                  #prepend>
            <IconSearch />
        </template>
        <template v-else-if="isAppendIcon"
                  #append>
            <IconSearch />
        </template>
    </VInput>
</template>

<script type="text/babel">
    import {getValueByPath} from '~/assets/js/utils/commonUtils';
    import IconSearch from '~/components/icons/IconSearch';

    export default {
        name: 'VInputSearch',

        components: {IconSearch},

        props: {
            isPrependIcon: {
                type: Boolean,
                default: false
            },

            isAppendIcon: {
                type: Boolean,
                default: false
            },

            items: {
                type: Array,
                default: () => []
            },

            valuePath: {
                type: String,
                default: ''
            },

            nativeInput: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                searchStr: ''
            };
        },

        methods: {
            onSearchInput(value) {
                this.searchStr = value.toLowerCase();

                if (this.nativeInput) {
                    this.$emit('input', value);
                    return;
                }

                const filteredRes = this.items.filter(item => {
                    let label = this.valuePath ? getValueByPath(item, this.valuePath) : item;
                    if (typeof label !== 'string') {
                        label = String(label);
                    }
                    return label.toLowerCase().includes(value);
                });

                this.$emit('input', value, filteredRes);
            }
        },
    };
</script>
