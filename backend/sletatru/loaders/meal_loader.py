from sletatru.loaders import BaseLoader
from sletatru.converters import MealDataConverter
from hotels.models import Meal


class MealLoader(BaseLoader):
    """
    Загрузчик питания
    """

    def load_data_from_crm(self):
        """
        Создание/обновление питания
        """
        meals_ref_ids = set(Meal.objects.values_list("ref_id", flat=True))
        meals_to_update = {}
        meals_to_create = []
        meals_data = self.client.get_meals()
        if len(meals_data) != 0:
            for meal_data in meals_data:
                ref_id = str(meal_data["Id"])
                if ref_id in meals_ref_ids:
                    meals_to_update[ref_id] = dict(**self.converter(meal_data, action="update"))
                else:
                    converter_data: MealDataConverter = self.converter(
                        meal_data,
                    )
                    meals_to_create.append(Meal(**converter_data))

        self.bulk_create(meals_to_create)
        self.bulk_update(meals_to_update)
