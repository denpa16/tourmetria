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
    nights_count = SerializerMethodField()
    price = SerializerMethodField()
    price_currency = SerializerMethodField()
    tour_start_date = SerializerMethodField()
    tour_depart_start_date = SerializerMethodField()
    tour_depart_stop_date = SerializerMethodField()
    tickets_included = SerializerMethodField()

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
    def get_nights_count(obj):
        return obj[14]

    @staticmethod
    def get_price(obj):
        return obj[42]

    @staticmethod
    def get_price_currency(obj):
        return obj[43]

    @staticmethod
    def get_tour_start_date(obj):
        return obj[28]

    @staticmethod
    def get_tour_depart_start_date(obj):
        return obj[12]

    @staticmethod
    def get_tour_depart_stop_date(obj):
        return obj[13]

    @staticmethod
    def get_tickets_included(obj):
        return bool(obj[22])


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
    nights_count = SerializerMethodField()
    price = SerializerMethodField()
    price_currency = SerializerMethodField()
    tour_start_date = SerializerMethodField()
    tour_depart_start_date = SerializerMethodField()
    tour_depart_stop_date = SerializerMethodField()
    tickets_included = SerializerMethodField()

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
    def get_nights_count(obj):
        return obj[14]

    @staticmethod
    def get_price(obj):
        return obj[42]

    @staticmethod
    def get_price_currency(obj):
        return obj[43]

    @staticmethod
    def get_tour_start_date(obj):
        return obj[28]

    @staticmethod
    def get_tour_depart_start_date(obj):
        return obj[12]

    @staticmethod
    def get_tour_depart_stop_date(obj):
        return obj[13]

    @staticmethod
    def get_tickets_included(obj):
        return bool(obj[22])
