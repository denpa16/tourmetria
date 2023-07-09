from common.filters import FacetFilterSet, CharInFilter, NumberInFilter
from django_filters.rest_framework import RangeFilter, BooleanFilter, Filter
from hotels.models import Hotel


class HotelFilter(FacetFilterSet):
    """
    Отель

    """

    country = CharInFilter(field_name="resort__country__ref_id")
    country.specs = "get_country_specs"
    country.aggregate = "country_aggregate"
    resort = CharInFilter(field_name="resort__ref_id")
    resort.specs = "get_resort_specs"
    resort.aggregate = "resort_aggregate"
    rate = RangeFilter()
    popularity_level = NumberInFilter()
    popularity_level.specs = "get_popularity_level_specs"
    popularity_level.aggregate = "popularity_level_aggregate"
    is_in_bonus_program = BooleanFilter()
    category = CharInFilter(field_name="category__ref_id")
    category.specs = "get_category_specs"
    category.aggregate = "category_aggregate"

    class Meta:
        model = Hotel
        fields = ()

    @staticmethod
    def get_country_specs(queryset):
        queryset = (
            queryset.values_list("resort__country__name", "resort__country__ref_id")
            .order_by("resort__country__name", "resort__country__ref_id")
            .distinct("resort__country__name", "resort__country__ref_id")
        )
        specs = [
            {"label": country_name, "value": country_ref_id}
            for country_name, country_ref_id in queryset
        ]
        return specs

    @staticmethod
    def country_aggregate(queryset):
        return (
            queryset.values_list("resort__country__name", "resort__country__ref_id", flat=True)
            .order_by("resort__country__name", "resort__country__ref_id")
            .distinct("resort__country__name", "resort__country__ref_id")
        )

    @staticmethod
    def get_resort_specs(queryset):
        queryset = (
            queryset.values_list("resort__name", "resort__ref_id")
            .order_by("resort__name", "resort__ref_id")
            .distinct("resort__name", "resort__ref_id")
        )
        specs = [
            {"label": resort_name, "value": resort_ref_id}
            for resort_name, resort_ref_id in queryset
        ]
        return specs

    @staticmethod
    def resort_aggregate(queryset):
        return (
            queryset.values_list("resort__ref_id", flat=True)
            .order_by("resort__ref_id")
            .distinct("resort__ref_id")
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
            queryset.order_by("category__name", "category__ref_id")
            .distinct("category__name", "category__ref_id")
            .values_list("category__name", "category__ref_id")
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
            {"label": category_map.get(category_name, "Без звезд"), "value": category_ref_id}
            for category_name, category_ref_id in categories
        ]

    @staticmethod
    def category_aggregate(queryset):
        return (
            queryset.values_list("category__ref_id", flat=True)
            .order_by("category__ref_id")
            .distinct("category__ref_id")
        )
