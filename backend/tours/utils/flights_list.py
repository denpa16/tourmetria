def get_flights(input_data: dict):
    """
    Получене перелетов

    """
    data = input_data["resources"]
    flights = dict()

    for f in data:
        if f["isEnabled"] is True:
            flights[f["id"]] = {"id": f["id"], "name": f["name"], "surcharge": f["surcharge"]}

    row_data = input_data["resourceData"]

    for r in row_data:
        if r["name"] == "AIRPORT_FROM_NAME":
            flights[r["resourceId"]]["airport_from"] = r["value"]
        if r["name"] == "AIRPORT_TO_NAME":
            flights[r["resourceId"]]["airport_to"] = r["value"]
        if r["name"] == "CLASS":
            flights[r["resourceId"]]["class"] = r["value"]
        if r["name"] == "BAGGAGE_INCLUDED":
            flights[r["resourceId"]]["baggage_included"] = r["value"]
        if r["name"] == "START_DATETIME":
            flights[r["resourceId"]]["start_datetime"] = r["value"]
        if r["name"] == "END_DATETIME":
            flights[r["resourceId"]]["end_datetime"] = r["value"]

    fligths_items = list(flights.items())
    half = int(len(fligths_items) / 2)
    departs = fligths_items[:half]
    arrives = fligths_items[half:]

    new_list = list()
    for i in range(half):
        new_list.append(
            {
                "to": departs[i][1],
                "from": arrives[i][1],
            }
        )
    return new_list
