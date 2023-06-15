from django_filters import Filter
from common.filters import FacetFilterSet, CharInFilter
from countries.models import DepartCity


class DepartCityFilter(FacetFilterSet):
    """
    Города вылета

    """

    name = CharInFilter(field_name="name")
    name.specs = "get_name_specs"
    name.aggregate_method = "name_aggregate"

    class Meta:
        model = DepartCity
        fields = ()

    @staticmethod
    def get_name_specs(queryset):
        queryset = queryset.values_list("name", "slug")
        specs = [{"label": name, "value": slug} for name, slug in queryset]
        return specs

    @staticmethod
    def name_aggregate(queryset):
        queryset = queryset.values("slug")
        facets = [depart_city["slug"] for depart_city in queryset]
        return facets
