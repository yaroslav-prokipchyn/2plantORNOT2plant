import dayjs, { Dayjs } from 'dayjs';
import { getPayloadDate } from 'src/helpers/dateFormat';
import { ChartItem } from '../AddIrigationModal';
import { IrrigationTableItem } from '../FieldIrrigationTable';
import { UnitSystem } from 'src/context/UnitContext';
import { convertToInch } from 'src/context/hooks/useUnitContext';


type Irrigations = {
  [key: string]: number
}


function buildIrrigationChartsData(startDate: Dayjs, irrigationsData: IrrigationTableItem[], unitSystem: UnitSystem): ChartItem[] {
  const todayDate = dayjs();
  const rangeOfDates: ChartItem[] = [];
  const irrigations: Irrigations = irrigationsData.reduce((irrigations, irrigationItem) => ({ ...irrigations, [irrigationItem.irrigationDate]: irrigationItem.irrigationAmount }), {})

  //NOTE: Start from startDate and loop until tomorrow
  for (let date = startDate; date < todayDate.endOf('day'); date = date.add(1, 'day')) {
    const irrigationValue = irrigations?.[getPayloadDate(date)] ?? 0
    rangeOfDates.push({
      date: getPayloadDate(date),
      value: unitSystem === 'imperial' ? convertToInch(irrigationValue) : irrigationValue
    });
  }

  return rangeOfDates;
}

function findFirstDateOfIrrigation(irrigationsData: IrrigationTableItem[]): Dayjs | null {
  let firstDate: Dayjs | null = null;

  irrigationsData.forEach(irrigation => {
    const date = dayjs(irrigation.irrigationDate);

    if (!firstDate || firstDate.isAfter(date)) {
      firstDate = date;
    }
  });

  return firstDate;
}


function getChartStartDate(firstDateOfIrrigation: Dayjs | null, plantedAt: Dayjs) {
  if (firstDateOfIrrigation && dayjs(plantedAt).isAfter(firstDateOfIrrigation)) {
    return firstDateOfIrrigation
  }
  return plantedAt
}

type Props = {
  irrigationsData: IrrigationTableItem[];
  plantedAt: Dayjs;
  unitSystem: UnitSystem;
}

export function getIrrigationChartsData({ irrigationsData, plantedAt, unitSystem }: Props) {
  const irrigationFirstDate = findFirstDateOfIrrigation(irrigationsData);
  const chartStartDate = getChartStartDate(irrigationFirstDate, plantedAt)

  return buildIrrigationChartsData(chartStartDate, irrigationsData, unitSystem)
}