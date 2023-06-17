## Документация для запросов

### Туры

url: api/tours

params:
- ```cityFromId: integer``` - ```ref_id``` города вылета (обязательно)
- ```countryId: integer``` - ```ref_id``` страны тура (обязательно)
- ```cities: array[], integer elements``` - массив ```ref_id``` курортов (обязательно)
- ```meals: array[], integer elements``` - массив ```ref_id``` типов питания (не обязательно)
- ```stars: array[], integer elements``` - массив ```ref_id``` категорий отелей (не обязательно)
- ```hotels: array[], integer elements``` - массив ```ref_id``` отелей (не обязательно)
- ```s_adults: integer``` - количество туристов-взрослых (не обязательно)
- ```s_kids: integer``` - количество туристов-взрослых (не обязательно)