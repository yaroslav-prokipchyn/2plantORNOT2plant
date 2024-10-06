import L from 'leaflet';
import { CROPS } from 'src/config/constants';
import { Crop } from 'src/types/Crops.ts';

type Markers = {
  [key: string]: {
    icon:{
      default: L.Icon,
      hover: L.Icon,
      selected: L.Icon,
    },
    color: string
  }
}

const cerealMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/cereal.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const beetsMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/beets.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cottonMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/cotton.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cornMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/corn.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const soybeanMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/soybean.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const potatoMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/potato.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const defaultMarkerIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/default/default.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cerealMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/cereal.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const beetsMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/beets.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cottonMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/cotton.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cornMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/corn.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const soybeanMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/soybean.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const potatoMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/potato.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const defaultMarkerHoverIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/hover/default.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cerealMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/cereal.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const beetsMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/beets.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cottonMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/cotton.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const cornMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/corn.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const soybeanMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/soybean.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const potatoMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/potato.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

const defaultMarkerSelectedIcon = new L.Icon({
  iconUrl: new URL('src/assets/crop-markers/selected/default.svg', import.meta.url).href,
  iconSize: new L.Point(45, 45, true),
});

export const getIconKey = (isHover: boolean, isSelected: boolean, crop?: Crop ) => {
  if (isHover) {
    return FIELD_MARKERS[crop?.id ?? 'default'].icon['hover']
  }
  else if (isSelected) {
    return FIELD_MARKERS[crop?.id ?? 'default'].icon['selected']
  }
  return FIELD_MARKERS[crop?.id ?? 'default'].icon["default"]
}

export const getColor = (crop?: Crop) => FIELD_MARKERS[crop?.id ?? 'default'].color


const FIELD_MARKERS: Markers = {
 [CROPS.CEREAL]: {
    icon: {
      default: cerealMarkerIcon,
      hover: cerealMarkerHoverIcon,
      selected: cerealMarkerSelectedIcon,
    },
    color: '#FAAD14'
  },
  [CROPS.BEETS]: {
    icon:{
      default:  beetsMarkerIcon,
      hover:  beetsMarkerHoverIcon,
      selected:  beetsMarkerSelectedIcon,
    },
    color: '#FA541C'
  },
  [CROPS.COTTON]: {
    icon:{
      default:  cottonMarkerIcon,
      hover:  cottonMarkerHoverIcon,
      selected:  cottonMarkerSelectedIcon,
    }, 
    color: '#13C2C2'
  },
  [CROPS.CORN]: {
    icon:{
      default:   cornMarkerIcon,
      hover:  cornMarkerHoverIcon,
      selected:   cornMarkerSelectedIcon,
    }, 
    color: '#FADB14'
  },
  [CROPS.SOYBEAN]: {
    icon:{
      default:   soybeanMarkerIcon,
      hover: soybeanMarkerHoverIcon,
      selected:   soybeanMarkerSelectedIcon,
    },  
    color: '#A0D911'
  },
  [CROPS.POTATOES]: {
    icon:{
      default:   potatoMarkerIcon,
      hover: potatoMarkerHoverIcon,
      selected:   potatoMarkerSelectedIcon,
    },  
    color: '#FA8C16'
  },
  'default': {
    icon:{
      default:   defaultMarkerIcon,
      hover:   defaultMarkerHoverIcon,
      selected:   defaultMarkerSelectedIcon,
    },
    color: '#4096FF'
  }
}
