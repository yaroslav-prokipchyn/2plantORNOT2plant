import { Button, Checkbox, Empty, Flex, Spin, Table, Tooltip } from 'antd';
import { getIconSrc } from './dashboardIcon';
import { Field } from 'src/types/Fields.ts';
import { columns, FieldParametersTableRow } from 'src/pages/map-view/field-parameters/fieldParameTableDefinitions.ts';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext';
import { LineChartOutlined } from '@ant-design/icons';
import { pathNames } from 'src/config/constants.ts';
import { useNavigate } from 'react-router';
import { useUnit } from 'src/context/hooks/useUnitContext';
import { useTranslation } from 'react-i18next';

type Props = {
  fields?: Field[];
  isFieldsLoading: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<Field['id'][]>>;
  selectedIds: Field['id'][];
}

export const AgronomistCardsDashboard = ({ fields, isFieldsLoading, setSelectedIds, selectedIds }: Props) => {
  const { isCurrentOrganizationLocked } = useCurrentOrganization()
  const { t } = useTranslation();
  const {  displayInCurrentUnits }= useUnit()
  const handleCheck = (e: CheckboxChangeEvent, fieldId: string) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, fieldId])

    } else {
      setSelectedIds((prevIds) => prevIds.filter(id => id !== fieldId))
    }
  }
  const navigate = useNavigate();

  const buildParametersTable = (field: Field):FieldParametersTableRow[]  => [
    { parameter: t("Soil water content"), currentValue: field?.currentSoilWaterContent, forecastValue: field?.forecastSoilWaterContent, render:  displayInCurrentUnits('mm') },
    { parameter: t("Risk of bogging"), currentValue: field?.currentRiskOfBogging, forecastValue: field?.forecastRiskOfBogging, render: displayInCurrentUnits('%') },
    { parameter: t("Risk of water shortage"), currentValue: field?.currentRiskOfWaterShortage, forecastValue: field?.forecastRiskOfWaterShortage,render: displayInCurrentUnits('%') },
    { parameter: t("Expected rain"), currentValue: undefined, forecastValue: field?.expectedRain, render:  displayInCurrentUnits('mm') },
];

  return <>
    <div className="agronomist-cards-wrapper">
      {isFieldsLoading ?
        <Spin fullscreen size="large"/>
        : fields?.map(field => {
        return (<div
            key={field.id}
            className="agronomist-dashboard-card">
            <Flex align="center" justify={"space-between"}>
              <Flex className="agronomist-dashboard-card-title">
                <Checkbox
                  onChange={(e) => handleCheck(e, field.id)}
                  checked={selectedIds.includes(field.id)}
                />
                <img width='20px' src={getIconSrc(field.crop)} alt={`${field.crop?.id}`}/>
                {field.name}
              </Flex>
              {isCurrentOrganizationLocked &&
                  <Flex gap={'12px'} className={'agronomist-dashboard-card-title'}>
                      <Tooltip placement="top" title={t('Analytics')}>
                          <Button type="primary" icon={<LineChartOutlined/>}
                                  onClick={() => navigate(`${pathNames.MAP_VIEW}/${field.id}/${field.organization.id}`)}/>
                      </Tooltip>
                  </Flex>
              }
            </Flex>
            <Table
              rowKey={'parameter'}
              id='card-parameters-table'
              rowClassName="card-parameters-table-row"
              size='middle'
              pagination={false}
              dataSource={buildParametersTable(field)}
              columns={columns()}
            />
          </div>
        )
      })}
    </div>
    {!fields?.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
  </>
}
