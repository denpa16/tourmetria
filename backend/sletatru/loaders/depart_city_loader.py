from sletatru.loaders import BaseLoader
from sletatru.converters import DepartCityDataConverter
from countries.models import Country, DepartCity


class DepartCityLoader(BaseLoader):
    """
    Загрузчик города вылета
    """

    def load_data_from_crm(self):
        """
        Создание/обновление города вылета
        """

        for country in Country.objects.all():
            depart_city_ref_ids = set(DepartCity.objects.values_list("ref_id", flat=True))
            depart_cities_to_update = {}
            depart_cities_to_create = []
            depart_cities_data = self.client.get_country_depart_cities(
                country_ref_id=country.ref_id
            )
            if len(depart_cities_data) != 0:
                for depart_city_data in depart_cities_data:
                    ref_id = str(depart_city_data["Id"])
                    if ref_id in depart_city_ref_ids:
                        depart_cities_to_update[ref_id] = dict(
                            country=country, **self.converter(depart_city_data, action="update")
                        )
                    else:
                        converter_data: DepartCityDataConverter = self.converter(
                            depart_city_data, country=country
                        )
                        depart_cities_to_create.append(DepartCity(**converter_data))

            self.bulk_create(depart_cities_to_create)
            self.bulk_update(depart_cities_to_update)
