## Документация для запросов

### Туры

url: api/tours

params:
- ```cityFromId```: string - ref_id города вылета (обязательно)
- ```countryId```: string - ref_id страны тура (обязательно)
- ```cities```: array[], string elements - массив ref_id курортов (обязательно)
- ```meals```: array[], string elements - массив ref_id типов питания (не обязательно)
- ```stars```: array[], string elements - массив ref_id категорий отелей (не обязательно)
- ```hotels```: array[], string elements - массив ref_id отелей (не обязательно)
- ```s_adults```: integer - количество туристов-взрослых (не обязательно)
- ```s_kids```: integer - количество туристов-взрослых (не обязательно)