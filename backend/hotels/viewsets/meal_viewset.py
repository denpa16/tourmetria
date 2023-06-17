from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet
from common.viewset_mixins import SpecsFacetsMixin
from hotels.filters import MealFilter
from hotels.models import Meal
from hotels.serializers import MealListSerializer


@extend_schema(tags=["Meal"])
class MealViewSet(SpecsFacetsMixin, ReadOnlyModelViewSet):
    """
    Питание

    """

    lookup_field = "ref_id"
    lookup_url_kwargs = "ref_id"

    queryset = Meal.objects.all()
    serializer_class = MealListSerializer
    filterset_class = MealFilter

    @action(detail=False, methods=("GET",))
    def specs(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        meal_specs = {
            "name": "meals",
            "choices": [
                {"label": name, "value": ref_id}
                for name, ref_id in filter.qs.values_list("name", "ref_id")
            ],
        }
        specs = filter.specs()
        specs.append(meal_specs)
        return Response(specs)

    @action(detail=False, methods=("GET",))
    def facets(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        meal_facets = [meal["ref_id"] for meal in filter.qs.values("ref_id")]
        facets = filter.facets()
        facets["facets"].append({"name": "meals", "choices": meal_facets})
        return Response(facets)
