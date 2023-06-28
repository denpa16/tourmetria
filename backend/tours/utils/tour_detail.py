from tours.serializers import TourRetrieveSerializer


def get_detail_tour(tours_data: dict, pk: str) -> list:
    """
    Выделение тура из массива

    """
    detailed_tour = []
    tours = tours_data["aaData"]
    if tours:
        for tour in tours:
            if tour[0] == pk:
                detailed_tour = tour
                break
            else:
                detailed_tour = []
    else:
        detailed_tour = []
    return detailed_tour


def serialize_detailed_tour(tour: list):
    """
    Сериализация тура

    """
    tour = [tour]
    if tour[0]:
        serializer = TourRetrieveSerializer(data=tour, many=True)
        serializer.is_valid()
        return serializer.data[0]
    else:
        return []
