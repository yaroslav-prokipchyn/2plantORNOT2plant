import { Fragment, useEffect, useRef, useState } from 'react';
import { Layout, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from '@uidotdev/usehooks';
import classNames from 'classnames';
import L, { DrawEvents, LatLng, LatLngTuple, LeafletMouseEvent, Map, Polygon as PolygonClass, } from 'leaflet';
import {
  MapContainer,
  Marker,
  Polygon as LeafletPolygon,
  ScaleControl,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';

import { pathNames } from 'src/config/constants';
import { findPolygonCenter } from 'src/helpers/findPolygonCenter.ts';
import isPointInsidePolygon from 'src/helpers/isPointInsidePolygon.ts';
import { noHoverSupport } from 'src/helpers/noHoverSupport.ts';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { Field, FieldDetails } from 'src/types/Fields.ts';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import { FieldParametersTable } from 'src/pages/map-view/field-parameters/FieldParametersTable.tsx';
import { FieldSearch } from 'src/pages/map-view/FieldSearch.tsx';
import TooltipInfo from 'src/pages/map-view/TooltipInfo.tsx';
import { getColor, getIconKey } from 'src/pages/map-view/fieldMarkers.ts';
import AddFieldModal from 'src/pages/map-view/AddFieldModal.tsx';
import DrawControls from 'src/pages/map-view/DrawControls.tsx';
import useFields from 'src/pages/map-view/hooks/useFields.ts';
import AdminFieldInfo from 'src/pages/map-view/field-parameters/AdminFieldInfo.tsx';
import FieldParametersLayout from 'src/pages/map-view/field-parameters/FieldParameters.tsx';
import AgronomistFieldInfo from 'src/pages/map-view/field-parameters/AgronomistFieldInfo.tsx';
import { validateField } from 'src/pages/map-view/field-parameters/helpers/fieldValidator.ts';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'src/pages/map-view/styles/fields.css'
import { WarningMarker } from 'src/pages/map-view/Markers.tsx';
import { useUnit } from "src/context/hooks/useUnitContext.ts";


const MAP_URL: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ZOOM_LEVEL: number = 1
const INITIAL_MAP_POSITION: Pick<LatLng, 'lat' | 'lng'> = {
  lat: 0,
  lng: -70
}

const centerSelectedField = (field: Field, map: L.Map) => {
  const selectedFieldBounds = L.latLngBounds(field.area).pad(1);
  map.fitBounds(selectedFieldBounds, { paddingBottomRight: [0, 350], paddingTopLeft: [0, 0] });
}

function MapView() {
  const { id: fieldId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<Map>(undefined!);
  const mapWrapper = useRef<HTMLDivElement>(null)
  const isTabletDevice = useMediaQuery('only screen and (max-width : 1200px)');
  const { isAdmin, isAgronomist } = useCurrentUser();
  const { fields, createField, editField, isLoading } = useFields()
  const { isCurrentOrganizationLocked } = useCurrentOrganization()
  const [isModalOpen, showModal, hideModal] = useModal()
  const [selectedField, setSelectedField] = useState<Field>()
  const [hoveredFieldId, setHoveredFieldId] = useState<Field['id']>();
  const [drawingLayer, setDrawingLayer] = useState<PolygonClass | null>(null);
  const [isZoomClose, setIsZoomClose] = useState<boolean>(false);
  const isAgronomistPinsShown = isCurrentOrganizationLocked && isZoomClose && isAgronomist;
  const { unitSystem } = useUnit();

  useEffect(() => {
    const field = fields.find(({ id }) => id === fieldId)
    if (fieldId && field && mapRef.current) {
      centerSelectedField(field, mapRef.current)
    }
    setSelectedField(field)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, fields, mapRef.current])

  const handleCreate = async (fieldDetails: FieldDetails) => {
    if (!drawingLayer) return
    await createField({ ...fieldDetails, area: drawingLayer.getLatLngs()[0] as LatLng[] })
  }

  const handleCreationStarted = (e: DrawEvents.Created) => {
    const { layer } = e;

    if (!(layer instanceof PolygonClass)) return;
    setDrawingLayer(layer)
    showModal()
  }

  const handleCreationCanceled = () => {
    drawingLayer?.remove()
    hideModal()
  }

  const openFieldDetailsIfClickedOn = (e: LeafletMouseEvent) => {
    const { latlng } = e;
    const clickPoint: LatLngTuple = [latlng.lat, latlng.lng];

    const clickedOnPolygon = fields.some(({ area }) => {
      return isPointInsidePolygon(clickPoint, area);
    });

    if (!clickedOnPolygon) {
      navigate(pathNames.MAP_VIEW)
    }
  };

  const handleEditField = async (fieldDetails: FieldDetails) => {
    if (!selectedField) return
    const { id, area } = selectedField

    await editField({ id, area, ...fieldDetails })
  }

  const MapClickHandler = () => {
    mapRef.current = useMapEvents({
      click: (event) => {
        openFieldDetailsIfClickedOn(event);
      },
      zoomend: (event) => {
        setIsZoomClose(event.target.getZoom() >= 11)
      }
    });
    return null;
  };

  const toolbarIsShown = isTabletDevice && !selectedField || !isTabletDevice

  return (
    <Layout
      ref={mapWrapper}
      className={classNames('map-container', { 'overflow-scroll liftup': selectedField })}
    >
      <FieldSearch />
      <MapContainer
        ref={mapRef}
        center={INITIAL_MAP_POSITION}
        zoom={ZOOM_LEVEL}
        minZoom={4}
        zoomControl={false}
        attributionControl={false}
        maxBounds={new L.LatLngBounds(new L.LatLng(-180, 180), new L.LatLng(180, -180))}
      >
        <MapClickHandler />

        <TileLayer attribution="Satellite Map" url={MAP_URL} />
        {isLoading
          ? <Spin size="large" fullscreen />
          : fields.map((field: Field) => {
            const { id, area, crop } = field
            const center = findPolygonCenter(area);
            return (
              <Fragment key={id}>
                <Marker icon={getIconKey(id === hoveredFieldId, id === fieldId, crop)}
                        position={center}
                        eventHandlers={{
                          click: () => navigate(`${pathNames.MAP_VIEW}/${id}`),
                          mouseover: () => setHoveredFieldId(id),
                          mouseout: () => setHoveredFieldId(undefined),
                        }}
                >
                  {noHoverSupport() && (<TooltipInfo field={field} />)}
                </Marker>
                {validateField((field)).length !== 0 && isAdmin && (
                  <WarningMarker position={center} />
                )}
                {isAgronomistPinsShown && (
                  <>
                    {/*<RainMarker position={center} value={lastRainDays} />*/}
                    {/*<IrrigationMarker position={center} value={lastIrrigationDays} />*/}
                  </>
                )}
                <LeafletPolygon
                  pathOptions={{
                    weight: 3,
                    fillOpacity: id === fieldId ? 0.8 : 0.2,
                    color: getColor(crop)
                  }}
                  positions={area}
                  eventHandlers={{
                    click: () => navigate(`${pathNames.MAP_VIEW}/${id}`),
                  }} />
              </Fragment>
            )
          })
        }
        {toolbarIsShown && !isCurrentOrganizationLocked && isAdmin &&
          <DrawControls onCreated={handleCreationStarted}
                        onDrawStart={() => mapRef.current.removeEventListener('click')} />}
        {toolbarIsShown && <>
          <ZoomControl position="bottomright" />
          <ScaleControl
            position="bottomright"
            imperial={unitSystem === 'imperial'}
            metric={unitSystem === 'metric'}
          />
        </>}
      </MapContainer>
      <AddFieldModal
        hideModal={handleCreationCanceled}
        isModalOpen={isModalOpen}
        onSubmit={handleCreate}
      />
      {fieldId && selectedField && (
        isAdmin ? (
          <FieldParametersLayout>
            <AdminFieldInfo handleEdit={handleEditField} isLoading={isLoading} {...selectedField} />
            <FieldParametersTable isLoading={isLoading} {...selectedField} />
          </FieldParametersLayout>
        ) : (
          <FieldParametersLayout additionalClasses={['map-bottom-menu-wrapper__agronomist']}>
            <AgronomistFieldInfo {...selectedField} />
            <FieldParametersTable {...selectedField} />
          </FieldParametersLayout>
        )
      )}
    </Layout>
  )
}

export default MapView;
