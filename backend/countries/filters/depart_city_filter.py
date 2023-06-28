from django_filters import Filter
from common.filters import FacetFilterSet, CharInFilter
from countries.models import DepartCity


class DepartCityFilter(FacetFilterSet):
    """
    Города вылета

    """

    country = CharInFilter(field_name="country__ref_id")
    country.specs = "get_country_specs"
    country.aggregate = "country_aggregate"

    class Meta:
        model = DepartCity
        fields = ()

    @staticmethod
    def get_country_specs(queryset):
        queryset = (
            queryset.values_list("country__name", "country__ref_id")
            .order_by("country__name", "country__ref_id")
            .distinct("country__name", "country__ref_id")
        )
        specs = [
            {"label": country_name, "value": country_ref_id}
            for country_name, country_ref_id in queryset
        ]
        return specs

    @staticmethod
    def country_aggregate(queryset):
        return (
            queryset.values_list("country__ref_id", flat=True)
            .order_by("country__ref_id")
            .distinct("country__ref_id")
        )
