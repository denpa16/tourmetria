from bg.loaders import BaseLoader
from hotels.models import Hotel


class HotelLoader(BaseLoader):
    """
    Загрузчик отелей
    """

    def load_data_from_crm(self):
        hotels_to_update = {}
        hotels_to_create = []
        hotel_ref_ids = set(Hotel.objects.values_list("ref_id", flat=True))
        hotels_data: dict = self.client.get_hotels()
        if len(hotels_data) != 0:
            for hotel_data in hotels_data:
                ref_id = str(hotel_data["key"])
                if ref_id in hotel_ref_ids:
                    hotels_to_update[ref_id] = self.converter(hotel_data, action="update")
                else:
                    converter_data = self.converter(hotel_data)
                    converted_status = self.check_fields(converter_data)
                    print(f"checked: {converted_status}")
                    if converted_status is True:
                        hotels_to_create.append(Hotel(**converter_data))

        self.bulk_create(hotels_to_create)
        self.bulk_update(hotels_to_update)

    @staticmethod
    def check_fields(data: dict) -> bool:
        """
        Проверка базовых полей на пустое значение

        """
        base_fields = ("country", "city")
        status = True
        for field in base_fields:
            if data[field] is None:
                status = False
                break
        return status
