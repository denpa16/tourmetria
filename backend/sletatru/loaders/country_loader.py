from sletatru.loaders import BaseLoader
from countries.models import Country


class CountryLoader(BaseLoader):
    """
    Загрузчик стран
    """

    def load_data_from_crm(self):
        countries_to_update = {}
        countries_to_create = []
        country_ref_ids = set(Country.objects.values_list("ref_id", flat=True))
        countries_data: dict = self.client.get_countries()
        if len(countries_data) != 0:
            for country_data in countries_data:
                ref_id = str(country_data["Id"])
                if ref_id in country_ref_ids:
                    countries_to_update[ref_id] = self.converter(country_data, action="update")
                else:
                    countries_to_create.append(Country(**self.converter(country_data)))

        self.bulk_create(countries_to_create)
        self.bulk_update(countries_to_update)
