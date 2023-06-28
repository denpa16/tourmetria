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
        depart_city_ref_ids = set(DepartCity.objects.values_list("ref_id", flat=True))
        depart_cities_to_update = {}
        depart_cities_to_create = []
        depart_cities_data = self.client.get_country_depart_cities()
        if len(depart_cities_data) != 0:
            for depart_city_data in depart_cities_data:
                ref_id = str(depart_city_data["Id"])
                if ref_id in depart_city_ref_ids:
                    depart_cities_to_update[ref_id] = dict(
                        **self.converter(depart_city_data, action="update")
                    )
                else:
                    converter_data: DepartCityDataConverter = self.converter(
                        depart_city_data,
                    )
                    converted_status = self.check_fields(converter_data)
                    if converted_status is True:
                        depart_cities_to_create.append(DepartCity(**converter_data))

        self.bulk_create(depart_cities_to_create)
        self.bulk_update(depart_cities_to_update)

    @staticmethod
    def check_fields(data: dict) -> bool:
        """
        Проверка базовых полей на пустое значение

        """
        base_fields = ("country",)
        status = True
        for field in base_fields:
            if data[field] is None:
                status = False
                break
        return status
