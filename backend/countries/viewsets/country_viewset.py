from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet
from common.viewset_mixins import SpecsFacetsMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from countries.filters import CountryFilter
from countries.models import Country
from countries.serializers import CountrySerializer


@extend_schema(tags=["Country"])
class CountryViewSet(SpecsFacetsMixin, ReadOnlyModelViewSet):
    """
    Города вылета

    """

    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filterset_class = CountryFilter

    @action(detail=False, methods=("GET",))
    def specs(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        country_specs = {
            "name": "countries",
            "choices": [
                {"label": name, "value": slug}
                for name, slug in filter.qs.values_list("name", "slug")
            ],
        }
        specs = filter.specs()
        specs.append(country_specs)
        return Response(specs)

    @action(detail=False, methods=("GET",))
    def facets(self, request):
        queryset = self.get_queryset()
        filter = self.filterset_class(request.GET, queryset)
        country_facets = [country["slug"] for country in filter.qs.values("slug")]
        facets = filter.facets()
        facets["facets"].append({"name": "countries", "choices": country_facets})
        return Response(facets)
