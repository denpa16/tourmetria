from django.db.models import QuerySet


class DepartCityQuerySet(QuerySet):
    """
    Менеджер городов вылета

    """

    def active(self):
        return self.filter(active=True)
