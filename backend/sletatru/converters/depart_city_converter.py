from django.utils import timezone
from slugify import slugify

from sletatru.converters import BaseConverter

from countries.models import Country


class DepartCityDataConverter(BaseConverter):
    """
    Конвертер данных для создания города вылета
    """

    UPDATE_FIELDS = (
        "description_url",
        "is_popular",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """
        country = self.get_country(self.data["CountryId"])
        ref_id = self.data["Id"]
        name = self.data["Name"]
        slug = slugify(name)
        description_url = self.data["DescriptionUrl"]
        is_popular = self.data["IsPopular"]

        clean_data = {
            "country": country,
            "ref_id": ref_id,
            "name": name,
            "slug": slug,
            "description_url": description_url,
            "is_popular": is_popular,
            "update_date": timezone.now(),
        }
        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        description_url = self.data["DescriptionUrl"]
        is_popular = self.data["IsPopular"]

        clean_data = {
            "description_url": description_url,
            "is_popular": is_popular,
            "update_date": timezone.now(),
        }
        return clean_data

    @staticmethod
    def get_country(country_ref_id):
        """
        Получение страны

        """
        try:
            country = Country.objects.get(ref_id=country_ref_id)
        except Country.DoesNotExist:
            country = None
        return country
