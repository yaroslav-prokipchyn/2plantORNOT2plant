import { useState } from 'react';
import { Button, Flex, Form, Steps as AntdSteps } from 'antd';

import CenteredModal from 'src/components/common/CenteredModal.tsx';
import CategoryFormItems from 'src/pages/super-admin/CategoryFormItems.tsx';
import OrganizationDetailFormItems from 'src/pages/super-admin/OrganizationDetailFormItems.tsx';
import AdminDetailFormItems from 'src/pages/super-admin/AdminDetailFormItems.tsx';
import useForm from 'src/components/common/hooks/useForm.ts';
import { CategoryWithKey } from 'src/types/Organizations.ts';
import {
  mapSuperAdminCategoriesToPayload,
  OrganizationCategories
} from 'src/pages/super-admin/mapOrganizationCategories.ts';

import './super-admin.css'
import { useTranslation } from "react-i18next";

export type OrganizationDetails = {
  name: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AddOrganizationModalProps = {
  isModalOpen: boolean
  onHide: () => void
  onSubmit: (values: OrganizationDetails & { categories: CategoryWithKey[] }) => void
}

enum Steps {
  general,
  admin,
  category
}

const AddOrganizationModal = ({ isModalOpen, onHide, onSubmit, }: AddOrganizationModalProps) => {
    const {
      form,
      allFieldsValid,
      validateFields,
      fieldsValueArePresent
    } = useForm<OrganizationDetails>()
    const { t } = useTranslation()
    const [currentStep, setCurrentStep] = useState(Steps.general);

    const steps = [
      {
        key: 'general',
        title: t('General'),
        buttonText: t('Next'),
        isHidden: currentStep !== Steps.general,
        onClick: () => handleNextStep(Steps.admin),
        areValuesValid: () => fieldsValueArePresent(['name', 'phone', 'address'])
      },
      {
        key: 'admin',
        title: t('Admin'),
        buttonText: t('Next'),
        isHidden: currentStep !== Steps.admin,
        onClick: () => handleNextStep(Steps.category),
        areValuesValid: () => (fieldsValueArePresent(['firstName', 'lastName', 'email']) && allFieldsValid)
      },
      {
        key: 'categories',
        title: t('Categories'),
        buttonText: t('Add'),
        isHidden: currentStep !== Steps.category,
        onClick: form.submit,
        areValuesValid: () => true
      },
    ]

    const validateForm = () => {
      validateFields(['name', 'phone', 'address', 'firstName', 'lastName', 'email'])
    }

    const onClose = () => {
      onHide()
      form.resetFields()
      setCurrentStep(Steps.general)
    }

    const handleFinish = async (values: OrganizationDetails & OrganizationCategories) => {
      const { name, phone, address, firstName, lastName, email, ...categories } = values

      onSubmit({
        name, phone, address, firstName, lastName, email,
        categories: mapSuperAdminCategoriesToPayload(categories)
      })
      onClose()
    }

    function handleNextStep(step: Steps) {
      if (currentStep > step || steps[currentStep].areValuesValid()) {
        setCurrentStep(step)
      }
    }

    return (
      <CenteredModal
        forceRender
        title={t('Add organization')}
        open={isModalOpen}
        onCancel={onClose}
        footer={() => (
          <Flex gap="small" align="center" justify="end">
            <Button onClick={onClose} size="large">{t('Cancel')}</Button>
            <Button
              onClick={steps[currentStep].onClick}
              type="primary"
              size="large"
              disabled={!steps[currentStep].areValuesValid()}
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
          items={steps.map(({ key, title }) => ({ key, title }))}
        />
        <Form
          form={form}
          className={
            currentStep === Steps.category
              ? 'super-admin__category-form'
              : 'super-admin__form'
          }
          layout="vertical"
          autoComplete="off"
          onFinish={handleFinish}
          onValuesChange={validateForm}
        >
          <Flex vertical hidden={steps[Steps.general].isHidden}>
            <OrganizationDetailFormItems />
          </Flex>
          <Flex vertical hidden={steps[Steps.admin].isHidden}>
            <AdminDetailFormItems />
          </Flex>
          <Flex vertical hidden={steps[Steps.category].isHidden}>
            <CategoryFormItems />
          </Flex>
        </Form>
      </CenteredModal>
    );
  }
;

export default AddOrganizationModal;
