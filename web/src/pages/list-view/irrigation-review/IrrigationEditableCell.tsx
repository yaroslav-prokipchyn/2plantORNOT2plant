import dayjs from 'dayjs';
import { BlockProps } from 'antd/es/typography/Base';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { FieldWithIrrigation, TableIrrigation } from 'src/pages/list-view/irrigation-review/IrrigationReview.tsx';
import { useUnit } from 'src/context/hooks/useUnitContext';

type IrrigationEditableCellProps = {
  date: string,
  field: FieldWithIrrigation,
  onEdit: (value: TableIrrigation) => void
}

const IrrigationEditableCell = ({ date, field, onEdit }: IrrigationEditableCellProps) => {
  const { roundWithUnits, convertCurrentUnitsToMillimeters, convertToLengthValueInCurrentUnits } = useUnit();
  const irrigation = field.irrigations.find((i) => dayjs(i.date).isSame(dayjs(date)))
  const [value, setValue] = useState<TableIrrigation['value']>(convertToLengthValueInCurrentUnits('mm')(irrigation?.value))


  useEffect(()=>{
    setValue(convertToLengthValueInCurrentUnits('mm')(irrigation?.value))
  }, [convertToLengthValueInCurrentUnits, irrigation?.value])

  if (!irrigation) return

  const handleChange = (newValue: string) => {
    const newValueNumber = Number(newValue);

    if (value === newValueNumber || (newValueNumber < 0.01 && newValueNumber != 0)) return //prevent from very small values but keep delete irrigation with 0

    const numberValueRounded = Number(newValueNumber.toFixed(2));
    setValue(numberValueRounded)
    onEdit({ ...irrigation, isEdited: true, value: convertCurrentUnitsToMillimeters(numberValueRounded) })
  }

  const editConfig: BlockProps['editable'] = {
    triggerType: ['text'],
    enterIcon: false,
    text: value ? String(value) : '0',
    onChange: handleChange
  }

  return (
    <Typography.Text className="table__irrigation-cell-text" editable={editConfig}>
      {roundWithUnits(value)}
    </Typography.Text>
  )
}

export default IrrigationEditableCell
