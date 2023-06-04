from django.utils import timezone
from bg.converters import BaseConverter

from countries.models import Country
from cities.models import City


class HotelDataConverter(BaseConverter):
    """
    Конвертер данных для создания отеля
    """

    UPDATE_FIELDS = (
        "name",
        "country",
        "city",
        "stars",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """

        ref_id = self.data["key"]
        name = self.data["name"]
        city = self.get_city(self.data["cityKey"])
        country = self.get_country(self.data["countryKey"])
        stars = self.get_stars(self.data["stars"])

        clean_data = {
            "ref_id": ref_id,
            "name": name,
            "country": country,
            "city": city,
            "stars": stars,
            "update_date": timezone.now(),
        }

        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        name = self.data["name"]
        city = self.get_city(self.data["cityKey"])
        country = self.get_country(self.data["countryKey"])
        stars = self.get_stars(self.data["stars"])

        clean_data = {
            "name": name,
            "country": country,
            "city": city,
            "stars": stars,
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

    @staticmethod
    def get_city(city_id: str):
        """
        Получение города

        """
        try:
            city = City.objects.get(ref_id=city_id)
        except City.DoesNotExist:
            city = None
        return city

    @staticmethod
    def get_stars(stars_data: str):
        """
        Количество звезд

        """
        try:
            clean_stars = stars_data.replace("*", "")
            stars = int(clean_stars)
        except:
            stars = None
        return stars
