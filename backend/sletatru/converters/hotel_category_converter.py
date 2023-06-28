from django.utils import timezone

from sletatru.converters import BaseConverter


class HotelCategoryDataConverter(BaseConverter):
    """
    Конвертер данных для создания категории отеля
    """

    UPDATE_FIELDS = (
        "name",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """
        ref_id = self.data["Id"]
        name = self.data["Name"]
        clean_data = {
            "ref_id": ref_id,
            "name": name,
            "update_date": timezone.now(),
        }
        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        ref_id = self.data["Id"]
        name = self.data["Name"]
        clean_data = {
            "ref_id": ref_id,
            "name": name,
            "update_date": timezone.now(),
        }
        return clean_data
