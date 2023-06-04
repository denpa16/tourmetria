from django.utils import timezone
from bg.converters import BaseConverter

from countries.models import Country


class CityDataConverter(BaseConverter):
    """
    Конвертер данных для создания города
    """

    UPDATE_FIELDS = (
        "title_ru",
        "title_en",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """

        ref_id = self.data["id"]
        title_ru = self.data["title_ru"]
        title_en = self.data["title_en"]
        country = self.get_country(self.data["country"])

        clean_data = {
            "ref_id": ref_id,
            "title_ru": title_ru,
            "title_en": title_en,
            "country": country,
            "update_date": timezone.now(),
        }

        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        ref_id = self.data["id"]
        title_ru = self.data["title_ru"]
        title_en = self.data["title_en"]
        country = self.get_country(self.data["country"])

        clean_data = {
            "ref_id": ref_id,
            "title_ru": title_ru,
            "title_en": title_en,
            "country": country,
            "update_date": timezone.now(),
        }

        return clean_data

    @staticmethod
    def get_country(country_id: str):
        """
        Получение страны

        """
        try:
            country = Country.objects.get(ref_id=country_id)
        except Country.DoesNotExist:
            country = None
        return country
