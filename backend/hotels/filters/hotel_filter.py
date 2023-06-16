from common.filters import FacetFilterSet, CharInFilter
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
