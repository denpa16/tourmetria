from sletatru.loaders import BaseLoader
from sletatru.converters import ResortDataConverter
from countries.models import Country, Resort


class ResortLoader(BaseLoader):
    """
    Загрузчик курортов
    """

    def load_data_from_crm(self):
        """
        Создание/обновление курортов
        """

        for country in Country.objects.all():
            resort_ref_ids = set(Resort.objects.values_list("ref_id", flat=True))
            resorts_to_update = {}
            resorts_to_create = []
            resorts_data = self.client.get_country_resorts(country_ref_id=country.ref_id)
            if len(resorts_data) != 0:
                for resort_data in resorts_data:
                    ref_id = str(resort_data["Id"])
                    if ref_id in resort_ref_ids:
                        resorts_to_update[ref_id] = dict(
                            country=country, **self.converter(resort_data, action="update")
                        )
                    else:
                        converter_data: ResortDataConverter = self.converter(
                            resort_data, country=country
                        )
                        resorts_to_create.append(Resort(**converter_data))

            self.bulk_create(resorts_to_create)
            self.bulk_update(resorts_to_update)
