import { Crop } from 'src/types/Crops.ts';
import { CategoryWithKey, Organization } from 'src/types/Organizations.ts';
import { Polygon as LeafletPolygon } from 'react-leaflet/Polygon';
import { LatLng } from 'leaflet';
import { User } from 'src/types/Users.ts';

export type Field = {
  id: string,
  name?: string,
  area: ReturnType<typeof LeafletPolygon.prototype.getLatLngs>,
  crop?: Crop,
  plantedAt?: string,
  agronomist?: User,
  organization: Organization,
  categories: CategoryWithKey[]
} & FieldParameters;

export type FieldDetails = {
  agronomistId: number
  cropId: string
  name: string
  plantedAt: string
  categories: CategoryWithKey[]
}

export type FieldDetailsWithArea  = FieldDetails & {
  area: LatLng[]
}

export type FieldParameters = {
  currentSoilWaterContent : string;
  forecastSoilWaterContent: string;
  currentRiskOfBogging: string;
  forecastRiskOfBogging: string;
  currentRiskOfWaterShortage: string;
  forecastRiskOfWaterShortage: string;

  expectedRain: string;
}
