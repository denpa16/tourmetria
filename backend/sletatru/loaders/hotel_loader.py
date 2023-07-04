from slugify import slugify
from django.utils import timezone
from sletatru.loaders import BaseLoader
from sletatru.converters import HotelDataConverter, HotelDetailDataConverter
from sletatru.utils import func_chunks_generators
from countries.models import Resort
from hotels.models import Hotel, HotelRestType


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
        all_hotels_ref_ids = list(Hotel.objects.order_by("-rate").values_list("ref_id", flat=True))
        hotel_count_in_pack = 100
        hotels_ref_ids_packs = func_chunks_generators(all_hotels_ref_ids, hotel_count_in_pack)
        for hotels_ref_ids_pack in hotels_ref_ids_packs:
            hotels_to_update = dict()
            for ref_id in hotels_ref_ids_pack:
                hotel_data = self.client.get_hotel_detail(ref_id=ref_id)
                hotels_to_update[ref_id] = dict(**self.converter(hotel_data, action="update"))
            self.bulk_update(hotels_to_update)


class HotelRelatedDataLoader(BaseLoader):
    """
    Загрузчик связанных атрибутов отелей

    """

    def load_data_from_crm(self):
        """
        Создание/обновление типа
        """
        all_hotels_ref_ids = list(Hotel.objects.order_by("-rate").values_list("ref_id", flat=True))
        hotel_count_in_pack = 100
        hotels_ref_ids_packs = func_chunks_generators(all_hotels_ref_ids[:10], hotel_count_in_pack)
        for hotels_ref_ids_pack in hotels_ref_ids_packs:
            hotels_info = dict()
            for ref_id in hotels_ref_ids_pack:
                hotel_data = self.client.get_hotel_detail(ref_id=ref_id)
                rests_info = list()
                for i in hotel_data["HotelDetailedTypes"]:
                    rest_type, created = HotelRestType.objects.get_or_create(
                        ref_id=i["Id"], name=i["Name"], slug=slugify(i["Name"])
                    )
                    rests_info.append(rest_type)
                hotels_info[ref_id] = rests_info
            update_instances = Hotel.objects.filter(ref_id__in=hotels_info)
            for instance in update_instances:
                instance.update_date = timezone.now()
                instance.save()
                instance.rest_types.clear()
                instance.rest_types.set(hotels_info[instance.ref_id])
