from sletatru.loaders import BaseLoader
from sletatru.converters import HotelCategoryDataConverter
from countries.models import Country
from hotels.models import HotelCategory


class HotelCategoryLoader(BaseLoader):
    """
    Загрузчик курортов
    """

    def load_data_from_crm(self):
        """
        Создание/обновление категорий отелей
        """

        for country in Country.objects.all():
            hotelcategory_ref_ids = set(HotelCategory.objects.values_list("ref_id", flat=True))
            hotelcategories_to_update = {}
            hotelcategories_to_create = []
            hotelcategories_data = self.client.get_hotels_categories(country_ref_id=country.ref_id)
            if len(hotelcategories_data) != 0:
                for hotelcategory_data in hotelcategories_data:
                    ref_id = str(hotelcategory_data["Id"])
                    if ref_id in hotelcategory_ref_ids:
                        hotelcategories_to_update[ref_id] = dict(
                            country=country, **self.converter(hotelcategory_data, action="update")
                        )
                    else:
                        converter_data: HotelCategoryDataConverter = self.converter(
                            hotelcategory_data, country=country
                        )
                        hotelcategories_to_create.append(HotelCategory(**converter_data))

            self.bulk_create(hotelcategories_to_create)
            self.bulk_update(hotelcategories_to_update)
