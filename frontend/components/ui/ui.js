import Vue from 'vue';

// Импорт компонентов
import VButton from '~/components/ui/buttons/VButton';
import VSquareButton from '~/components/ui/buttons/VSquareButton';
import VDropdown from '~/components/ui/dropdown/VDropdown';
import VInput from '~/components/ui/input/VInput';
import VInputThousands from '~/components/ui/input/VInputThousands';
import VInputSearch from '~/components/ui/input/VInputSearch';
import VScrollBox from '~/components/ui/scrollbox/VScrollBox';
import VSelect from '~/components/ui/select/VSelect';
import VGroupSelect from '~/components/ui/select/VGroupSelect';
import VCheckbox from '~/components/ui/checkbox/VCheckbox';
import VSlider from '~/components/ui/slider/VSlider';
import VSliderDot from '~/components/ui/slider/VSliderDot';
import VSliderDropdown from '~/components/ui/slider/VSliderDropdown';
import VTab from '~/components/ui/tabs/VTab';
import VTabs from '~/components/ui/tabs/VTabs';
import VTag from '~/components/ui/tag/VTag';
import VTooltip from '~/components/ui/tooltip/VTooltip';
import VSpinner from '~/components/ui/spinner/VSpinner';
import VSwitch from '~/components/ui/switch/VSwitch';
import VRange from '~/components/ui/range/VRange';
import VRangeDropdown from '~/components/ui/range/VRangeDropdown';
import VRangeSingle from '~/components/ui/range/VRangeSingle';

const components = [
    VButton,
    VSquareButton,
    VDropdown,
    VInput,
    VInputThousands,
    VInputSearch,
    VScrollBox,
    VSelect,
    VGroupSelect,
    VCheckbox,
    VSlider,
    VSliderDot,
    VSliderDropdown,
    VTab,
    VTabs,
    VTag,
    VTooltip,
    VSpinner,
    VTooltip,
    VSwitch,
    VRange,
    VRangeDropdown,
    VRangeSingle,
];

// Регистрация компонентов.
components.forEach(component => {
    if (component.name) {
        Vue.component(component.name, component);
    } else {
        console.warn('[UI] Register / No component name: ', component);
    }
});
