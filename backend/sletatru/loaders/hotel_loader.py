from sletatru.loaders import BaseLoader
from sletatru.converters import HotelDataConverter, HotelDetailDataConverter
from sletatru.utils import func_chunks_generators
from countries.models import Resort
from hotels.models import Hotel


class HotelLoader(BaseLoader):
    """
    Загрузчик отелей
    """

    def load_data_from_crm(self):
        """
        Создание/обновление отелей
        """

        for resort in Resort.objects.all():
            hotel_ref_ids = set(Hotel.objects.values_list("ref_id", flat=True))
            hotels_to_update = {}
            hotels_to_create = []
            hotels_data = self.client.get_resort_hotels(resort_ref_id=resort.ref_id)
            if len(hotels_data) != 0:
                for hotel_data in hotels_data:
                    ref_id = str(hotel_data["Id"])
                    if ref_id in hotel_ref_ids:
                        hotels_to_update[ref_id] = dict(
                            **self.converter(hotel_data, action="update")
                        )
                    else:
                        converter_data: HotelDataConverter = self.converter(
                            hotel_data, resort=resort
                        )
                        converted_status = self.check_fields(converter_data)
                        if converted_status is True:
                            hotels_to_create.append(Hotel(**converter_data))

            self.bulk_create(hotels_to_create)
            self.bulk_update(hotels_to_update)

    @staticmethod
    def check_fields(data: dict) -> bool:
        """
        Проверка базовых полей на пустое значение

        """
        base_fields = (
            "resort",
            "category",
        )
        status = True
        for field in base_fields:
            if data[field] is None:
                status = False
                break
        return status


class HotelDetailLoader(BaseLoader):
    """
    Загрузчик детальной информации отелей
    """

    def load_data_from_crm(self):
        """
        Создание/обновление детальной информации отелей
        """
        all_hotels_ref_ids = list(Hotel.objects.values_list("ref_id", flat=True))
        hotel_count_in_pack = 100
        hotels_ref_ids_packs = func_chunks_generators(all_hotels_ref_ids[:10], hotel_count_in_pack)
        for hotels_ref_ids_pack in hotels_ref_ids_packs:
            hotels_to_update = {}
            for ref_id in hotels_ref_ids_pack:
                hotel_data = self.client.get_hotel_detail(ref_id=ref_id)
                hotels_to_update[ref_id] = dict(**self.converter(hotel_data, action="update"))
                print(dict(**self.converter(hotel_data, action="update")))
            # self.bulk_update(hotels_to_update)
