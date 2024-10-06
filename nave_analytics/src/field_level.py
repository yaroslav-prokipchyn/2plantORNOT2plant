from typing import Any

import pandas as pd

from .utils import json_read, json_write, nan_replace, normalize_date, read_data


def moisture_sufficiency_data(group: str, field_id: str) -> dict[str, Any]:
    json_data = json_read(group, field_id, "moisture-sufficiency")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    btm_block = data.btm_block
    forecast_date = normalize_date(str(btm_block.attrs["Forecast_transit_date"]))
    # standard
    h20_sufficiency = btm_block.wsuff_risk.median(axis=[1, 2]).data.ravel()
    datetime_array = list(map(normalize_date, btm_block.wsuff_risk.time.values))
    df = pd.DataFrame(
        {
            "moisture_sufficiency": nan_replace(h20_sufficiency),
            "time": datetime_array,
        }
    )
    json_data = dict(
        name="moisture-sufficiency",
        forecast_date=forecast_date,
        data=df.to_dict(orient="records"),
    )
    json_write(group, field_id, "moisture-sufficiency", json_data)
    return json_data
