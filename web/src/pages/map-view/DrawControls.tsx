import { DrawEvents } from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

type DrawFieldProps = {
  onCreated: (e: DrawEvents.Created) => void
  onDrawStart: (e: DrawEvents.DrawStart) => void
}

const DrawControls = ({ onCreated, onDrawStart }: DrawFieldProps) => {
  const drawProps = {
    rectangle: false,
    polyline: false,
    circle: false,
    circlemarker: false,
    marker: false,
    polygon: {
      shapeOptions: {
        weight: 3,
        fill: false
      }
    }
  }

  return (
    <FeatureGroup>
      <EditControl
        edit={{
          remove: false,
          edit: false
        }}
        position="bottomright"
        onCreated={onCreated}
        draw={drawProps}
        onDrawStart={onDrawStart}
      />
    </FeatureGroup>
  );
};

export default DrawControls;
