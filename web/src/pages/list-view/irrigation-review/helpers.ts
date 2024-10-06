import dayjs from 'dayjs';
import { Field } from 'src/types/Fields.ts';
import { IrrigationResponse } from 'src/api/irrigationAPI.ts';
import { getPayloadDate } from 'src/helpers/dateFormat.ts';

export const splitDaysIntoChunks = (days: string[], chunkLength: number) => {
  if (!days.length) return [[]]
  return days.reduce((chunks, _, index) => index % chunkLength === 0
    ? [...chunks, days.slice(index, index + chunkLength).reverse()]
    : chunks, [] as string[][]);
};


export function buildFieldsWithIrrigations(fields: Field[], irrigationDays: string[], irrigationsRes: IrrigationResponse[]) {
  return fields.reduce((acc, field) => {
    const irrigations = irrigationDays.map((day) => {
      const thisDayIrrigation = irrigationsRes.find(({ fieldId, date }) =>
        fieldId === field.id && dayjs(date).isSame(dayjs(day)))

      return {
        fieldId: field.id,
        value: thisDayIrrigation?.value,
        date: day,
        id: thisDayIrrigation?.id,
        isEdited: false
      }
    })
    return { ...acc, [field.id]: { ...field, irrigations } }
  }, {})
}

export const isToday = (date: string) => dayjs().startOf('day').isSame(dayjs(date))

export const getDaysAfterFirstPlanting = (fields: Field[]) => {
  const firstPlantedField = fields.filter(({ plantedAt }) => plantedAt)
    .sort((a, b) => dayjs(a.plantedAt).isAfter(dayjs(b.plantedAt)) ? 1 : -1)[0]
  if (!firstPlantedField) return []
  const oneMonthBeforeFirstPlantingDate = dayjs(firstPlantedField.plantedAt).subtract(1, 'month')
  return new Array(dayjs().diff(oneMonthBeforeFirstPlantingDate, 'day') + 1) // +1 to include planting day
    .fill(undefined).map((_, day) => getPayloadDate(dayjs().subtract(day, 'day')))
}

export const isDataEqual = <T>(oldData: T, newData: T): boolean => JSON.stringify(oldData) === JSON.stringify(newData)
