import { useCallback, useEffect } from 'react';
import { Button, Flex, Form, Input } from 'antd';
import useForm from 'src/components/common/hooks/useForm.ts';
import Modal from 'src/components/common/CenteredModal.tsx';
import { User } from 'src/types/Users.ts';

import './agronomists.css'
import { useTranslation } from "react-i18next";

type AgronomistForm = Pick<User, 'firstName' | 'lastName' | 'email'>

type AgronomistDetailsModalProps = {
  agronomist: User | undefined,
  isModalOpen: boolean
  hideModal: () => void
  onSubmit: (values: AgronomistForm) => void
}

const AgronomistDetailsModal = ({
                                  agronomist,
                                  isModalOpen,
                                  hideModal,
                                  onSubmit
                                }: AgronomistDetailsModalProps) => {
  const { form, allFieldsValid, validateFields } = useForm<AgronomistForm>();
  const { t } = useTranslation()
  const setFormInitialValues = useCallback(() => {
    if (!agronomist) {
      return form.resetFields()
    }
    form.setFieldsValue(agronomist)
  }, [agronomist, form])

  useEffect(() => {
    setFormInitialValues()
  }, [setFormInitialValues])

  const validateForm = () => validateFields()

  const handleFinish = async (values: AgronomistForm) => {
    onSubmit(values)
    hideModal()
    form.resetFields()
  }

  const onCancel = () => {
    hideModal()
    setFormInitialValues()
  }

  return (
    <Modal
      forceRender={true}
      title={`${agronomist ? t('Edit agronomist') : t('Add agronomist')}`}
      open={isModalOpen}
      onCancel={onCancel}
      footer={() => (
        <Flex gap="12px" align="center" justify="end">
          <Button onClick={onCancel} size="large">{t('Cancel')}</Button>
          <Button
            onClick={form.submit}
            type="primary"
            size="large"
            disabled={!allFieldsValid}
          >
            {agronomist ? t('Save') : t('Add')}
          </Button>
        </Flex>
      )}
    >
      <Form
        className="super-admin__form"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
        onValuesChange={validateForm}
      >
        <Form.Item<AgronomistForm>
          label={t('First name')}
          name="firstName"
          rules={[{ required: true, message: t('Please input agronomist First name!') }]}
        >
          <Input size="large" placeholder={t('Enter agronomist First name')} />
        </Form.Item>

        <Form.Item<AgronomistForm>
          label={t('Last name')}
          name="lastName"
          rules={[{ required: true, message: t('Please input agronomist Last name!') }]}
        >
          <Input size="large" placeholder={t('Enter agronomist Last name')} />
        </Form.Item>

        <Form.Item<AgronomistForm>
          label={t('Email')}
          name="email"
          rules={[
            {
              type: 'email',
              message: t('The input is not valid email!'),
            },
            {
              required: true,
              message: t('Please input agronomist email!')
            }]}>
          <Input disabled={!!agronomist} size="large" placeholder={t('Enter agronomist email')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AgronomistDetailsModal
