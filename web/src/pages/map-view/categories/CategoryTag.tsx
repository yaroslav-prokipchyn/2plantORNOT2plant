import { Tag, TagProps, Typography } from 'antd';
import { CATEGORY_KEYS } from 'src/config/constants.ts';

const TAG_COLORS: Record<string, string> = {
  [CATEGORY_KEYS.category_1]: 'blue',
  [CATEGORY_KEYS.category_2]: 'cyan',
  [CATEGORY_KEYS.category_3]: 'green',
  [CATEGORY_KEYS.category_4]: 'volcano',
  [CATEGORY_KEYS.category_5]: 'orange',
};

type CategoryTagProps = TagProps & {
  categoryKey: CATEGORY_KEYS,
  label: string
}

const CategoryTag = ({ categoryKey, label, ...props }: CategoryTagProps) => {
  return (
    <Tag className="category-tag" color={TAG_COLORS[categoryKey]} {...props}>
      <Typography.Text ellipsis={{ tooltip: { zIndex: 100000 } }}>{label}</Typography.Text>
    </Tag>
  )
}

export default CategoryTag
