import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { OrganizationDetails } from 'src/pages/super-admin/AddOrganizationModal.tsx';

const OrganizationDetailFormItems = () => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item<OrganizationDetails>
        label={t('Name')}
        name="name"
        rules={[{ required: true, message: t('Please input organization name!') }]}
      >
        <Input size="large" placeholder={t('Enter name')} />
      </Form.Item>

      <Form.Item<OrganizationDetails>
        label={t('Phone number')}
        name="phone"
        rules={[{ required: true, message: t('Please input phone number!') }]}
      >
        <Input size="large" placeholder={t('Enter phone number')} />
      </Form.Item>

      <Form.Item<OrganizationDetails>
        label={t('Address')}
        name="address"
        rules={[{ required: true, message: t('Please input address!') }]}
      >
        <Input size="large" placeholder={t('Enter address')} />
      </Form.Item>
    </>
  );
};

export default OrganizationDetailFormItems;
