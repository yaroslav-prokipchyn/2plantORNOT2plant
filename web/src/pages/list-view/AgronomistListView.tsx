import { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Radio, Space, Spin, TableColumnsType, Tag, Tooltip, Typography } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useMediaQuery } from '@uidotdev/usehooks';
import { t } from 'i18next';

import { AgronomistCardsDashboard } from './AgronomistCardsView.tsx';
import LargeTableWithScroll from 'src/components/common/table/LargeTableWithScroll.tsx';

import fieldsAPI from 'src/api/fieldsAPI';
import { Field, FieldParameters } from 'src/types/Fields';
import { getIconSrc } from './dashboardIcon';
import useConfirmationModal from 'src/components/common/ConfirmationModal';
import { FilterOutlined, LineChartOutlined } from '@ant-design/icons';
import { pathNames } from 'src/config/constants.ts';
import { useNavigate } from 'react-router';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { FieldsCompareTable } from './FieldsCompareTable';
import AgronomistFilter, { FilterOptions, FilterPopoverProps } from 'src/pages/list-view/AgronomistFilter.tsx';
import classNames from 'classnames';
import useFields from 'src/pages/map-view/hooks/useFields.ts';
import IrrigationReview from 'src/pages/list-view/irrigation-review/IrrigationReview.tsx';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'src/context/hooks/useUnitContext';

const sort = (key: keyof FieldParameters, a?: Field, b?: Field) => {
  const parameterValueA = a?.[key] ? Number.parseFloat(a?.[key]) : Number.MAX_VALUE;
  const parameterValueB = b?.[key] ? Number.parseFloat(b?.[key]) : Number.MAX_VALUE;
  return parameterValueA - parameterValueB;
}
type Props = {
  fields?: Field[];
  selectedIds: Field['id'][];
}

const getSelectedFields = ({
                             fields,
                             selectedIds
                           }: Props) => fields?.filter(({ id }) => selectedIds.includes(id)) || []

const parametersColumnWidth = 115;


const options = () => [
  { label: t('Table'), value: 'table' },
  { label: t('Tiles'), value: 'tiles' },
];

export type Mode = 'table' | 'tiles';

