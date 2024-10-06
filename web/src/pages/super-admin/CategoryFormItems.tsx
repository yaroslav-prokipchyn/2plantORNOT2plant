import { Flex, Form, Input, Select, Space } from 'antd';
import { CATEGORY_KEYS } from 'src/config/constants.ts';
import ColorIndicator from 'src/pages/map-view/categories/CategoryColorIndicator.tsx';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const CATEGORY_ITEMS = () => [
  {
    label: t('Category 1'),
    key: CATEGORY_KEYS.category_1
  },
  {
    label: t('Category 2'),
    key: CATEGORY_KEYS.category_2
  },
  {
    label: t('Category 3'),
    key: CATEGORY_KEYS.category_3
  },
  {
    label: t('Category 4'),
    key: CATEGORY_KEYS.category_4
  },
  {
    label: t('Category 5'),
    key: CATEGORY_KEYS.category_5
  }
]

const CategoryFormItem = ({ categoryKey, label }: { label: string, categoryKey: CATEGORY_KEYS }) => {
  const form = Form.useFormInstance()
  const categoryName = Form.useWatch(categoryKey)
  const options = Form.useWatch(`${categoryKey}:allowedOptions`)
  const { t } = useTranslation()

  const handleBlur = () => {
    if (!categoryName) {
      form.resetFields([`${categoryKey}:allowedOptions`])
    }
  }

  return (
    <Flex key={categoryKey} gap={16} justify="space-between" align="end">
      <Form.Item
        name={categoryKey}
        label={
          <Space align="center">
            <ColorIndicator categoryKey={categoryKey} />
            {label}
          </Space>
        }>
        <Input
          onBlur={handleBlur}
          style={{ textOverflow: 'ellipsis' }}
          size="large"
          placeholder={t('Enter category')}
        />
      </Form.Item>

      <Form.Item name={`${categoryKey}:allowedOptions`}>
        <Select
          disabled={!categoryName && !options}
          size="large"
          mode="tags"
          placeholder={t('Enter options')}
          maxTagCount="responsive"
          className="full-width"
        />
      </Form.Item>
    </Flex>
  )
}

const CategoryFormItems = () => {
  return (
    CATEGORY_ITEMS().map((props) => <CategoryFormItem {...props} categoryKey={props.key} />)
  );
};


export default CategoryFormItems;
