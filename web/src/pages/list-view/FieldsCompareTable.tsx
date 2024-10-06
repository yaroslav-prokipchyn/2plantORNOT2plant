import { Space, Table, TableProps, Tooltip } from 'antd';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Field, FieldParameters } from 'src/types/Fields';
import { getIconSrc } from './dashboardIcon';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'src/context/hooks/useUnitContext';

interface DataType {
  key: string;
  name: string;
  [key:string]: string;
}

const getCellClass = (_: DataType, index?: number) => ({
  className: (index === 0 || index === 5) ? 'wide-table-column table-name-column' : 'table-name-column',
})

type Props = {
  fields: Field[];
}

export const FieldsCompareTable = ({ fields }: Props) => {
  const isMobile = useMediaQuery('only screen and (max-width : 700px)');
  const {  displayInCurrentUnits } = useUnit()
  const { t } = useTranslation();

  const getCompareTableColumns = (fields: Field[], isMobile: boolean) => {

    const columns: TableProps<DataType>['columns'] = [
      {
        title: t('Parameters'),
        dataIndex: 'name',
        fixed: !isMobile,
        onCell: getCellClass
      },
      ...fields.map((field) => ({
        title: <Space style={{ columnGap: '8px', textWrap: 'wrap', wordBreak: 'break-word' }}>
          {field.crop && <Tooltip placement="top" title={t(field.crop.id)}>
              <img src={getIconSrc(field.crop)} alt={`${field.crop.id}`} />
          </Tooltip>}
          {field.name}
        </Space>,
        onCell: getCellClass,
        dataIndex: `field${field.id}`,
        className: 'table-column'
      }))
    ]
    return columns
  }

  const getCompareTableData = (fields: Field[]) => {

    const getParameterValues = (parameter: keyof FieldParameters) => (
      fields.reduce((acc, field) => {
        return { ...acc, [`field${field.id}`]: displayInCurrentUnits('mm')(field[parameter]) };
      }, {})
    )

    const data: DataType[] = [
      {
        key: '1',
        name: t('Current Status'),
      },
      // {
      //   key: '2',
      //   name: t('Crop Water Use'),
      //   ...getParameterValues('currentCropWaterUse')
      // },
      {
        key: '2',
        name: t('Soil water content'),
        ...getParameterValues('currentSoilWaterContent')
      },
      {
        key: '3',
        name: t('Risk of Bogging'),
        ...getParameterValues('currentRiskOfBogging')
      },
      {
        key: '4',
        name: t('Risk of water shortage'),
        ...getParameterValues('currentRiskOfWaterShortage')
      },
      {
        key: '5',
        name: t('Weekly forecast')
      },
      {
        key: '6',
        name: t('Expected rain'),
        ...getParameterValues('expectedRain')
      },
      // {
      //   key: '8',
      //   name: t('Crop Water Use'),
      //   ...getParameterValues('forecastCropWaterUse')
      // },
      {
        key: '7',
        name: t('Soil water content'),
        ...getParameterValues('forecastSoilWaterContent')
      },
      {
        key: '8',
        name: t('Risk of Bogging'),
        ...getParameterValues('forecastRiskOfBogging')
      },
      {
        key: '9',
        name: t('Risk of water shortage'),
        ...getParameterValues('forecastRiskOfWaterShortage')
      }
    ]
    return data;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <div style={{ width: '100%' }}>
    <Table
      columns={getCompareTableColumns(fields, isMobile)}
      dataSource={getCompareTableData(fields)}
      pagination={false}
      id="compare-fields-table"
      scroll={{ x: 'max-content', y: 'calc(100svh - 242px)' }}
    />
  </div>
}
