import Vue from 'vue';

// Text
import {plural,
    toSentenceCase} from 'assets/js/utils/textUtils';

Vue.filter('plural', plural);
Vue.filter('toSentenceCase', toSentenceCase);

// Common
import {
    bytesToSize,
    dateToString,
    cleanPhone,
} from 'assets/js/utils/commonUtils';

Vue.filter('bytesToSize', bytesToSize);
Vue.filter('dateToString', dateToString);
Vue.filter('cleanPhone', cleanPhone);

// Numbers
import {splitThousands,
    leadingZero,
    prettyPhone,
    roundToMillions,
    splitShort,
    prettyPhoneNumber,
    changeSeparatorToComma,
    changeSeparatorToDot,
    getPrice,
    shortToFull,
    quaterToRoman} from 'assets/js/utils/numberUtils';

Vue.filter('leadingZero', leadingZero);
Vue.filter('splitThousands', splitThousands);
Vue.filter('splitShort', splitShort);
Vue.filter('roundToMillions', roundToMillions);
Vue.filter('prettyPhone', prettyPhone);
Vue.filter('prettyPhoneNumber', prettyPhoneNumber);
Vue.filter('changeSeparatorToComma', changeSeparatorToComma);
Vue.filter('changeSeparatorToDot', changeSeparatorToDot);
Vue.filter('getPrice', getPrice);
Vue.filter('shortToFull', shortToFull);
Vue.filter('quaterToRoman', quaterToRoman);

// Date&Time
import {
    dayByIndex,
    formatDateTime,
    monthByIndex,
} from 'assets/js/utils/dateTimeUtils';

Vue.filter('dayByIndex', dayByIndex);
Vue.filter('monthByIndex', monthByIndex);
Vue.filter('formatDateTime', formatDateTime);
