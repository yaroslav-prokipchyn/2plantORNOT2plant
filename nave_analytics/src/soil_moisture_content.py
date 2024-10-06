from typing import Any

import numpy as np
import pandas as pd
import xarray as xr

from .utils import json_read, json_write, nan_replace, normalize_date, read_data


def seed_zone_moisture_data(group: str, field_id: str) -> dict[str, Any]:
    """Return seed zone moisture data."""
    json_data = json_read(group, field_id, "seed-zone-moisture")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    wth_block = data.wth_block
    btm_block = data.btm_block
    sls_block = data.sls_block
    df = smc_third_row_df(btm_block, sls_block)
    forecast_date = normalize_date(str(wth_block.attrs["Forecast_transit_date"]))
    water_risk_zones_df = pd.DataFrame(
        {
            "wp": nan_replace(df.wp),
            "rtsml_b": nan_replace(df.rtsml_b),
            "rtsml_t": nan_replace(df.rtsml_t),
            "fhc": nan_replace(df.fhc),
            "swc_est": df.swc_est.replace(np.nan, None),
            "swc_sig_under": df.swc_sig_undr.replace(np.nan, None),
            "swc_sig_over": df.swc_sig_over.replace(np.nan, None),
            "time": list(map(normalize_date, df.index)),
            # Mouseovers
            "to_full_profile": nan_replace(df.to_full_profile),
            "to_7day_target": nan_replace(df.to_7day_target),
        }
    )
    json_data = dict(
        name="seed-zone-moisture",
        forecast_date=forecast_date,
        data=water_risk_zones_df.to_dict(orient="records"),
    )
    json_write(group, field_id, "seed-zone-moisture", json_data)
    return json_data


def smc_third_row_df(smc_block: xr.Dataset, sls_block: xr.Dataset):
    swc_est_arr = smc_block.assim_sz_sm_est.median(dim=["lat", "lon"]) * 0.15
    swc_sgm_arr = smc_block.assim_sz_sm_sgm.median(dim=["lat", "lon"]) * 0.15

    FHC = float(sls_block.fhc.median().values) + 0.025
    WTP = float(sls_block.wp.median().values) - 0.025

    FHC = FHC * 0.15
    WTP = WTP * 0.15

    factor = 1000.0  # metric

    sm_arr = swc_est_arr * factor
    sm_arr_sig = swc_sgm_arr * factor

    datetime_array = sm_arr.time.values
    swc_est_df = pd.DataFrame({0: sm_arr.data}, index=datetime_array)
    swc_sig_df = pd.DataFrame({0: sm_arr_sig.data}, index=datetime_array)

    swc_sig_df.loc[swc_sig_df[0] > (FHC - WTP) * 0.5 * factor, 0] = np.nan
    under_line = (swc_est_df - swc_sig_df)[0]
    over_line = (swc_est_df + swc_sig_df)[0]
    under_line[under_line < 0] = 0

    fhc = FHC * factor
    wp = WTP * factor

    rtsml_t = np.array([wp + (fhc - wp) * 0.8] * 180)
    rtsml_b = np.array([wp + (fhc - wp) * 0.55] * 180)

    swc_ts_df = pd.DataFrame({"swc_est": sm_arr.data}, index=datetime_array)
    swc_ts_df["swc_sig"] = sm_arr_sig.data.tolist()
    swc_ts_df["swc_sig_over"] = over_line.tolist()
    swc_ts_df["swc_sig_undr"] = under_line.tolist()
    swc_ts_df["rtsml_t"] = rtsml_t[0 : len(swc_ts_df["swc_sig_over"])]
    swc_ts_df["rtsml_b"] = rtsml_b[0 : len(swc_ts_df["swc_sig_over"])]
    swc_ts_df["fhc"] = fhc
    swc_ts_df["wp"] = wp

    swc_ts_df["to_full_profile"] = (swc_ts_df["fhc"] - swc_ts_df["swc_est"]) * 0.15
    swc_ts_df["to_7day_target"] = (
        swc_ts_df["rtsml_t"] + (0.015 * factor) - swc_ts_df["swc_est"]
    ) * 0.15

    return swc_ts_df


