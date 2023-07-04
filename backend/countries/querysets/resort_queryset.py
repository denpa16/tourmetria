from django.db.models import QuerySet


class ResortQuerySet(QuerySet):
    """
    Менеджер курортов

    """

    def active(self):
        return self.filter(active=True)
