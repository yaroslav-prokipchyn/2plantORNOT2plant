import { useMemo, useState } from 'react';
import { Button, DatePicker, Flex, Form, InputNumber } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import useForm from 'src/components/common/hooks/useForm.ts';
import { AddIrrigation, IrrigationTableItem } from './FieldIrrigationTable';
import CenteredModal from 'src/components/common/CenteredModal.tsx';
import { CURRENT_DATE_FORMAT, getPayloadDate } from 'src/helpers/dateFormat';
import { IrrigationChart } from './IrrigationChart';
import { getIrrigationChartsData } from './helpers/get-irrigaton-charts-data';
import { useUnit } from 'src/context/hooks/useUnitContext';
import '../styles/fields.css'

type Props = {
  isModalOpen: boolean;
  hideModal: () => void;
  onSubmit: (values: AddIrrigation) => void;
  irrigationsData: IrrigationTableItem[]
  plantedAt: Dayjs
}

type FieldForm = {
  value: number;
  date: Dayjs;
}

export type ChartItem = {
  value: number;
  date: string;
}

export const AddIrrigationModal = ({ isModalOpen, hideModal, onSubmit, irrigationsData, plantedAt }: Props) => {
  const { form, allFieldsValid, validateFields } = useForm<FieldForm>()
  const [isIrrigationAdding, setIsIrrigationAdding] = useState<boolean>(false);
  const { t } = useTranslation();
  const { unitSystem, convertCurrentUnitsToMillimeters }=useUnit()

  const handleFormChange = () => validateFields()

  const onClose = () => {
    form.resetFields()
    hideModal()
  }

  const onFinish = async (values: FieldForm) => {
    setIsIrrigationAdding(true)

    onSubmit({
      value: convertCurrentUnitsToMillimeters(values.value),
      date: getPayloadDate(values.date),
    })

    setIsIrrigationAdding(false)
    onClose()
  }

  const irrigationChartData = useMemo(() =>
    isModalOpen ? getIrrigationChartsData({ irrigationsData, plantedAt, unitSystem }) : [],
    [irrigationsData, isModalOpen, plantedAt, unitSystem])

  return (
    <CenteredModal
      title={t('Add irrigation')}
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
            loading={isIrrigationAdding}
          >
            {t('Add')}
          </Button>
        </Flex>
      )}
    >
      <Form
        className="form__add-irrigation"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={handleFormChange}
      >
        <Form.Item<FieldForm>
          label={t('Irrigation amount')}
          name="value"
          rules={[{ required: true, message: t('Please input amount of Irrigation!'), type: 'number', min: 0.001 }]}
        >
          <InputNumber
            size="large"
            controls={false}
            suffix={unitSystem === 'imperial' ? t('in') : t('mm')}
            placeholder={t('Enter amount')}
            className="full-width"
          />
        </Form.Item>

        <Form.Item<FieldForm>
          label={t('Irrigation date')}
          name="date"
          rules={[{ required: true, message: t('Please input irrigation date!') }]}
        >
          <DatePicker
            defaultPickerValue={dayjs()}
            maxDate={dayjs()}
            inputReadOnly={true}
            format={CURRENT_DATE_FORMAT}
            size="large"
            placeholder={t('Select date')}
            style={{ width: '100%', height: '40px' }}
          />
        </Form.Item>
      </Form>

      <h3 className='add-irrigation__chart-title'>{t('Irrigation history:')}</h3>
      <IrrigationChart data={irrigationChartData} />


    </CenteredModal>
  )
}
