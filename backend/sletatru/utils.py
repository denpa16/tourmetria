def func_chunks_generators(lst: list, n: int):
    """
    Разделение списка на подсписки

    """
    for i in range(0, len(lst), n):
        yield lst[i : i + n]
