from hotels.models import Hotel
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
    default_tour_min_price = 1000000000
    hotels = dict()
    for tour in sorted_data:
        try:
            hotel = hotels[tour["hotel_ref_id"]]
        except KeyError:
            hotels[tour["hotel_ref_id"]] = {
                "hotel_name": tour["hotel_name"],
                "tour_count": 0,
                "rest_types": [],
                "tour_min_price": default_tour_min_price,
                "touroperators": [],
                "touroperator_count": 0,
                "tours": [],
            }
            hotel = hotels[tour["hotel_ref_id"]]
        hotel["tours"].append(tour)
        hotel["tour_count"] += 1
        if hotel["tour_min_price"] >= tour["price"]:
            hotel["tour_min_price"] = tour["price"]
        if tour["touroperator"] not in hotel["touroperators"]:
            hotel["touroperators"].append(tour["touroperator"])
            hotel["touroperator_count"] += 1
    db_hotels_rest_types = Hotel.objects.filter(ref_id__in=list(hotels.keys())).values(
        "ref_id", "rest_types__name"
    )
    for hotel_rest_type in db_hotels_rest_types:
        if hotel_rest_type["rest_types__name"] is not None:
            hotels[int(hotel_rest_type["ref_id"])]["rest_types"].append(
                hotel_rest_type["rest_types__name"]
            )
        else:
            hotels[int(hotel_rest_type["ref_id"])]["rest_types"] = []
    return hotels
