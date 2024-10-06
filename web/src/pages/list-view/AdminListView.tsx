import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { App, Button, Flex, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  LineChartOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

import { pathNames } from 'src/config/constants';
import LargeTableWithScroll from 'src/components/common/table/LargeTableWithScroll.tsx';
import OrganizationStatusTag from 'src/pages/list-view/OrganizationStatusTag.tsx';
import useConfirmationModal from 'src/components/common/ConfirmationModal.tsx';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import useFields from 'src/pages/map-view/hooks/useFields.ts';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import { getDateInFormat } from 'src/helpers/dateFormat';
import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { Field, FieldDetails } from 'src/types/Fields';
import { getIconSrc } from 'src/pages/list-view/dashboardIcon.ts';
import fieldsAPI from 'src/api/fieldsAPI.ts';
import CategoryTag from 'src/pages/map-view/categories/CategoryTag.tsx';
import FieldInfoRow from 'src/pages/map-view/field-parameters/FieldInfoRow.tsx';
import AdminFilter, { FilterPopoverProps } from 'src/pages/list-view/AdminFilter.tsx';
import EditFieldModal from 'src/pages/map-view/EditFieldModal.tsx';
import {
  DateStatusBadge,
  FieldStatusBadge,
} from 'src/pages/map-view/field-parameters/fiels-status-badge/StatusBadge.tsx';
import { Category } from 'src/types/Organizations.ts';
import { DaysForExpireLeft } from './DaysForExpireLeft';
import { useDaysUntilExpiration } from './hooks/useDaysUntillExpiration';
import { useUnit } from 'src/context/hooks/useUnitContext';

import 'src/pages/list-view/list-view.css';

function AdminListView() {
  const { t, i18n } = useTranslation()
  const { unitSystem } = useUnit()
  const navigate = useNavigate();
  const modal = useConfirmationModal()
  const { message } = App.useApp()
  const {
    fields,
    isLoading,
    editField,
    filterByCategory,
    deleteField,
    refetchFields,
  } = useFields()
  const { isExpire } = useDaysUntilExpiration()
  const [isModalOpen, showModal, hideModal] = useModal()
  const {
    isOrganizationLoading,
    isCurrentOrganizationLocked,
    lockCurrentOrganization,
    allFieldAreValid,
    checkIfAllFieldAreValid
  } = useCurrentOrganization()
  const [editingField, setEditingField] = useState<Field>(undefined!);
  const [filteredCategory, setFilteredCategory] = useState<Category>()

  useEffect(() => {
    checkIfAllFieldAreValid()
  }, [checkIfAllFieldAreValid, fields]);

  const handleLockOrganization = () => {
    const onLockOrganization = async () => {
      const lockedOrganization = await lockCurrentOrganization()
      if (!lockedOrganization) return
      message.success({
        content: t('The organization was successfully locked.', { name: lockedOrganization.name })
      });
    }

    modal.confirm({
      title: t('Lock these fields?'),
      content: t('The selected fields will be locked. The locked fields will be discarded after 130 days. You will not be able to unlock it.'),
      okText: t('Lock'),
      onOk: () => onLockOrganization()
    })
  }

  const onEditField = async (fieldDetails: FieldDetails) => {
    const { id, area } = editingField
    editField({ id, area, ...fieldDetails }).then(() => {
      checkIfAllFieldAreValid()
    })
  }

  const handleShowEditModal = async (id: string) => {
    const field = fields.find((f) => f.id === id)
    if (!field) return
    setEditingField(field)
    showModal()
  }


  const handleShowDeleteConfirm = async (id: string) => {
    const field = fields.find((f) => f.id === id);
    if (!field) return

    const onDeleteField = () => {
      deleteField(field);
    }

    modal.delete({
      title: t('Delete the field?'),
      content: t('The field will be deleted. You will not be able to recover it.', { name: field.name }),
      onOk: () => onDeleteField()
    })
  }

  const handleFilter = async (category?: Category) => {
    setFilteredCategory(category)
  }

  const handleRemoveFilteredCategory = async () => {
    setFilteredCategory(undefined)
  }

  useEffect(() => {
    (async () => filteredCategory
      ? await filterByCategory(filteredCategory)
      : await refetchFields())()
  }, [filteredCategory, filterByCategory, refetchFields])

  if (isCurrentOrganizationLocked === undefined) return <Spin size="large" fullscreen />

  const columns: ColumnsType<Field> = [
    {
      title: t('Crop type'),
      dataIndex: 'crop',
      key: 'crop',
      width: '13%',
      render: (_, field) => {
        const cropIcon = getIconSrc(field.crop);
        return (
          <Space style={{ columnGap: '8px' }}>
            <FieldStatusBadge field={field} tooltip />
            {field.crop && <img src={cropIcon} alt={`${field.crop.id}`} />}
            {field.crop && t(field.crop.id)}
          </Space>
        );
      },
    },
    {
      title: t('Field name'),
      dataIndex: 'name',
      key: 'name',
      width: '17%',
    },
    {
      title: t('Category'),
      dataIndex: 'fieldCategories',
      key: 'fieldCategories',
      width: '23%',
      render: (_, { categories }) => (
        <FieldInfoRow className="field-info__row field-categories">
          {categories.map(({ key, name, allowedOptions }) => (
            <CategoryTag
              key={key}
              categoryKey={key}
              label={`${name}: ${allowedOptions[0]}`}
            />))}
        </FieldInfoRow>
      )
    },
    {
      title: t('Planting date'),
      dataIndex: 'plantedAt',
      key: 'plantedAt',
      width: '15%',
      render: (value?: string) => {
        return !value ? '' : (
          <Space style={{ columnGap: '8px' }}>
            {getDateInFormat(value)}
            <DateStatusBadge date={value}  tooltip/>
          </Space>
        );
      },
    },
    {
      title: t('Agronomist'),
      dataIndex: 'agronomist',
      key: 'agronomist',
      width: '20%',
      render: (_, { agronomist }: Field) => agronomist ? getUserFullName(agronomist) : ''
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: '7%',
      render: () => <OrganizationStatusTag locked={isCurrentOrganizationLocked} />
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: '5%',
      render: (_, field) => (
        <Space size="middle">
          <Tooltip placement="top" title={t('Map view')}>
            <Button
              type="link"
              icon={<EnvironmentOutlined />}
              onClick={() => {
                navigate(`${pathNames.MAP_VIEW}/${field.id}`)
              }}
            />
          </Tooltip>
          <Tooltip placement="top" title={t('Edit')}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleShowEditModal(field.id)}
            />
          </Tooltip>
          {!isCurrentOrganizationLocked && (
            <Tooltip placement="top" title={t('Delete')}>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleShowDeleteConfirm(field.id)}
              />
            </Tooltip>
          )}
          {isCurrentOrganizationLocked && (
            <Tooltip placement="top" title={t('Analytics')}>
              <Button type="primary" icon={<LineChartOutlined />}
                      onClick={() => navigate(`${pathNames.MAP_VIEW}/${field.id}/${field.organization.id}`)} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleExport = () => {
    const exportFields = async () => {
      await fieldsAPI.exportDashboardCsv(fields.map(({ id }) => id), unitSystem, i18n.resolvedLanguage ?? 'en');
    }

    modal.confirm({
      title: t('Export fields'),
      content: t('Export selected fields report to CSV format'),
      okText: t('Export'),
      onOk: () => exportFields(),
      icon: null
    })
  }


  const FilterButton = ({ onClick, isOpen }: Parameters<FilterPopoverProps['button']>[0]) => (<Button
    className={classNames({ 'filter__button_active': isOpen })}
    size="large"
    onClick={onClick}
    type="primary"
    icon={<FilterOutlined />}
  />)

  return (
    <>
      {modal.contextHolder}
      <Flex className="dashboard-header" justify="space-between" align="center">
        <Flex gap={24} align="center" wrap="wrap">
          <Typography.Title level={2} className="dashboard-title">{t('Fields')}</Typography.Title>
          <AdminFilter
            defaultValue={filteredCategory}
            onFilter={handleFilter}
            button={FilterButton}
          />
          {isCurrentOrganizationLocked && (
            <Button
              size="large"
              className="btn-w160"
              onClick={handleExport}
            >
              {t('Export')}
            </Button>
          )}
          {isCurrentOrganizationLocked && (
            isExpire ? (<Flex gap="8px">
                <ExclamationCircleOutlined className="exclamation-icon" />
                <Typography.Text>
                  {t('The field parameters analytic is no longer available')}
                </Typography.Text>
              </Flex>) :
              <DaysForExpireLeft />
          )}

          {!isCurrentOrganizationLocked && (
            <Button
              disabled={!allFieldAreValid || isOrganizationLoading || !fields.length}
              className="btn-w160"
              size="large"
              type="primary"
              icon={<LockOutlined />}
              onClick={handleLockOrganization}
            >
              {t('Lock')}
            </Button>
          )}
          {!allFieldAreValid && (
            <Tooltip
              overlayStyle={{ minWidth: 'max-content' }}
              title={t('The fields cannot be locked until all field information is valid')}
            >
              <ExclamationCircleOutlined className="exclamation-icon" />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      {filteredCategory && (
        <Space style={{ marginBottom: 24 }}>
          <Tag onClose={handleRemoveFilteredCategory} closable>
            {t('By {{name}}: {{allowedOptions}}', {
              name: filteredCategory.name,
              allowedOptions: filteredCategory.allowedOptions.join(', ')
            })}
          </Tag>
        </Space>
      )}
      <LargeTableWithScroll
        rowKey="id"
        dataSource={fields}
        columns={columns}
        height="calc(100vh - 256px)"
        loading={isLoading}
      />
      {editingField && (
        <EditFieldModal
          field={editingField}
          isModalOpen={isModalOpen}
          hideModal={hideModal}
          onSubmit={onEditField}
        />
      )}
    </>
  );
}

export default AdminListView;
