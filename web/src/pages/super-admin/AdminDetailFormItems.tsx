import { OrganizationDetails } from 'src/pages/super-admin/AddOrganizationModal.tsx';
import { Form, Input } from 'antd';
import { useTranslation } from "react-i18next";

const AdminDetailFormItems = ({ editMode }: { editMode?: boolean }) => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item<OrganizationDetails>
        label={t('Admin First name')}
        name="firstName"
        rules={[{ required: true, message: t('Please input admin First name!') }]}
      >
        <Input size="large" placeholder={t('Enter admin First name')} />
      </Form.Item>

      <Form.Item<OrganizationDetails>
        label={t('Admin Last name')}
        name="lastName"
        rules={[{ required: true, message: t('Please input admin Last name!') }]}
      >
        <Input size="large" placeholder={t('Enter admin Last name')} />
      </Form.Item>

      <Form.Item<OrganizationDetails>
        label={t('Admin email')}
        name="email"
        rules={[
          {
            type: 'email',
            message: t('The input is not valid email!'),
          },
          {
            required: true,
            message: t('Please input admin email!')
          }]}>
        <Input disabled={editMode} size="large" placeholder={t('Enter admin email')} />
      </Form.Item>
    </>
  );
};

export default AdminDetailFormItems;
