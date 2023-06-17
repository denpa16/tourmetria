from common.filters import FacetFilterSet, CharInFilter, NumberInFilter
from django_filters.rest_framework import RangeFilter, BooleanFilter, Filter
from hotels.models import Hotel


class HotelFilter(FacetFilterSet):
    """
    Отель

    """

    country = CharInFilter(field_name="resort__country__slug")
    country.specs = "get_country_specs"
    country.aggregate = "country_aggregate"
    resort = CharInFilter(field_name="resort__slug")
    resort.specs = "get_resort_specs"
    resort.aggregate = "resort_aggregate"
    rate = RangeFilter()
    popularity_level = NumberInFilter()
    popularity_level.specs = "get_popularity_level_specs"
    popularity_level.aggregate = "popularity_level_aggregate"
    is_in_bonus_program = BooleanFilter()
    category = CharInFilter(field_name="category__name")
    category.specs = "get_category_specs"
    category.aggregate = "category_aggregate"

    class Meta:
        model = Hotel
        fields = ()

    @staticmethod
    def get_country_specs(queryset):
        queryset = (
            queryset.values_list("resort__country__name", "resort__country__slug")
            .order_by("resort__country__name", "resort__country__slug")
            .distinct("resort__country__name", "resort__country__slug")
        )
        specs = [
            {"label": country_name, "value": country_slug}
            for country_name, country_slug in queryset
        ]
        return specs

    @staticmethod
    def country_aggregate(queryset):
        return (
            queryset.values_list("resort__country__name", "resort__country__slug", flat=True)
            .order_by("resort__country__name", "resort__country__slug")
            .distinct("resort__country__name", "resort__country__slug")
        )

    @staticmethod
    def get_resort_specs(queryset):
        queryset = (
            queryset.values_list("resort__name", "resort__slug")
            .order_by("resort__name", "resort__slug")
            .distinct("resort__name", "resort__slug")
        )
        specs = [
            {"label": resort_name, "value": resort_slug} for resort_name, resort_slug in queryset
        ]
        return specs

    @staticmethod
    def resort_aggregate(queryset):
        return (
            queryset.values_list("resort__name", "resort__slug", flat=True)
            .order_by("resort__name", "resort__slug")
            .distinct("resort__name", "resort__slug")
        )

    @staticmethod
    def get_popularity_level_specs(queryset):
        levels = (
            queryset.order_by("popularity_level")
            .distinct("popularity_level")
            .values_list("popularity_level", flat=True)
        )
        popularity_level_map = {
            0: "Низкая популярность",
            1: "Средняя популярность",
            2: "Высокая популярность",
        }
        return [
            {"value": level, "label": popularity_level_map.get(level, "Средняя популярность")}
            for level in levels
        ]

    @staticmethod
    def popularity_level_aggregate(queryset):
        return (
            queryset.values_list("popularity_level", flat=True)
            .order_by("popularity_level")
            .distinct("popularity_level")
        )

    @staticmethod
    def get_category_specs(queryset):
        categories = (
            queryset.order_by("category__name")
            .distinct("category__name")
            .values_list("category__name", flat=True)
        )
        category_map = {
            "HV-2": "Клубный отель 4-5 звезд",
            "HV-1": "Клубный отель 3-4 звезд",
            "5*": "5 звезд",
            "Без звезд": "Без звезд",
            "Villas": "Вилла",
            "Apts": "Апартаменты",
            "4*": "4 звезды",
            "3*": "3 звезды",
            "2*": "2 звезды",
            "1*": "1 звезда",
        }
        return [
            {"value": category, "label": category_map.get(category, "Без звезд")}
            for category in categories
        ]

    @staticmethod
    def category_aggregate(queryset):
        return (
            queryset.values_list("category__name", flat=True)
            .order_by("category__name")
            .distinct("category__name")
        )
