from flask import Blueprint, jsonify, make_response, request

from .exceptions import S3AccessDeniedException
from .field_level import moisture_sufficiency_data
from .planting_conditions import (
    planting_window_data,
    precipitation_data,
    risk_map_data,
    saturation_risk_data,
    sufficiency_risk_data,
)
from .soil_moisture_content import (
    field_level_moisture_data,
    seed_zone_moisture_data,
    water_available_surface_data,
)

api = Blueprint("api", __name__)


@api.errorhandler(S3AccessDeniedException)
def handle_access_denied(error):
    response = jsonify({"error": str(error)})
    return make_response(response, 403)  # Forbidden


@api.route("/test")
def test():
    return "hello api"



@api.route("/field-level-moisture/<group>/<field_id>")
def field_level_moisture(group: str, field_id: str) -> str:
    """Field Level Moisture API."""
    try:
        return jsonify(field_level_moisture_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/moisture-sufficiency/<group>/<field_id>")
def moisture_sufficiency(group: str, field_id: str) -> str:
    """Moisture Sufficiency API."""
    try:
        return jsonify(moisture_sufficiency_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/planting-window/<group>/<field_id>")
def planting_window(group: str, field_id: str) -> str:
    """Planting Window API."""
    return jsonify(planting_window_data(group, field_id))


@api.route("/precipitation/<group>/<field_id>")
def precipitation(group: str, field_id: str) -> str:
    """Precipitation API."""
    try:
        return jsonify(precipitation_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/risk-maps/<group>/<field_id>")
def risk_maps(group: str, field_id: str) -> str:
    """Risk Maps API."""
    date = request.args.get("date")
    try:
        return jsonify(risk_map_data(group, field_id, date))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/saturation-risk/<group>/<field_id>")
def saturation_risk(group: str, field_id: str) -> str:
    """Saturation Risk API."""
    try:
        return jsonify(saturation_risk_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/sufficiency-risk/<group>/<field_id>")
def sufficiency_risk(group: str, field_id: str) -> str:
    """Sufficiency Risk API."""
    try:
        return jsonify(sufficiency_risk_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/seed-zone-moisture/<group>/<field_id>")
def seed_zone_moisture(group: str, field_id: str) -> str:
    """Seed Zone Moisture API."""
    try:
        return jsonify(seed_zone_moisture_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404


@api.route("/water-available/<group>/<field_id>")
def water_available_surface(group: str, field_id: str) -> str:
    """Water Available Surface API."""
    try:
        return jsonify(water_available_surface_data(group, field_id))
    except FileNotFoundError:
        return jsonify({"error": "Data not found"}), 404
