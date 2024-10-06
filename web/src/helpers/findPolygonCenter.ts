type LatLngs = { lat: number; lng: number; }

export function findPolygonCenter(latlngs: LatLngs[]): LatLngs {
  const { length } = latlngs;

  const { lat, lng } = latlngs.reduce((acc, { lat, lng }) => ({
    lat: acc.lat + lat,
    lng: acc.lng + lng,
  }), { lat: 0, lng: 0 });

  return { lat: lat / length, lng: lng / length };
}
