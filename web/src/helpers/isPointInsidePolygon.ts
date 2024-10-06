import L from "leaflet";

const isPointInsidePolygon = (point: L.LatLngTuple, polygon: L.LatLngTuple[]) => {
    const leafletPolygon = L.polygon(polygon);
    return leafletPolygon.getBounds().contains(point as L.LatLngExpression);
  };

export default isPointInsidePolygon;