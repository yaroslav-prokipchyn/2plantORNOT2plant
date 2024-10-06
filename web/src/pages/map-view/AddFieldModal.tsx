import { useEffect, useState } from 'react';
import { Button, Flex, Form, Steps as AntdSteps } from 'antd';
import { Dayjs } from 'dayjs';

import FieldDetailsForm from 'src/pages/map-view/FieldDetailsForm.tsx';
import CenteredModal from 'src/components/common/CenteredModal.tsx';
import { mapFieldCategoriesToPayload } from 'src/pages/map-view/categories/mapCategories.ts';
import CategoriesSelect, { CategoryForm } from 'src/pages/map-view/categories/CategoriesSelect.tsx';
import { FieldDetails } from 'src/types/Fields.ts';
import { getPayloadDate } from 'src/helpers/dateFormat';
import useForm from 'src/components/common/hooks/useForm.ts';

import './styles/fields.css';
import { useTranslation } from 'react-i18next';

export type FieldForm = CategoryForm & {
  name: string;
  agronomistId: number;
  cropId: string;
  plantedAt: Dayjs;
}

type FieldDetailsFormProps = {
  isModalOpen: boolean
  hideModal: () => void
  onSubmit: (values: FieldDetails) => void
}

enum Steps {
  general,
  category
}

const AddFieldModal = ({ isModalOpen, hideModal, onSubmit, }: FieldDetailsFormProps) => {
    const [currentStep, setCurrentStep] = useState(Steps.general);
    const { form, allFieldsValid, validateFields } = useForm<FieldForm>()
    const { t } = useTranslation();
    const validateForm = () => validateFields(['name', 'agronomistId', 'cropId', 'plantedAt'])

    useEffect(() => {
      if (!isModalOpen) return

      form.resetFields()
      setCurrentStep(Steps.general)
    }, [isModalOpen, form]);

    const onClose = () => hideModal()

    const onFinish = async (values: FieldForm) => {
      const { name, cropId, plantedAt, agronomistId, ...categories } = values

      onSubmit({
        name,
        cropId,
        agronomistId,
        plantedAt: getPayloadDate(plantedAt),
        categories: mapFieldCategoriesToPayload(categories),
      })
      onClose()
    }

    const handleNextStep = (step: Steps) => {
      switch (step) {
        case Steps.general:
          return setCurrentStep(step)
        case Steps.category:
          return allFieldsValid && setCurrentStep(step)
      }
    }

    const steps = [
      {
        key: 'General',
        title: t('General'),
        isHidden: currentStep !== Steps.general,
        buttonText: t('Next'),
        onClick: () => handleNextStep(Steps.category)
      },
      {
        key: 'Category',
        title: t('Category'),
        isHidden: currentStep !== Steps.category,
        buttonText: t('Create'),
        onClick: form.submit
      },
    ]

    return (
      <CenteredModal
        title={t('Create field')}
        open={isModalOpen}
        onCancel={onClose}
        footer={() => (
          <Flex gap="small" align="center" justify="end">
            <Button onClick={onClose} size="large">{t('Cancel')}</Button> {/* Placeholder for cancel button */}
            <Button
              onClick={steps[currentStep].onClick}
              type="primary"
              size="large"
              disabled={!allFieldsValid}
            >
              {steps[currentStep].buttonText}
            </Button>
          </Flex>
        )}
      >
        <AntdSteps
          responsive
          size="small"
          current={currentStep}
          onChange={handleNextStep}
          className="steps__add-field"
          items={steps.map(({ key, title }) => ({ key, title }))}
        />
        <Form
          form={form}
          className="form__field-details"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
          hidden={steps[currentStep].isHidden}
          onValuesChange={validateForm}
        >
          <Form.Item hidden={steps[Steps.general].isHidden}>
            <FieldDetailsForm />
          </Form.Item>
          <Form.Item hidden={steps[Steps.category].isHidden}>
            <CategoriesSelect />
          </Form.Item>
        </Form>
      </CenteredModal>
    );
  }
;

export default AddFieldModal;
