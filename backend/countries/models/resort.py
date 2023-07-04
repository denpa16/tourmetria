from django.db import models


class Resort(models.Model):
    """
    Курорт

    """

    active = models.BooleanField(
        verbose_name="Активный",
        default=False,
    )
    country = models.ForeignKey(
        "countries.Country",
        verbose_name="Страна",
        on_delete=models.CASCADE,
    )
    ref_id = models.CharField(
        verbose_name="Внешний ID",
        max_length=255,
        blank=True,
        null=True,
    )
    name = models.CharField(
        verbose_name="Название",
        max_length=255,
        blank=True,
        null=True,
    )
    slug = models.SlugField(
        verbose_name="Слаг",
        max_length=255,
        blank=True,
        null=True,
    )
    description_url = models.TextField(
        verbose_name="Ссылка на описание курорта",
        blank=True,
        null=True,
    )
    is_popular = models.BooleanField(
        verbose_name="Популярность курорта",
        default=False,
        help_text="Если курорт был признан популярным на основе статистики поисковых запросов, "
        "сделанных на сайте sletat.ru и сайтах партнёров, то ставится галочка; "
        "в противном случае — не ставится",
    )
    original_name = models.CharField(
        verbose_name="Название курорта на латинице",
        max_length=255,
        blank=True,
        null=True,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Курорт"
        verbose_name_plural = "Курорты"

    def __str__(self):
        return self.name
