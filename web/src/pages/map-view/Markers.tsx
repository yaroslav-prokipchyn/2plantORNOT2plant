import L, { divIcon } from 'leaflet';
import { Marker } from 'react-leaflet';

type MarkerProps = {
  position: L.LatLngExpression
  value?: string
}

export const WarningMarker = ({ position }: MarkerProps) => {
  const icon = divIcon({ className: 'custom-marker field-info-badge--warning', html: '!', iconAnchor: [-8, 30] });
  return <Marker position={position} icon={icon}/>;
};

export const IrrigationMarker = ({ position, value }: MarkerProps) => {
  const icon = divIcon({ className: 'custom-marker field-info-badge--irrigation', html: value ?? '-', iconAnchor: [-8, 30] });
  return <Marker position={position} icon={icon}/>;
};

export const RainMarker = ({ position, value }: MarkerProps) => {
  const icon = divIcon({ className: 'custom-marker field-info-badge--rain', html: value ?? '-', iconAnchor: [-28, 30] });
  return <Marker position={position} icon={icon}/>;
};
