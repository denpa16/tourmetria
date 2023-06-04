from django.db.models import IntegerChoices, TextChoices


class Currency(TextChoices):
    """
    Валюта

    """

    EUR = "EUR", "Евро"
    USD = "USD", "Доллар"
    RUR = "RUR", "Рубль"