def water_available_surface_data(group: str, field_id: str) -> dict[str, Any]:
    """Return water available surface data."""
    json_data = json_read(group, field_id, "water-available-surface")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    btm_block = data.btm_block

    btm_block.assim_sz_sm_est.data[btm_block.assim_sz_sm_est.data == 0.0] = np.nan
    up_to_date = pd.to_datetime(
        btm_block.attrs["Forecast_transit_date"]
    ) - pd.Timedelta("1 day")

    # for eye candy
    past_1d = up_to_date
    futr_7d = btm_block.time.max() - pd.Timedelta("1 day")

    json_data = dict(
        name="water-available-surface",
        times=[
            past_1d.strftime("%Y-%m-%d"),
            np.datetime_as_string(futr_7d).split("T")[0],
        ],
        data=dict(
            past_1day=nan_replace(
                1000 * btm_block.assim_sz_sm_est.sel(time=past_1d).data
            ).tolist(),
            future_7day=nan_replace(
                1000 * btm_block.assim_sz_sm_est.sel(time=futr_7d).data
            ).tolist(),
            lon=btm_block.lon.values.tolist(),
            lat=btm_block.lat.values.tolist(),
        ),
    )
    json_write(group, field_id, "water-available-surface", json_data)
    return json_data


def field_level_moisture_data(group: str, field_id: str) -> dict[str, Any]:
    """Return field level soil moisture data."""
    json_data = json_read(group, field_id, "field-level-moisture")
    if json_data:
        return json_data
    data = read_data(group, field_id)
    wth_block = data.wth_block
    btm_block = data.btm_block
    sls_block = data.sls_block
    df = smc_fifth_row_df(btm_block, sls_block)
    forecast_date = normalize_date(str(wth_block.attrs["Forecast_transit_date"]))
    water_risk_zones_df = pd.DataFrame(
        {
            "wp": nan_replace(df.wp),
            "rtsml_b": nan_replace(df.rtsml_b),
            "rtsml_t": nan_replace(df.rtsml_t),
            "fhc": nan_replace(df.fhc),
            "swc_est": df.swc_est.replace(np.nan, None),
            "swc_sig_under": df.swc_sig_undr.replace(np.nan, None),
            "swc_sig_over": df.swc_sig_over.replace(np.nan, None),
            "time": list(map(normalize_date, df.index)),
            # Mouseovers
            "to_full_profile": nan_replace(df.to_full_profile),
            "to_7day_target": nan_replace(df.to_7day_target),
        }
    )
    json_data = dict(
        name="field-level-moisture",
        forecast_date=forecast_date,
        data=water_risk_zones_df.to_dict(orient="records"),
    )
    json_write(group, field_id, "field-level-moisture", json_data)
    return json_data


def smc_fifth_row_df(smc_block: xr.Dataset, sls_block: xr.Dataset):
    swc_est_arr = smc_block.assim_rz_sm_est.median(dim=["lat", "lon"])
    swc_sgm_arr = smc_block.assim_rz_sm_sgm.median(dim=["lat", "lon"])

    FHC = float(sls_block.fhc.median().values) + 0.025
    WTP = float(sls_block.wp.median().values) - 0.025

    factor = 1000.0  # metric

    sm_arr = swc_est_arr * factor
    sm_arr_sig = swc_sgm_arr * factor

    datetime_array = sm_arr.time.values
    swc_est_df = pd.DataFrame({0: sm_arr.data}, index=datetime_array)
    swc_sig_df = pd.DataFrame({0: sm_arr_sig.data}, index=datetime_array)

    swc_sig_df.loc[swc_sig_df[0] > (FHC - WTP) * 0.5 * factor, 0] = np.nan
    under_line = (swc_est_df - swc_sig_df)[0]
    over_line = (swc_est_df + swc_sig_df)[0]
    under_line[under_line < 0] = 0

    fhc = FHC * factor
    wp = WTP * factor

    rtsml_t = np.array([wp + (fhc - wp) * 0.8] * 180)
    rtsml_b = np.array([wp + (fhc - wp) * 0.55] * 180)

    swc_ts_df = pd.DataFrame({"swc_est": sm_arr.data}, index=datetime_array)
    swc_ts_df["swc_sig"] = sm_arr_sig.data.tolist()
    swc_ts_df["swc_sig_over"] = over_line.tolist()
    swc_ts_df["swc_sig_undr"] = under_line.tolist()
    swc_ts_df["rtsml_t"] = rtsml_t[0 : len(swc_ts_df["swc_sig_over"])]
    swc_ts_df["rtsml_b"] = rtsml_b[0 : len(swc_ts_df["swc_sig_over"])]
    swc_ts_df["fhc"] = fhc
    swc_ts_df["wp"] = wp

    swc_ts_df["to_full_profile"] = (swc_ts_df["fhc"] - swc_ts_df["swc_est"]) * 0.15
    swc_ts_df["to_7day_target"] = (
        swc_ts_df["rtsml_t"] + (0.015 * factor) - swc_ts_df["swc_est"]
    ) * 0.15

    return swc_ts_df
