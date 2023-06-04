from bg.loaders import BaseLoader
from cities.models import City


class CityLoader(BaseLoader):
    """
    Загрузчик городов
    """

    def load_data_from_crm(self):
        cities_to_update = {}
        cities_to_create = []
        city_ref_ids = set(City.objects.values_list("ref_id", flat=True))
        cities_data: dict = self.client.get_cities()
        if len(cities_data) != 0:
            for city_data in cities_data:
                ref_id = str(city_data["id"])
                if ref_id in city_ref_ids:
                    cities_to_update[ref_id] = self.converter(city_data, action="update")
                else:
                    converter_data = self.converter(city_data)
                    converted_status = self.check_fields(converter_data)
                    print(f"checked: {converted_status}")
                    if converted_status is True:
                        cities_to_create.append(City(**converter_data))

        self.bulk_create(cities_to_create)
        self.bulk_update(cities_to_update)

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
