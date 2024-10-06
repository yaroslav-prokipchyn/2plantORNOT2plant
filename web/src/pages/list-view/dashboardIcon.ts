import { CROPS } from 'src/config/constants';
import beetsIcon from 'src/assets/crop-icons/beets.svg';
import cerealIcon from 'src/assets/crop-icons/cereal.svg';
import cottonIcon from 'src/assets/crop-icons/cotton.svg';
import potatoesIcon from 'src/assets/crop-icons/potatoes.svg';
import cornIcon from 'src/assets/crop-icons/corn.svg';
import soybeanIcon from 'src/assets/crop-icons/soybean.svg';
import defaultIcon from 'src/assets/crop-icons/default.svg';
import { Crop } from 'src/types/Crops.ts';

export const CROP_ICONS: Record<string, string> = {
    [CROPS.BEETS]: beetsIcon,
    [CROPS.CEREAL]: cerealIcon,
    [CROPS.COTTON]: cottonIcon,
    [CROPS.POTATOES]: potatoesIcon,
    [CROPS.CORN]: cornIcon,
    [CROPS.SOYBEAN]: soybeanIcon,
    'default': defaultIcon,
};

export const getIconSrc = (crop?: Crop) => CROP_ICONS[crop?.id ?? 'default'];
