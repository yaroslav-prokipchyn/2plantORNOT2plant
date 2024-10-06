import { useEffect, useState } from 'react';
import { Button, Flex, Form, Tabs, TabsProps } from 'antd';

import useForm from 'src/components/common/hooks/useForm.ts';
import CenteredModal from 'src/components/common/CenteredModal.tsx';
import OrganizationDetailFormItems from 'src/pages/super-admin/OrganizationDetailFormItems.tsx';
import AdminDetailFormItems from 'src/pages/super-admin/AdminDetailFormItems.tsx';
import CategoryFormItems from 'src/pages/super-admin/CategoryFormItems.tsx';
import { OrganizationWithAdmin, OrganizationWithAdmins } from 'src/types/Organizations.ts';
import { OrganizationDetails } from 'src/pages/super-admin/AddOrganizationModal.tsx';
import {
  mapSuperAdminCategoriesToFormValue,
  mapSuperAdminCategoriesToPayload
} from 'src/pages/super-admin/mapOrganizationCategories.ts';

import './super-admin.css'
import { useTranslation } from "react-i18next";

type EditOrganizationModalProps = {
  organization: OrganizationWithAdmins,
  isModalOpen: boolean
  onHide: () => void
  onSubmit: (values: OrganizationWithAdmin) => void
}

enum Tab {
  general = 'general',
  admin = 'admin',
  category = 'category'
}

const EditOrganizationModal = ({
  organization,
  isModalOpen,
  onHide,
  onSubmit
}: EditOrganizationModalProps) => {
  const [currentTab, setCurrentTab] = useState(Tab.general);
  const { form, allFieldsValid, validateFields, setFormInitialValues } = useForm<OrganizationDetails>()
  const { t } = useTranslation();

  useEffect(() => {
    if (!isModalOpen) return
    setCurrentTab(Tab.general)
    form.resetFields()

    if (organization) {
      setFormInitialValues({
        ...organization,
        firstName: organization.admins[0].firstName,
        lastName: organization.admins[0].lastName,
        email: organization.admins[0].email,
        ...mapSuperAdminCategoriesToFormValue(organization.categories)
      })
    }
  }, [isModalOpen, organization, form, setFormInitialValues]);

  const onClose = () => onHide()

  const validateForm = () => {
    validateFields(['name', 'phone', 'address', 'firstName', 'lastName'])
  }

  const onFinish = async (organizationDetails: OrganizationDetails) => {
    const { name, phone, firstName, address, lastName, email, ...categories } = organizationDetails

    onSubmit({
      id: organization.id,
      locked: organization.locked,
      lockedAt: organization.lockedAt,
      phone: phone ?? organization.phone,
      name: name ?? organization.name,
      address: address ?? organization.address,
      firstName: firstName ?? organization.admins[0].firstName,
      lastName: lastName ?? organization.admins[0].lastName,
      email: email ?? organization.admins[0].email,
      categories: Object.values(categories).length
        ? mapSuperAdminCategoriesToPayload(categories)
        : organization.categories
    })
    onClose()
  }

  const onTabChange = (key: string) => setCurrentTab(key as Tab)

  const tabs: TabsProps['items'] = [
    {
      key: Tab.general,
      label: t('General'),
      children: <OrganizationDetailFormItems />
    },
    {
      key: Tab.admin,
      label: t('Admin'),
      children: <AdminDetailFormItems editMode={true} />,
    },
    {
      key: Tab.category,
      label: t('Category'),
      children: <CategoryFormItems />,
    },
  ]

  return (
    <CenteredModal
      forceRender
      title={t('Edit organization')}
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
        className={
          currentTab === Tab.category
            ? 'super-admin__category-form'
            : 'super-admin__form'
        }
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


export default EditOrganizationModal;
