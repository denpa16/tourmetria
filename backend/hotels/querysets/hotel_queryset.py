from django.db.models import QuerySet


class HotelQuerySet(QuerySet):
    """
    Менеджер отелей

    """

    def active(self):
        return self.filter(active=True, resort__active=True, resort__country__active=True)
