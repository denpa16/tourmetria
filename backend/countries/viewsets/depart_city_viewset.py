from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet
from common.viewset_mixins import SpecsFacetsMixin
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.decorators import action
from countries.filters import DepartCityFilter
from countries.models import DepartCity
from countries.serializers import DepartCitySerializer


@extend_schema(tags=["DepartCity"])
class DepartCityViewSet(SpecsFacetsMixin, ReadOnlyModelViewSet):
    """
    Города вылета

    """

    lookup_field = "ref_id"
    lookup_url_kwargs = "ref_id"

    queryset = DepartCity.objects.all()
    serializer_class = DepartCitySerializer
    filterset_class = DepartCityFilter

    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    )
    search_fields = ("^name",)

    @action(detail=False, methods=("GET",))
    def specs(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        depart_city_specs = {
            "name": "depart_cities",
            "choices": [
                {"label": name, "value": ref_id}
                for name, ref_id in filter.qs.values_list("name", "ref_id")
            ],
        }
        specs = filter.specs()
        specs.append(depart_city_specs)
        return Response(specs)

    @action(detail=False, methods=("GET",))
    def facets(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        depart_city_facets = [depart_city["ref_id"] for depart_city in filter.qs.values("ref_id")]
        facets = filter.facets()
        facets["facets"].append({"depart_cities": depart_city_facets})
        return Response(facets)
