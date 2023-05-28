import mainPageApi from '~/config/api/mainPage';
import projectsApi from '~/config/api/projects';
import messengers from '~/config/api/messengers';
import socials from '~/config/api/socials';
import infrasCategories from '~/config/api/infrasCategories';
import infras from '~/config/api/infras';
import publications from '~/config/api/publications';
import flats from '~/config/api/flats';
import regionsApi from '~/config/api/regions';
import citiesApi from '~/config/api/cities';
import progress from '~/config/api/progress';
import purchasesApi from '~/config/api/purchases';
import flatProjectFeatures from '~/config/api/flatProjectFeatures';
import mortgage from '~/config/api/mortgage';
import documents from '~/config/api/documents';
import documentCategory from '~/config/api/documentCategory';
import offices from '~/config/api/offices';
import buildings from '~/config/api/buildings';
import sections from '~/config/api/sections';
import floors from '~/config/api/floors';
import phases from '~/config/api/phases';
import companyPage from '~/config/api/companyPage';
import requestApi from '~/config/api/request';
import otpApi from '~/config/api/otp';
import layouts from '~/config/api/layouts';
import finishes from '~/config/api/finishes';
import parking from '~/config/api/parking';
import storage from '~/config/api/storage';
import commercials from '~/config/api/commercials';
import hotelrooms from '~/config/api/hotelrooms';
import booking from '~/config/api/booking';
import headerPromo from '~/config/api/headerPromo';
import projectsHeaderFooter from '~/config/api/projectsHeaderFooter';
import projectAdvantages from '~/config/api/projectAdvantages';

const apiConfig = {
    ...mainPageApi,
    ...projectsApi,
    ...messengers,
    ...socials,
    ...infrasCategories,
    ...infras,
    ...publications,
    ...flats,
    ...regionsApi,
    ...citiesApi,
    ...progress,
    ...purchasesApi,
    ...flatProjectFeatures,
    ...mortgage,
    ...documents,
    ...documentCategory,
    ...offices,
    ...buildings,
    ...sections,
    ...floors,
    ...phases,
    ...companyPage,
    ...requestApi,
    ...otpApi,
    ...layouts,
    ...finishes,
    ...parking,
    ...storage,
    ...commercials,
    ...hotelrooms,
    ...booking,
    ...headerPromo,
    ...projectsHeaderFooter,
    ...projectAdvantages,
};

export default apiConfig;
