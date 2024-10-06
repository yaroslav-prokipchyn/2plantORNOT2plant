import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Flex, Form, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import CenteredModal from 'src/components/common/CenteredModal.tsx';
import FieldDetailsForm from 'src/pages/map-view/FieldDetailsForm.tsx';
import CategoriesForm from 'src/pages/map-view/categories/CategoriesSelect.tsx';
import { Field, FieldDetails } from 'src/types/Fields.ts';
import {
  mapFieldCategoriesToFormValue,
  mapFieldCategoriesToPayload,
} from 'src/pages/map-view/categories/mapCategories.ts';
import { FieldForm } from 'src/pages/map-view/AddFieldModal.tsx';
import { getPayloadDate } from 'src/helpers/dateFormat.ts';
import useForm from 'src/components/common/hooks/useForm.ts';

import './styles/fields.css';

type FieldDetailsFormProps = {
  field: Field,
  isModalOpen: boolean
  hideModal: () => void
  onSubmit: (values: FieldDetails) => void
}

enum Tab {
  general = 'general',
  category = 'category'
}

const EditFieldModal = ({
                          field,
                          isModalOpen,
                          hideModal,
                          onSubmit,
                        }: FieldDetailsFormProps) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(Tab.general);
  const { form, allFieldsValid, validateFields, setFormInitialValues } = useForm<FieldForm>()

  useEffect(() => {
    if (!isModalOpen) return
    setCurrentTab(Tab.general)
    form.resetFields()

    if (field) {
      setFormInitialValues({
        ...mapFieldCategoriesToFormValue(field.categories),
        name: field.name,
        plantedAt: field.plantedAt ? dayjs(field.plantedAt) : undefined, //in case plantedDate is null
        cropId: field.crop?.id,
        agronomistId: field.agronomist?.id
      })
    }
  }, [isModalOpen, field, form, setFormInitialValues]);

  const onClose = () => hideModal()

  const validateForm = () => validateFields(['name', 'agronomistId', 'cropId', 'plantedAt'])

  const onFinish = async (fieldDetails: FieldForm) => {
    const { agronomistId, name, cropId, plantedAt, ...categories } = fieldDetails

    onSubmit({
      agronomistId,
      name,
      cropId,
      plantedAt: getPayloadDate(plantedAt),
      categories: Object.values(categories).length
        ? mapFieldCategoriesToPayload(categories)
        : field.categories
    })
    onClose()
  }

  const onTabChange = (key: string) => setCurrentTab(key as Tab)

  const tabs: TabsProps['items'] = [
    {
      key: Tab.general,
      label: t('General'),
      children: <FieldDetailsForm field={field} />
    },
    {
      key: Tab.category,
      label: t('Category'),
      children: <CategoriesForm />,
    },
  ]

  return (
    <CenteredModal
      title={t('Edit field')}
      open={isModalOpen}
      onCancel={onClose}
      footer={() => (
        <Flex gap="small" align="center" justify="end">
          <Button onClick={onClose} size="large">{t('Cancel')}</Button>
          <Button
            onClick={form.submit}
            type="primary"
            size="large"
            disabled={!allFieldsValid}
          >
            {t('Save')}
          </Button>
        </Flex>
      )}
    >
      <Form
        form={form}
        className="form__field-details"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={validateForm}
      >
        <Tabs
          defaultActiveKey={Tab.general}
          activeKey={currentTab}
          items={tabs}
          onChange={onTabChange}
        />
      </Form>
    </CenteredModal>
  );
};


export default EditFieldModal;
