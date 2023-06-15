from django_filters import Filter
from common.filters import FacetFilterSet, CharInFilter
from countries.models import Country


class CountryFilter(FacetFilterSet):
    """
    Страна

    """

    class Meta:
        model = Country
        fields = ()
