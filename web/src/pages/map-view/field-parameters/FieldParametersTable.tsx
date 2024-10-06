import { Table } from 'antd';
import { Field } from 'src/types/Fields.ts';
import { columns } from 'src/pages/map-view/field-parameters/fieldParameTableDefinitions.ts';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'src/context/hooks/useUnitContext';
import { useMemo } from 'react';

type FieldParametersTableProps = Field & { isLoading?: boolean }

export const FieldParametersTable = ({ isLoading, ...field }: FieldParametersTableProps) => {
  const { t } = useTranslation();
  const { displayInCurrentUnits } = useUnit()
  
  const buildParametersTable = useMemo(()=>[
    { parameter: t("Soil water content"), currentValue: field?.currentSoilWaterContent, forecastValue: field?.forecastSoilWaterContent, render:  displayInCurrentUnits('mm') },
    { parameter: t("Risk of bogging"), currentValue: field?.currentRiskOfBogging, forecastValue: field?.forecastRiskOfBogging, render: displayInCurrentUnits('%') },
    { parameter: t("Risk of water shortage"), currentValue: field?.currentRiskOfWaterShortage, forecastValue: field?.forecastRiskOfWaterShortage,render: displayInCurrentUnits('%') },
    { parameter: t("Expected rain"), currentValue: undefined, forecastValue: field?.expectedRain, render: displayInCurrentUnits('mm') },
],[field, t, displayInCurrentUnits ])

  return (
    <div className="map-bottom-menu--parameters">
      <Table
        rowKey={'parameter'}
        className="parameters-table"
        size="middle"
        id='parameters-table'
        pagination={false}
        dataSource={buildParametersTable}
        columns={columns()}
        loading={isLoading}
        bordered
      />
    </div>
  );
}

