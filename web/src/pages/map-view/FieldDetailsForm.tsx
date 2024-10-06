import { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { Crop } from 'src/types/Crops.ts';
import { Field } from 'src/types/Fields.ts';
import { Roles, User } from 'src/types/Users.ts';
import { FieldForm } from 'src/pages/map-view/AddFieldModal.tsx';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { CURRENT_DATE_FORMAT } from 'src/helpers/dateFormat.ts';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import usersAPI from 'src/api/usersAPI.ts';
import cropsAPI from 'src/api/cropsAPI.ts';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';

function FieldDetailsForm({ field }: { field?: Field }) {
  const { t } = useTranslation();
  const { isCurrentOrganizationLocked } = useCurrentOrganization();
  const { user } = useCurrentUser();
  const [users, setUsers] = useState<User[]>(!field || !field.agronomist ? [] : [field.agronomist]);
  const [crops, setCrops] = useState<Crop[]>(!field || !field.crop ? [] : [field.crop]);

  useEffect(() => {
    if (user) {
      usersAPI.getAll(Roles.AGRONOMIST, true).then((u) => setUsers([user, ...u]));
    }
    cropsAPI.getAll().then((c) => setCrops(c));
  }, [user]);

  return (
    <>
      <Form.Item<FieldForm>
        label={t('Field name')}
        name="name"
        rules={[{ required: true, message: t('Please input field name!') }]}
      >
        <Input size="large" placeholder={t('Enter field name')} />
      </Form.Item>

      <Form.Item<FieldForm>
        label={t('Agronomist')}
        name="agronomistId"
        rules={[{ required: true, message: t('Please input agronomist name!') }]}
      >
        <Select size="large" placeholder={t('Select agronomist')}>
          {users.map((a) =>
            <Select.Option key={a.id} value={a.id}>{getUserFullName(a) + (user?.id === a.id ? ' ('+t('me')+')' : '') }</Select.Option>
          )}
        </Select>
      </Form.Item>
      <Form.Item<FieldForm>
        hidden={isCurrentOrganizationLocked}
        label={t('Crop type')}
        name="cropId"
        rules={[{ required: true, message: t('Please input crop type!') }]}
      >
        <Select size="large" placeholder={t('Select crop type')}>
          {crops.map((c) =>
            <Select.Option key={c.id} value={c.id}>{t(c.id)}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item<FieldForm>
        hidden={isCurrentOrganizationLocked}
        label={t('Planting date')}
        name="plantedAt"
        rules={[{ required: true, message: t('Please input planting date!') }]}
      >
        <DatePicker
          format={CURRENT_DATE_FORMAT}
          inputReadOnly={true}
          size="large"
          placeholder={t('Select date')}
          className="full-width"
        />
      </Form.Item>
    </>
  )
}

export default FieldDetailsForm;
