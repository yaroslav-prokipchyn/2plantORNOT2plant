import { Empty, Form, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import ColorIndicator from 'src/pages/map-view/categories/CategoryColorIndicator.tsx';

export type CategoryForm = {
  [key: string]: unknown;
}

function CategoriesSelect() {
  const { t } = useTranslation();
  const { currentOrganization } = useCurrentOrganization();

  if (!currentOrganization?.categories.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('There are no categories in the organization')} />
    );
  }

  return (
    currentOrganization?.categories.map((category) => {
      return (
        <Form.Item<CategoryForm>
          key={category.key}
          name={category.name}
          label={
            <Space align="center">
              <ColorIndicator categoryKey={category.key} />
              <Typography.Text
                ellipsis={{ tooltip: { zIndex: 100000 } }}
                style={{ maxWidth: 345 }}
              >
                {category.name}
              </Typography.Text>
            </Space>
          }
        >
          <Select
            className="full-width"
            placeholder={t('Select option')}
            size="large"
            allowClear={true}
          >
            {category.allowedOptions?.map((option) => (
              <Select.Option key={option} value={`${category.key}:${option}`}>{option}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    })
  );
}

export default CategoriesSelect;
