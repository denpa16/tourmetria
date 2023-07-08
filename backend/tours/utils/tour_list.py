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


def group_tour_into_hotel(sorted_data: list):
    """
    Группировка туров в отели

    """
    hotels_names = []
    for tour in sorted_data:
        if tour["hotel_name"] not in hotels_names:
            hotels_names.append(tour["hotel_name"])
    hotels = list()
    for hotel in sorted_data:
        tours = [v for v in sorted_data if v["hotel_name"] == hotel["hotel_name"]]
        tour_min_price = min([obj["price"] for obj in tours])
        hotels.append(
            {
                "hotel_name": hotel["hotel_name"],
                "hotel_ref_id": hotel["hotel_ref_id"],
                "tour_min_price": tour_min_price,
                "tours": tours,
            }
        )
    return hotels
