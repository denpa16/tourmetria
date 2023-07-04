from django.db.models import QuerySet


class CountryQuerySet(QuerySet):
    """
    Менеджер стран

    """

    def active(self):
        return self.filter(active=True)
