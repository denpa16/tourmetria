from django.utils import timezone
from slugify import slugify

from sletatru.converters import BaseConverter
from hotels.models import HotelCategory
from countries.models import Resort


class HotelDataConverter(BaseConverter):
    """
    Конвертер данных для создания отеля
    """

    UPDATE_FIELDS = (
        "beach_line",
        "is_in_bonus_program",
        "original_name",
        "popularity_level",
        "photos_count",
        "search_count",
        "rate",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """
        resort = self.get_resort(self.data["TownId"])
        category = self.get_category(self.data.get("StarId"))
        ref_id = self.data["Id"]
        name = self.data["Name"]
        slug = slugify(name)
        beach_line = self.data.get("BeachLineId", None)
        is_in_bonus_program = self.data.get("isInBonusProgram", False)
        original_name = self.data.get("OriginalName", None)
        popularity_level = self.data.get("PopularityLevel", None)
        photos_count = self.data.get("PhotosCount", None)
        search_count = self.data.get("SearchCount", None)
        rate = self.data.get("Rate", None)
        clean_data = {
            "resort": resort,
            "category": category,
            "ref_id": ref_id,
            "name": name,
            "slug": slug,
            "beach_line": beach_line,
            "is_in_bonus_program": is_in_bonus_program,
            "original_name": original_name,
            "popularity_level": popularity_level,
            "photos_count": photos_count,
            "search_count": search_count,
            "rate": rate,
            "update_date": timezone.now(),
        }
        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        resort = self._extra.get("resort")
        category = self.get_category(self.data.get("StarId"))
        ref_id = self.data["Id"]
        name = self.data["Name"]
        slug = slugify(name)
        beach_line = self.data.get("BeachLineId", None)
        is_in_bonus_program = self.data.get("isInBonusProgram", False)
        original_name = self.data.get("OriginalName", None)
        popularity_level = self.data.get("PopularityLevel", None)
        photos_count = self.data.get("PhotosCount", None)
        search_count = self.data.get("SearchCount", None)
        rate = self.data.get("Rate", None)
        clean_data = {
            "resort": resort,
            "category": category,
            "ref_id": ref_id,
            "name": name,
            "slug": slug,
            "beach_line": beach_line,
            "is_in_bonus_program": is_in_bonus_program,
            "original_name": original_name,
            "popularity_level": popularity_level,
            "photos_count": photos_count,
            "search_count": search_count,
            "rate": rate,
            "update_date": timezone.now(),
        }
        return clean_data

    @staticmethod
    def get_category(category_ref_id):
        """
        Категория отеля

        """
        try:
            category = HotelCategory.objects.get(ref_id=category_ref_id)
        except HotelCategory.DoesNotExist:
            category = None
        return category

    @staticmethod
    def get_resort(resort_ref_id):
        """
        Курорт

        """
        try:
            resort = Resort.objects.get(ref_id=resort_ref_id)
        except Resort.DoesNotExist:
            resort = None
        return resort
