from typing import Any, Optional

import numpy as np
import pandas as pd
from shapely import wkt

from .utils import json_read, json_write, nan_replace, normalize_date, read_data


def precipitation_data(group: str, field_id: str) -> dict[str, Any]:
    """Return precipitation data."""
    json_data = json_read(group, field_id, "precipitation")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    wth_block = data.wth_block
    twr_block = data.twr_block
    forecast_date = normalize_date(str(wth_block.attrs["Forecast_transit_date"]))
    precipitation_array = wth_block.Precip_m_d.data.ravel()
    # irrigtn_mm_d may or may not exist
    irrigation_xarray = twr_block.get("irrigtn_mm_d")
    if irrigation_xarray:
        irrigation_array = irrigation_xarray.isel(lat=0, lon=0).data.ravel()
    else:
        irrigation_array = np.zeros_like(precipitation_array)
    datetime_array = list(map(normalize_date, wth_block.Precip_m_d.time.values))
    precip_df = pd.DataFrame(
        {
            "precipitation": nan_replace(precipitation_array),
            "irrigation": nan_replace(irrigation_array),
            "time": datetime_array,
        }
    )
    json_data = dict(
        name="precipitation",
        forecast_date=forecast_date,
        data=precip_df.to_dict(orient="records"),
    )
    json_write(group, field_id, "precipitation", json_data)
    return json_data


def planting_window_data(group: str, field_id: str) -> dict[str, Any]:
    """Return planting window data."""
    json_data = json_read(group, field_id, "planting-window")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    btm_block = data.btm_block
    forecast_date = normalize_date(str(btm_block.attrs["Forecast_transit_date"]))
    planting_window = btm_block.pl_risk_category.data.ravel()
    datetime_array = list(map(normalize_date, btm_block.pl_risk_category.time.values))
    df = pd.DataFrame(
        {
            "planting_window": nan_replace(planting_window),
            "time": datetime_array,
        }
    )
    json_data = dict(
        name="planting-window",
        forecast_date=forecast_date,
        data=df.to_dict(orient="records"),
    )
    json_write(group, field_id, "planting-window", json_data)
    return json_data


def risk_map_data(
    group: str, field_id: str, date: Optional[str] = None
) -> dict[str, Any]:
    json_data = json_read(group, field_id, f"risk-maps?date={date}")
    if json_data:
        return json_data
    # standard
    data = read_data(group, field_id)
    btm_block = data.btm_block
    if date is not None:
        up_to_date = pd.to_datetime(date)
    else:
        up_to_date = pd.to_datetime(btm_block.attrs["Forecast_transit_date"])

    sat_da = btm_block.wexcess_risk.sel(time=up_to_date)
    suf_da = btm_block.wsuff_risk.sel(time=up_to_date)
    geom = wkt.loads(btm_block.aoi)
    if geom.geom_type == "Polygon":
        aoi_lon, aoi_lat = map(np.array, geom.exterior.coords.xy)
    elif geom.geom_type == "MultiPolygon":
        lon_list = []
        lat_list = []
        for polygon in geom.geoms:
            lon, lat = map(np.array, polygon.exterior.coords.xy)
            lon_list.append(lon)
            lat_list.append(lat)
        aoi_lon = np.concatenate(lon_list)
        aoi_lat = np.concatenate(lat_list)
    json_data = dict(
        name="risk-maps",
        data=dict(
            aoi_lat=aoi_lat.tolist(),
            aoi_lon=aoi_lon.tolist(),
            saturation=nan_replace(sat_da.data).tolist(),
            sufficiency=nan_replace(suf_da.data).tolist(),
            lon=btm_block.lon.values.tolist(),
            lat=btm_block.lat.values.tolist(),
            time=normalize_date(up_to_date),
        ),
    )
    json_write(group, field_id, f"risk-maps?date={date}", json_data)
    return json_data


def saturation_risk_data(group: str, field_id: str) -> dict[str, Any]:
    """Return saturation risk data."""
    json_data = json_read(group, field_id, "saturation-risk")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    btm_block = data.btm_block
    forecast_date = normalize_date(str(btm_block.attrs["Forecast_transit_date"]))
    datetime_array = list(map(normalize_date, btm_block.wexcess_risk_05cm.time.values))
    btm_block.wexcess_risk_05cm.data[btm_block.wexcess_risk_05cm.data == 0.0] = np.nan
    btm_block.wexcess_risk_15cm.data[btm_block.wexcess_risk_15cm.data == 0.0] = np.nan
    btm_block.wexcess_risk_30cm.data[btm_block.wexcess_risk_30cm.data == 0.0] = np.nan
    btm_block.wexcess_risk_60cm.data[btm_block.wexcess_risk_60cm.data == 0.0] = np.nan
    saturation_005cm = btm_block.wexcess_risk_05cm.median(dim=["lat", "lon"])
    saturation_015cm = btm_block.wexcess_risk_15cm.median(dim=["lat", "lon"])
    saturation_030cm = btm_block.wexcess_risk_30cm.median(dim=["lat", "lon"])
    saturation_060cm = btm_block.wexcess_risk_60cm.median(dim=["lat", "lon"])
    df = pd.DataFrame(
        {
            "saturation_005cm": nan_replace(saturation_005cm.data.ravel()),
            "saturation_015cm": nan_replace(saturation_015cm.data.ravel()),
            "saturation_030cm": nan_replace(saturation_030cm.data.ravel()),
            "saturation_060cm": nan_replace(saturation_060cm.data.ravel()),
            "time": datetime_array,
        }
    )
    json_data = dict(
        name="saturation-risk",
        forecast_date=forecast_date,
        data=df.to_dict(orient="records"),
    )
    json_write(group, field_id, "saturation-risk", json_data)
    return json_data


def sufficiency_risk_data(group: str, field_id: str) -> dict[str, Any]:
    """Return saturation risk data."""
    json_data = json_read(group, field_id, "sufficiency-risk")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    btm_block = data.btm_block
    forecast_date = normalize_date(str(btm_block.attrs["Forecast_transit_date"]))
    datetime_array = list(map(normalize_date, btm_block.wsuff_risk.time.values))
    sufficiency = btm_block.wsuff_risk.median(axis=[1, 2]).data.ravel()
    df = pd.DataFrame(
        {
            "sufficiency": nan_replace(sufficiency),
            "time": datetime_array,
        }
    )
    json_data = dict(
        name="sufficiency-risk",
        forecast_date=forecast_date,
        data=df.to_dict(orient="records"),
    )
    json_write(group, field_id, "sufficiency-risk", json_data)
    return json_data