function AgronomistListView() {
  const { t, i18n } = useTranslation()
  const { unitSystem } = useUnit()
  const { fields, isLoading, filterByParameters } = useFields()
  const { displayInCurrentUnits }= useUnit()
  const isMiddleScreen = useMediaQuery('only screen and (925px < width < 1194px)');
  const isMobile = useMediaQuery('only screen and (max-width : 925px)');
  const [mode, setMode] = useState<Mode>(localStorage.getItem('dashboardMode') as Mode || 'table');
  const [isIrrigationReviewOpen, setIsIrrigationReviewOpen] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>()
  const [selectedIds, setSelectedIds] = useState<Field['id'][]>([]);
  const [compareFields, setCompareFields] = useState<Field[] | null>(null)
  const modal = useConfirmationModal()

  const { isCurrentOrganizationLocked } = useCurrentOrganization();

  const setDashboardMode = (mode: Mode) => {
    setMode(mode);
    localStorage.setItem('dashboardMode', mode)
  }

  const handleExport = () => {
    const exportFields = async () => {
      await fieldsAPI.exportCsv(selectedIds, unitSystem, i18n.resolvedLanguage ?? 'en');
      setSelectedIds([]);
    }

    modal.confirm({
      title: t('Export fields'),
      content: t('Export selected fields report to CSV format'),
      okText: t('Export'),
      onOk: () => exportFields(),
      icon: null
    })
  }

  const navigate = useNavigate();

  const rowSelection: TableRowSelection<Field['id']> = {
    selectedRowKeys: selectedIds as React.Key[],
    onChange: setSelectedIds as React.Dispatch<React.SetStateAction<React.Key[]>>,
  };

  const showModeButton = isMiddleScreen && !selectedIds.length && !compareFields && !isIrrigationReviewOpen;
  const showExportButton = false;
  const showCompareFieldsButton = false;
  const showExitButton = !!compareFields;
  const showIrrigationReviewButton = false;
  const headerItemsGap = isMobile ? 'small' : isMiddleScreen ? 'middle' : 'large'

  const columns = useMemo((): TableColumnsType<Field> => [
    {
      title: t('Field name'),
      key: 'crop',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''),
      render: (field: Field) => {
        return (
          <Flex justify="space-between">
            <Space style={{ columnGap: '8px', textWrap: 'wrap', wordBreak: 'break-word' }}>
              {field.crop && <Tooltip placement="top" title={t(field.crop.id)}>
                  <img src={getIconSrc(field.crop)} alt={`${field.crop.id}`} />
              </Tooltip>}
              {field.name}
            </Space>
          </Flex>
  
        );
      },
    },
    {
      title: t('Current status'),
      children: [
        {
          title: t('Soil water content'),
          dataIndex: ['currentSoilWaterContent'],
          key: 'currentSoilWaterContent',
          render: displayInCurrentUnits('mm'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('currentSoilWaterContent', a, b)
        },
        {
          title: t('Risk of bogging'),
          dataIndex: ['currentRiskOfBogging'],
          key: 'currentRiskOfBogging',
          render: displayInCurrentUnits('%'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('currentRiskOfBogging', a, b)
        },
        {
          title: t('Risk of water shortage'),
          dataIndex: ['currentRiskOfWaterShortage'],
          key: 'currentRiskOfWaterShortage',
          render: displayInCurrentUnits('%'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('currentRiskOfWaterShortage', a, b)
        },
      ],
    },
    {
      title: t('Weekly forecast'),
      children: [
        {
          title: t('Expected rain'),
          dataIndex: ['expectedRain'],
          key: 'expectedRain',
          render: displayInCurrentUnits('mm'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('expectedRain', a, b)
        },
        {
          title: t('Soil water content'),
          dataIndex: ['forecastSoilWaterContent'],
          key: 'forecastSoilWaterContent',
          render: displayInCurrentUnits('mm'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('forecastSoilWaterContent', a, b)
        },
        {
          title: t('Risk of bogging'),
          dataIndex: ['forecastRiskOfBogging'],
          key: 'forecastRiskOfBogging',
          render: displayInCurrentUnits('%'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('forecastRiskOfBogging', a, b)
        },
        {
          title: t('Risk of water shortage'),
          dataIndex: ['forecastRiskOfWaterShortage'],
          key: 'forecastRiskOfWaterShortage',
          render: displayInCurrentUnits('%'),
          width: parametersColumnWidth,
          className: 'table-children-column',
          sorter: (a, b) => sort('forecastRiskOfWaterShortage', a, b)
        },
      ],
    },
    {
      hidden: !isCurrentOrganizationLocked,
      key: 'actions',
      width: 62,
      render: (field: Field) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('Analytics')}>
              <Button
                type="primary"
                icon={<LineChartOutlined />}
                onClick={() => navigate(`${pathNames.MAP_VIEW}/${field.id}/${field.organization.id}`)} />
            </Tooltip>
          </Space>
        );
      },
    },
  ],[navigate, isCurrentOrganizationLocked, t, displayInCurrentUnits])

  useEffect(() => {
    if (isMiddleScreen || !isMobile && !isMiddleScreen) {
      setDashboardMode('table')
    }
    if (isMobile) {
      setDashboardMode('tiles')
    }
  }, [isMiddleScreen, isMobile])


  useEffect(() => {
    filterByParameters(filterOptions ?? {} as FilterOptions)
    window.localStorage.setItem('dashboard:filterOptions', JSON.stringify(filterOptions ?? {}))
  }, [filterOptions, filterByParameters])

  const handleFilter = async (filterOptions?: FilterOptions) => {
    setFilterOptions(filterOptions)
  }

  const handleRemoveFilterOption = (option: string) => {
    setFilterOptions((prevState) => prevState && Object.entries(prevState)
      .reduce((acc, [key, value]) => option !== key ? {
        ...acc,
        [key]: value
      } : acc, {} as FilterOptions))
  }

  const handleCompareFields = () => {
    setCompareFields(getSelectedFields({ selectedIds, fields }))
  }

  const handleExitCompareFields = () => {
    setCompareFields(null);
    setSelectedIds([]);
  }

  const handleShowIrrigationReview = () => setIsIrrigationReviewOpen(true)

  const handleExitIrrigationReview = () => setIsIrrigationReviewOpen(false)

  const FilterButton = ({ onClick, isOpen }: Parameters<FilterPopoverProps['button']>[0]) => (<Button
    className={classNames({ 'filter__button_active': isOpen })}
    size="large"
    onClick={onClick}
    type="primary"
    icon={<FilterOutlined />}
  />)

  if (isLoading && mode === 'tiles') {
    return <Spin size="large" fullscreen />
  }

  return <>
    {modal.contextHolder}
    <Flex
      className={classNames('dashboard-header', { 'inline': isIrrigationReviewOpen })}
      justify="space-between"
      align="center"
    >
      <Flex align="center" gap={headerItemsGap} wrap="wrap">
        <Typography.Title level={2}>{t('Fields')}</Typography.Title>
        {showModeButton && (
          <Radio.Group
            options={options()}
            onChange={({ target: { value } }) => setMode(value)}
            value={mode}
            optionType="button"
            size="large"
          />)}
        {!compareFields && <AgronomistFilter
          fields={fields}
          defaultValue={filterOptions}
          onFilter={handleFilter}
          button={FilterButton}
        />}
        {filterOptions && (
          <Space>
            {Object.keys(filterOptions).map((option) => (option &&
                <Tag key={option} onClose={() => handleRemoveFilterOption(option)} closable>
                  {t('Filtered By', { option: option })}
                </Tag>))}
          </Space>)}
        <Flex gap="small" wrap="wrap" className="dashboard-buttons">
          {showIrrigationReviewButton && (
            <Button
              disabled={!fields.length}
              onClick={handleShowIrrigationReview}
              size="large"
              type="primary"
              className="btn-w160"
            >
              {t('Irrigation review')}
            </Button>)}
          {showCompareFieldsButton && (
            <Button
              onClick={handleCompareFields}
              size="large"
              type="primary"
              className="btn-w160"
            >
              {t('Compare Fields')}
            </Button>
          )}
          {showExportButton && (
            <Button
              size="large"
              className="btn-w160"
              onClick={handleExport}
            >
              {t('Export')}
            </Button>
          )}
        </Flex>
      </Flex>
      {showExitButton && (
        <Button
          onClick={handleExitCompareFields}
          size="large"
          className="btn-w160 exit-button"
        >
          {t('Exit')}
        </Button>
      )}
    </Flex>
    {isIrrigationReviewOpen ?
      <IrrigationReview fields={fields} exit={handleExitIrrigationReview} /> :
      compareFields ? (
        <FieldsCompareTable fields={compareFields} />
      ) : (
        mode === 'table'
          ? <LargeTableWithScroll
            id="agronomist-dashboard-table"
            rowSelection={rowSelection}
            dataSource={fields}
            rowKey={'id'}
            columns={columns}
            height="calc(100svh - 310px)"
            minWidth={1300}
            loading={isLoading}
            bordered
          />
          : <AgronomistCardsDashboard
            fields={fields}
            isFieldsLoading={isLoading}
            setSelectedIds={setSelectedIds} selectedIds={selectedIds}
          />
      )
    }
  </>
}

export default AgronomistListView;
