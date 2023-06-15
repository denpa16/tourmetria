from django_filters import Filter
from common.filters import FacetFilterSet, CharInFilter
from countries.models import Resort


class ResortFilter(FacetFilterSet):
    """
    Курорт

    """

    country = CharInFilter(field_name="country__slug")
    country.specs = "get_country_specs"
    country.aggregate = "country_aggregate"

    class Meta:
        model = Resort
        fields = ()

    @staticmethod
    def get_country_specs(queryset):
        queryset = (
            queryset.values_list("country__name", "country__slug")
            .order_by("country__name", "country__slug")
            .distinct("country__name", "country__slug")
        )
        specs = [
            {"label": country_name, "value": country_slug}
            for country_name, country_slug in queryset
        ]
        return specs

    @staticmethod
    def country_aggregate(queryset):
        return (
            queryset.values_list("country__name", "country__slug", flat=True)
            .order_by("country__name", "country__slug")
            .distinct("country__name", "country__slug")
        )
