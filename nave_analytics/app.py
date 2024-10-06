from flask import Blueprint, Flask, send_from_directory
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from src import api_views

app = Flask(__name__, static_folder="")
api = Blueprint("api", __name__, url_prefix="/data")
api.register_blueprint(api_views.api, url_prefix="/v1")
app.register_blueprint(api)


swaggerui_blueprint = get_swaggerui_blueprint(
    base_url="/data/docs", api_url="/data/docs/openapi.yaml"
)
app.register_blueprint(swaggerui_blueprint)

CORS(app)


@app.route("/data")
def hello_world():
    return "Hello, World."


@app.route("/data/docs/openapi.yaml")
def openapi():
    return send_from_directory("", "openapi.yaml")
