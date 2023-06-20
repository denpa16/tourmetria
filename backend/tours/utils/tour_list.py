from tours.serializers import TourListSerializer


def serialize_list_tour(tours_data: dict):
    """
    Сериализация туров

    """
    tours = tours_data["aaData"]
    requestId = tours_data["requestId"]
    serializer = TourListSerializer(data=tours, many=True)
    serializer.is_valid()
    data = {
        "requestId": requestId,
        "tours": serializer.data,
    }
    return data
