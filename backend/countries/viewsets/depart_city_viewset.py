from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet
from common.viewset_mixins import SpecsFacetsMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from countries.filters import DepartCityFilter
from countries.models import DepartCity
from countries.serializers import DepartCitySerializer


@extend_schema(tags=["DepartCity"])
class DepartCityViewSet(SpecsFacetsMixin, ReadOnlyModelViewSet):
    """
    Города вылета

    """

    queryset = DepartCity.objects.all()
    serializer_class = DepartCitySerializer
    filterset_class = DepartCityFilter

    @action(detail=False, methods=("GET",))
    def specs(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        depart_city_specs = {
            "name": "depart_cities",
            "choices": [
                {"label": name, "value": slug}
                for name, slug in filter.qs.values_list("name", "slug")
            ],
        }
        specs = filter.specs()
        specs.append(depart_city_specs)
        return Response(specs)

    @action(detail=False, methods=("GET",))
    def facets(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        depart_city_facets = [depart_city["slug"] for depart_city in filter.qs.values("slug")]
        facets = filter.facets()
        facets.append(depart_city_facets)
        return Response(facets)
