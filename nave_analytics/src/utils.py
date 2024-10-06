import datetime as dt
import gzip
import json
import os
import shutil
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional, Union

import boto3
import numpy as np
import xarray as xr
from botocore.exceptions import ClientError
from dateutil.parser import parse as date_parse

from src.exceptions import S3AccessDeniedException


def nan_replace(x: np.ndarray) -> np.ndarray:
    return np.where(~np.isfinite(x), None, x)


def date_string(x: np.datetime64) -> str:
    return str(x).split("T")[0]


@dataclass
class NaveAnalyticsData:
    """Store NetCDF datasets."""

    btm_block: Optional[xr.Dataset]  # bottom
    wth_block: Optional[xr.Dataset]  # weather
    sls_block: Optional[xr.Dataset]  # soil
    twr_block: Optional[xr.Dataset]  # top at work resolution



def safe_read_block(input_folder: str, file_pattern: str) -> Optional[xr.Dataset]:
    """Read a NetCDF block and return None if it doesn't exist."""
    try:
        with xr.open_dataset(next(Path(input_folder).glob(file_pattern))) as dataset:
            return dataset.load()
    except StopIteration:
        return None


ACCOUNT_ID = os.environ.get("ACCOUNT_ID", "804050381141")


def get_role_arn_for_client(client_id):
    return 'arn:aws:iam::{}:role/nave_s3_access_for_{}'.format(ACCOUNT_ID, client_id)


def assume_role_for_client(client_id):
    role_arn = get_role_arn_for_client(client_id)

    sts_client = boto3.client("sts")
    response = sts_client.assume_role(
        RoleArn=role_arn,
        RoleSessionName="SessionNameForClientId_{}".format(client_id),
    )

    return response["Credentials"]


def get_s3_client():
    return boto3.client("s3")




def list_subfolders(bucket: str, key: str) -> list[str]:
    s3 = get_s3_client()
    try:
        response = s3.list_objects_v2(Bucket=bucket, Prefix=key, Delimiter="/")
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "AccessDenied":
            raise S3AccessDeniedException("Access denied to the S3 bucket.")
        else:
            raise FileNotFoundError

    common_prefixes = response.get("CommonPrefixes", [])
    subfolders = []
    for common_prefix in common_prefixes:
        prefix = common_prefix["Prefix"]
        subfolder = prefix[len(key) : -1]  # Removing key and trailing slash
        subfolders.append(subfolder)
    return subfolders


def _age(path: Path) -> float:
    return (
        dt.datetime.now() - dt.datetime.fromtimestamp(os.path.getmtime(path))
    ).total_seconds()


def json_read(org_id: str, field_id: str, viz_type: str) -> Union[dict[str, Any], None]:
    """Return folder for org_id and field ID and whether to download new data"""
    path = Path("/tmp/nave-analytics/json") / f"{org_id}_{field_id}_{viz_type}.json.gz"
    if path.exists():
        if _age(path) > (3600 * 24):
            path.unlink()
            return
        with gzip.open(path, "rt") as f:
            return json.loads(f.read())


def json_write(org_id: str, field_id: str, viz_type: str, data: dict[str, Any]) -> None:
    """Write data to a JSON file."""
    parent = Path("/tmp/nave-analytics/json")
    parent.mkdir(exist_ok=True, parents=True)
    for path in parent.glob("*.json.gz"):
        if _age(path) > (3600 * 24):
            path.unlink()
    path = parent / f"{org_id}_{field_id}_{viz_type}.json.gz"
    with gzip.open(path, "wt") as f:
        f.write(json.dumps(data))


def netcdf_caching(org_id: str, field_id: str, recent_date) -> tuple[Path, bool]:
    """Return folder for org_id and field ID and whether to download new data"""
    base_folder = Path("/tmp/nave-analytics/netcdf")
    folder_name = f"{org_id}_{field_id}_{recent_date}"
    folder = Path(base_folder) / folder_name
    timestamp_path = folder / "timestamp"
    if (timestamp_path).exists():
        if _age(timestamp_path) > (3600 * 24):
            shutil.rmtree(folder)
        else:
            return folder, False
    folder.mkdir(exist_ok=True, parents=True)
    timestamp_path.touch()
    for _folder in base_folder.glob("*"):
        if _folder.name == folder.name:
            continue
        _timestamp_path = _folder / "timestamp"
        if _folder.is_dir() and _age(_timestamp_path) > (3600 * 24):
            shutil.rmtree(_folder)
    return folder, True


def _safe_read_all(folder: Path) -> Union[NaveAnalyticsData, None]:
    btm_block = safe_read_block(folder, "FBTM*")
    wth_block = safe_read_block(folder, "FW1D*")
    sls_block = safe_read_block(folder, "SGR2*")
    twr_block = safe_read_block(folder, "FTOP*WRes*")
    if btm_block and wth_block and sls_block and twr_block:
        return NaveAnalyticsData(btm_block, wth_block, sls_block, twr_block)


def read_data(org_id: str, field_id: str) -> Optional[NaveAnalyticsData]:
    """Read weather data from a NetCDF directory."""
    s3 = get_s3_client()
    recent_date = max(list_subfolders(org_id, ""))
    folder, download_data = netcdf_caching(org_id, field_id, recent_date)
    if not download_data:
        for _ in range(10):
            nave_data = _safe_read_all(folder)
            if nave_data:
                return nave_data
            time.sleep(1)
        raise ValueError("Data not found")
    try:
        response = s3.list_objects_v2(
            Bucket=org_id, Prefix=f"{recent_date}/{field_id}/"
        )
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "AccessDenied":
            raise S3AccessDeniedException("Access denied to the S3 bucket.")
        else:
            raise FileNotFoundError
    if "Contents" not in response:
        return
    for o in response["Contents"]:
        key = o["Key"]
        if key.endswith(".nc"):
            fname = key.split("/")[-1]
            output_path = str(folder / fname)
            s3.download_file(org_id, key, output_path)
    return _safe_read_all(folder)


def normalize_date(date: Union[str, np.datetime64]) -> str:
    """Normalize a date to a string."""
    return date_parse(str(date)).isoformat()
