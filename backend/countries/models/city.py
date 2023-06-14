from django.db import models


class City(models.Model):
    """
    Город

    """

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
        verbose_name="Ссылка на описание города",
        blank=True,
        null=True,
    )
    is_popular = models.BooleanField(
        verbose_name="Популярность города",
        default=False,
        help_text="Если курорт был признан популярным на основе статистики поисковых запросов, "
        "сделанных на сайте sletat.ru и сайтах партнёров, поле принимает значение “True”; "
        "в противном случае — “False”",
    )
    original_name = models.CharField(
        verbose_name="Название города на латинице",
        max_length=255,
        blank=True,
        null=True,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"

    def __str__(self):
        return self.name
