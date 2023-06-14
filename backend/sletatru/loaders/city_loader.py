from sletatru.loaders import BaseLoader
from sletatru.converters import CityDataConverter
from countries.models import Country, City


class CityLoader(BaseLoader):
    """
    Загрузчик города
    """

    def load_data_from_crm(self):
        """
        Создание/обновление городов
        """

        for country in Country.objects.all():
            city_ref_ids = set(City.objects.values_list("ref_id", flat=True))
            city_to_update = {}
            city_to_create = []
            cities_data = self.client.get_country_cities(country_ref_id=country.ref_id)
            if len(cities_data) != 0:
                for city_data in cities_data:
                    ref_id = str(city_data["Id"])
                    if ref_id in city_ref_ids:
                        city_to_update[ref_id] = dict(
                            country=country, **self.converter(city_data, action="update")
                        )
                    else:
                        converter_data: CityDataConverter = self.converter(
                            city_data, country=country
                        )
                        city_to_create.append(City(**converter_data))

            self.bulk_create(city_to_create)
            self.bulk_update(city_to_update)
