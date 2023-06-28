from common.filters import FacetFilterSet, CharInFilter
from hotels.models import Meal


class MealFilter(FacetFilterSet):
    """
    Страна

    """

    class Meta:
        model = Meal
        fields = ()
