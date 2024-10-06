import { useCallback, useEffect, useState } from 'react';
import { Button, Flex, message, Table, TableColumnProps } from 'antd';
import { AddIrrigationModal } from './AddIrigationModal';
import irrigationAPI from 'src/api/irrigationAPI';
import { useModal } from 'src/components/common/hooks/useModal.ts';
import { getDateInFormat } from 'src/helpers/dateFormat';
import { Field } from 'src/types/Fields.ts';
import dayjs from 'dayjs';
import { CloseOutlined } from '@ant-design/icons';
import useFields from 'src/pages/map-view/hooks/useFields.ts';
import { useTranslation } from 'react-i18next';
import { useUnit } from "src/context/hooks/useUnitContext.ts";

export type AddIrrigation = {
  value: number | null;
  date: string;
}

export type IrrigationTableItem = {
  key: string;
  irrigationDate: string;
  irrigationAmount: number;
}

function sortDescIrrigationTableData(irrigationTableData: IrrigationTableItem[]) {
  return irrigationTableData.sort((firstItem, secondItem) =>
    dayjs(firstItem.irrigationDate).isAfter(dayjs(secondItem.irrigationDate)) ? -1 : 1
  );
}

function FieldIrrigationTable({ id, plantedAt }: Field) {
  const { refetchFields } = useFields()
  const [isModalOpen, showModal, hideModal] = useModal()
  const [irrigationsData, setIrrigationsData] = useState<IrrigationTableItem[]>([])
  const [isIrrigationsDataLoading, setIsIrrigationsDataLoading] = useState<boolean>(false)
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage({
    top: 70,
    duration: 10,
    maxCount: 3,
  });

  const getIrrigations = useCallback(async (fieldId: Field['id']) => {
    setIsIrrigationsDataLoading(true);
    const response = await irrigationAPI.getAllByField(fieldId);
    setIrrigationsData(sortDescIrrigationTableData(response));
    setIsIrrigationsDataLoading(false);
  }, [])

  const handleAddIrrigation = async (data: AddIrrigation) => {
      await irrigationAPI.add({
        fieldId: id,
        body: data
      })
      messageApi.open({
        type: 'success',
        content: t('The new irrigation was successfully added.'),
      });

      await getIrrigations(id);
      refetchFields()
  }

  const deleteIrrigation = async(date:string)=>{
     await irrigationAPI.delete({ fieldId: id, body: { value: null, date } })
      messageApi.open({
        type: 'success',
        content: t('The irrigation was successfully removed.'),
      });

      await getIrrigations(id);
      refetchFields()
    }

  useEffect(() => {
    if (id) {
      getIrrigations(id);
    }
  }, [getIrrigations, id])

  const { displayInCurrentUnits } = useUnit()
  const getColumns = (deleteIrrigation: (date: string) => void): Array<TableColumnProps<IrrigationTableItem>> => [
    {
      title: t('Irrigation date'),
      dataIndex: 'irrigationDate',
      key: 'irrigationDate',
      render: (value: string) => getDateInFormat(value)
    },
    {
      title: t('Irrigation amount'),
      dataIndex: 'irrigationAmount',
      key: 'irrigationAmount',
      render: (value: string, irrigationItem) =>
        <Flex align='center' justify="space-between">
          {displayInCurrentUnits('mm')(value)}
          <Button onClick={()=>deleteIrrigation(irrigationItem.irrigationDate)} type='text' size='small' icon={<CloseOutlined />}  />
        </Flex>
    },
  ];

  return (
    <div className="map-bottom-menu--irrigation">
      {contextHolder}
      <Flex className="irrigation-table-wrapper">
        <Table
          className="irrigation-table"
          id='irrigation-table'
          dataSource={irrigationsData}
          columns={getColumns(deleteIrrigation)}
          sticky={true}
          scroll={{ y: 188 }}
          size="middle"
          pagination={false}
          bordered
          loading={isIrrigationsDataLoading}
        />
        <Button
          disabled={isIrrigationsDataLoading}
          onClick={showModal}
          type="link"
          className="irrigation-table-button"
        >
          {t('+ Add irrigation')}
        </Button>
      </Flex>

      <AddIrrigationModal
        isModalOpen={isModalOpen}
        hideModal={hideModal}
        onSubmit={handleAddIrrigation}
        irrigationsData={irrigationsData}
        plantedAt={dayjs(plantedAt) || dayjs()}
      />
    </div>
  );
}

export default FieldIrrigationTable;
