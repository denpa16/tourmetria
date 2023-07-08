from rest_framework.serializers import Serializer, SerializerMethodField, IntegerField


class TourListSerializer(Serializer):
    """
    Сериализатор списка туров

    """

    tour_ref_id = SerializerMethodField()
    tour_name = SerializerMethodField()
    country_name = SerializerMethodField()
    country_ref_id = SerializerMethodField()
    resort_ref_id = SerializerMethodField()
    resort_name = SerializerMethodField()
    hotel_ref_id = SerializerMethodField()
    hotel_name = SerializerMethodField()
    nights_count = SerializerMethodField()
    price = SerializerMethodField()
    price_currency = SerializerMethodField()
    depart_date = SerializerMethodField()
    arrive_date = SerializerMethodField()
    tickets_included = SerializerMethodField()
    meal_type = SerializerMethodField()
    living_type = SerializerMethodField()
    room_type = SerializerMethodField()
    touroperator = SerializerMethodField()

    @staticmethod
    def get_tour_ref_id(obj):
        return obj[0]

    @staticmethod
    def get_tour_name(obj):
        return obj[6]

    @staticmethod
    def get_country_ref_id(obj):
        return obj[30]

    @staticmethod
    def get_country_name(obj):
        return obj[31]

    @staticmethod
    def get_resort_ref_id(obj):
        return obj[5]

    @staticmethod
    def get_resort_name(obj):
        return obj[19]

    @staticmethod
    def get_hotel_ref_id(obj):
        return obj[3]

    @staticmethod
    def get_hotel_name(obj):
        return obj[7]

    @staticmethod
    def get_nights_count(obj):
        return obj[14]

    @staticmethod
    def get_price(obj):
        return obj[42]

    @staticmethod
    def get_price_currency(obj):
        return obj[43]

    @staticmethod
    def get_depart_date(obj):
        return obj[12]

    @staticmethod
    def get_arrive_date(obj):
        return obj[13]

    @staticmethod
    def get_tickets_included(obj):
        return bool(obj[22])

    @staticmethod
    def get_meal_type(obj):
        return obj[10]

    @staticmethod
    def get_living_type(obj):
        return obj[11]

    @staticmethod
    def get_room_type(obj):
        return obj[9]

    @staticmethod
    def get_touroperator(obj):
        return obj[18]


class TourRetrieveSerializer(Serializer):
    """
    Сериализатор детальной информации тура

    """

    tour_ref_id = SerializerMethodField()
    tour_name = SerializerMethodField()
    country_name = SerializerMethodField()
    country_ref_id = SerializerMethodField()
    resort_ref_id = SerializerMethodField()
    resort_name = SerializerMethodField()
    hotel_ref_id = SerializerMethodField()
    hotel_name = SerializerMethodField()
    nights_count = SerializerMethodField()
    price = SerializerMethodField()
    price_currency = SerializerMethodField()
    depart_date = SerializerMethodField()
    arrive_date = SerializerMethodField()
    tour_stop_date = SerializerMethodField()
    tickets_included = SerializerMethodField()
    meal_type = SerializerMethodField()
    living_type = SerializerMethodField()
    room_type = SerializerMethodField()

    @staticmethod
    def get_tour_ref_id(obj):
        return obj[0]

    @staticmethod
    def get_tour_name(obj):
        return obj[6]

    @staticmethod
    def get_country_ref_id(obj):
        return obj[30]

    @staticmethod
    def get_country_name(obj):
        return obj[31]

    @staticmethod
    def get_resort_ref_id(obj):
        return obj[5]

    @staticmethod
    def get_resort_name(obj):
        return obj[19]

    @staticmethod
    def get_hotel_ref_id(obj):
        return obj[3]

    @staticmethod
    def get_hotel_name(obj):
        return obj[7]

    @staticmethod
    def get_nights_count(obj):
        return obj[14]

    @staticmethod
    def get_price(obj):
        return obj[42]

    @staticmethod
    def get_price_currency(obj):
        return obj[43]

    @staticmethod
    def get_depart_date(obj):
        return obj[12]

    @staticmethod
    def get_arrive_date(obj):
        return obj[13]

    @staticmethod
    def get_tickets_included(obj):
        return bool(obj[22])

    @staticmethod
    def get_meal_type(obj):
        return obj[10]

    @staticmethod
    def get_living_type(obj):
        return obj[11]

    @staticmethod
    def get_room_type(obj):
        return obj[9]
