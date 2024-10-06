import { Fragment, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Button, Flex, Space, Spin, TableColumnProps, Tooltip, Typography } from 'antd';
import SuperAdminDashboardMobile from 'src/pages/super-admin/mobile/SuperAdminDashboardMobile.tsx';
import useOrganizations from 'src/pages/super-admin/hooks/useOrganizations.ts';
import LargeTableWithScroll from 'src/components/common/table/LargeTableWithScroll.tsx';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { mapOrganizationAdmin } from 'src/pages/super-admin/mapOrganizationAdmin.ts';
import { OrganizationWithAdmins } from 'src/types/Organizations.ts';
import AddOrganizationModal from 'src/pages/super-admin/AddOrganizationModal.tsx';
import EditOrganizationModal from 'src/pages/super-admin/EditOrganizationModal.tsx';

import './super-admin.css'
import useConfirmationModal from 'src/components/common/ConfirmationModal';
import { useTranslation } from "react-i18next";

function SuperAdminDashboard() {
  const {
    isLoading,
    organizations,
    createOrganization,
    editOrganization,
    deleteOrganization
  } = useOrganizations()
  const [isModalOpen, showModal, hideModal] = useModal()
  const modal = useConfirmationModal()
  const [editingOrganization, setEditingOrganization] = useState<OrganizationWithAdmins>()
  const isMobileDevice = useMediaQuery('only screen and (max-width : 925px)');
  const { t } = useTranslation()

  const handleShowEditModal = (id: string) => {
    const organization = organizations.find((o) => o.id === id)
    if (!organization) return
    setEditingOrganization(organization)
    showModal()
  }

  const handleHideModal = () => {
    setEditingOrganization(undefined)
    hideModal()
  }

  const handleShowDeleteConfirm = async (organization: OrganizationWithAdmins) => {
    modal.delete({
      title: t('Delete the organization?'),
      content: t('The organization will be deleted. You will not be able to recover it.', { name: organization.name }),
      onOk: () => deleteOrganization(organization)
    })
  }

  const columns: Array<TableColumnProps<OrganizationWithAdmins>> = [
    {
      title: t('Organization'),
      dataIndex: 'name',
      key: 'name',
      width: '17%'
    },
    {
      title: t('Phone number'),
      dataIndex: 'phone',
      key: 'phone',
      width: '13%'
    },
    {
      title: t('Address'),
      dataIndex: 'address',
      key: 'address',
      width: '25%'
    },
    {
      title: t('Administrator assignment'),
      key: 'name',
      width: '25%',
      render: (_, record) => mapOrganizationAdmin(record, getUserFullName)
    },
    {
      title: t('Administrator email'),
      dataIndex: 'email',
      key: 'email',
      width: '15%',
      render: (_, record) => mapOrganizationAdmin(record, u => u.email)
    },
    {
      title: '',
      width: '5%',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t('Edit')}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleShowEditModal(record.id)} />
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleShowDeleteConfirm(record)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Fragment>
      {modal.contextHolder}
      <Spin spinning={isLoading} fullscreen size="large" />
      {isMobileDevice ? (
        <SuperAdminDashboardMobile
          handleAddOrganization={showModal}
          handleDeleteOrganization={() => {}}
          handleEditOrganization={handleShowEditModal}
          organizations={organizations}
        />
      ) : (
        <Flex vertical>
          <Flex className="super-admin__header" justify="space-between" align="center">
            <Typography.Title level={3}>{t('Nave Analytics')}</Typography.Title>
          </Flex>
          <Flex vertical className="super-admin__container">
            <Flex className="super-admin__button" justify="end" align="center">
              <Button onClick={showModal} size="large" type="primary">
                {t('+ Add organization')}
              </Button>
            </Flex>
            <LargeTableWithScroll
              rowKey="id"
              dataSource={organizations}
              columns={columns}
              height="calc(100vh - 256px)"
            />
          </Flex>
        </Flex>
      )}
      <AddOrganizationModal
        isModalOpen={isModalOpen && !editingOrganization}
        onHide={handleHideModal}
        onSubmit={createOrganization}
      />
      {editingOrganization && <EditOrganizationModal
        organization={editingOrganization}
        isModalOpen={isModalOpen}
        onHide={handleHideModal}
        onSubmit={editOrganization}
      />}

    </Fragment>
  )
}

export default SuperAdminDashboard;
