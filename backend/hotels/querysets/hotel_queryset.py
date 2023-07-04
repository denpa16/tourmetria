from django.db.models import QuerySet


class HotelQuerySet(QuerySet):
    """
    Менеджер отелей

    """

    def active(self):
        return self.filter(active=True)
