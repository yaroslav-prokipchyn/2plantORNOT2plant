import { CATEGORY_COLORS, CATEGORY_KEYS } from 'src/config/constants.ts';

const ColorIndicator = ({ categoryKey }: { categoryKey: CATEGORY_KEYS }) => (
  <span
    className="category__color-indicator"
    style={{ backgroundColor: CATEGORY_COLORS[categoryKey] }}
  />
)

export default ColorIndicator