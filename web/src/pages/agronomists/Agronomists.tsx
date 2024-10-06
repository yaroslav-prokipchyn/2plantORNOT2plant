import { Fragment, useState } from 'react';
import { Button, Checkbox, Flex, Space, Spin, TableColumnProps, Tooltip, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import LargeTableWithScroll from 'src/components/common/table/LargeTableWithScroll.tsx';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import useConfirmationModal from 'src/components/common/ConfirmationModal.tsx';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { User } from 'src/types/Users.ts';

import './agronomists.css'
import AgronomistDetailsModal from 'src/pages/agronomists/AgronomistDetailsModal.tsx';
import useAgronomists, { AgronomistDetails } from 'src/pages/agronomists/hooks/useAgronomists.ts';
import { useTranslation } from 'react-i18next';

function Agronomists() {
  const navigate = useNavigate()
  const {
    agronomists,
    createAgronomist,
    editAgronomist,
    deleteAgronomist,
    editAgronomistStatus,
    isLoading,
  } = useAgronomists()
  const { currentOrganization } = useCurrentOrganization()
  const { t } = useTranslation()
  const [isModalOpen, showModal, hideModal] = useModal()
  const [editingAgronomist, setEditingAgronomist] = useState<User>()
  const modal = useConfirmationModal()

  const handleExit = () => navigate(-1)

  const handleAddAgronomist = async () => {
    setEditingAgronomist(undefined)
    showModal()
  }

  const handleEditAgronomist = async (id: number) => {
    const agronomist = agronomists.find((o) => o.id === id)
    if (!agronomist) return
    setEditingAgronomist(agronomist)
    showModal()
  }

  const handleDeleteAgronomist = async (id: number) => {
    const agronomist = agronomists.find((o) => o.id === id)
    if (!agronomist) return

    modal.delete({
      title: t('Delete the agronomist?'),
      content: t('The agronomist will be deleted. You will not be able to recover it.', { name: getUserFullName(agronomist) }),
      onOk: () => deleteAgronomist(agronomist),
    })
  }

  const handleAgronomistAccess = (agronomist: User) => {
    const title = agronomist.active ? t('Turn off access?') : t('Turn on access?')
    const content = agronomist.active
      ? t('The agronomist will not have access to the application. You can turn on access anytime.', { name: getUserFullName(agronomist) })
      : t('The agronomist will have access to the application. You can turn off access anytime.', { name: getUserFullName(agronomist) })

    modal.confirm({
      title,
      content,
      onOk: () => editAgronomistStatus(agronomist)
    })
  }

  const handleSubmitForm = async (agronomistDetails: AgronomistDetails) => {
    editingAgronomist
      ? await editAgronomist({ ...editingAgronomist, ...agronomistDetails })
      : await createAgronomist(agronomistDetails)
  }

  const columns: Array<TableColumnProps<User>> = [
    {
      title: t('Name'),
      key: 'name',
      render: (name: User) => getUserFullName(name) || t('Unassigned')
    },
    {
      title: t('Email'),
      dataIndex: 'email',
      key: 'email',
      render: (email: User['email']) => email || t('Unassigned')
    },
    {
      title: t('Access'),
      key: 'access',
      dataIndex: 'access',
      render: (_, agronomist) => <Checkbox
        onClick={() => handleAgronomistAccess(agronomist)}
        checked={agronomist.active} />
    },
    {
      title: '',
      width: '10%',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t('Edit')}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditAgronomist(record.id)} />
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAgronomist(record.id)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  if (!currentOrganization) return <Spin size="large" fullscreen />

  return (
    <Fragment>
      {modal.contextHolder}
      <Flex vertical>
        <Flex className="agronomists__header" justify="space-between" align="center">
          <Typography.Title level={3}>{t('Nave Analytics')}</Typography.Title>
          <Button onClick={handleExit} size="large" type="default">
            {t('Exit')}
          </Button>
        </Flex>
        <Flex vertical className="agronomists__container">
          <Flex
            className="agronomists__container-header"
            justify="space-between"
            align="center">
            <Typography.Title level={2}>{currentOrganization.name}</Typography.Title>
            <Button onClick={handleAddAgronomist} size="large" type="primary">
              {t('+ Add agronomist')}
            </Button>
          </Flex>
          <LargeTableWithScroll
            rowKey="id"
            loading={isLoading}
            dataSource={agronomists}
            columns={columns}
            height="calc(100vh - 256px)"
          />
        </Flex>
      </Flex>
      <AgronomistDetailsModal
        agronomist={editingAgronomist}
        isModalOpen={isModalOpen}
        hideModal={hideModal}
        onSubmit={handleSubmitForm}
      />
    </Fragment>
  )
}

export default Agronomists;
