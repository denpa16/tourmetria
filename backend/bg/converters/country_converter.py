from django.utils import timezone
from bg.converters import BaseConverter


class CountryDataConverter(BaseConverter):
    """
    Конвертер данных для создания проекта
    """

    UPDATE_FIELDS = ("update_date",)

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """
        has_tours_map = {
            "Да": True,
            "Нет": False
        }

        ref_id = self.data["id"]
        title_ru = self.data["title_ru"]
        title_en = self.data["title_en"]
        code = self.data["code"]
        alpha = self.data["alpha3"]
        has_tours = has_tours_map.get(self.data.get("tours", False), False)
        currency = self.data["site_cur"]

        clean_data = {
            "ref_id": ref_id,
            "title_ru": title_ru,
            "title_en": title_en,
            "code": code,
            "alpha": alpha,
            "has_tours": has_tours,
            "currency": currency,
            "update_date": timezone.now(),
        }

        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """
        has_tours_map = {
            "Да": True,
            "Нет": False
        }

        ref_id = self.data["id"]
        title_ru = self.data["title_ru"]
        title_en = self.data["title_en"]
        code = self.data["code"]
        alpha = self.data["alpha3"]
        has_tours = has_tours_map.get(self.data.get("tours", False), False)
        currency = self.data["site_cur"]

        clean_data = {
            "ref_id": ref_id,
            "title_ru": title_ru,
            "title_en": title_en,
            "code": code,
            "alpha": alpha,
            "has_tours": has_tours,
            "currency": currency,
            "update_date": timezone.now(),
        }

        return clean_data
