import { Field } from 'src/types/Fields.ts';
import dayjs from 'dayjs';
import { t } from 'i18next';

export const validateField = (field: Field): string[] => {
  const errors: string[] = []
  if (!field.name) errors.push(t('Name is required'))
  if (!field.crop) errors.push(t('Crop type is required'))
  if (!field.plantedAt) errors.push(t('Planting date is required'))
  if (!isPlantingDateValid(field.plantedAt)) errors.push(t('The planting date should precede locking date'))
  if (!field.area) errors.push(t('Area is required'))

  return errors
}

export const isFieldDataEmpty = (field: Field): boolean => {
  const errors: string[] = []

  if (!field.name) errors.push(t('Name is required'))
  if (!field.crop) errors.push(t('Crop type is required'))
  if (!field.plantedAt) errors.push(t('Planting date is required'))
  if (!field.area) errors.push(t('Area is required'))

  return errors.length !== 0
}

export const isPlantingDateValid = (plantedAt?: string): boolean => {
  return plantedAt ? !dayjs(plantedAt).endOf('day').isAfter(dayjs().endOf('day')) : false
}
