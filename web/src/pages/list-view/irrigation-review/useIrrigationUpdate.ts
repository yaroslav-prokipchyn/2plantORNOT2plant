import { useEffect, useState, useTransition } from 'react';
import { App } from 'antd';
import { useMutation, useQuery } from 'react-query';

import irrigationAPI from 'src/api/irrigationAPI.ts';
import fieldsAPI from 'src/api/fieldsAPI.ts';
import { Field } from 'src/types/Fields.ts';
import {
  FieldWithIrrigation,
  TableIrrigation
} from 'src/pages/list-view/irrigation-review/IrrigationReview.tsx';
import {
  buildFieldsWithIrrigations,
  isDataEqual
} from 'src/pages/list-view/irrigation-review/helpers.ts';
import { useTranslation } from 'react-i18next';

const useIrrigationUpdate = (fields: Field[], irrigationDays: string[]) => {
  const [isPending, setTransition] = useTransition()
  const [fieldsWithIrrigations, setFieldsWithIrrigations] = useState<Record<string, FieldWithIrrigation>>()
  const [changedIrrigationsExist, setChangedIrrigationsExist] = useState<boolean>(false)
  const { message } = App.useApp()
  const { t } = useTranslation()
  const {
    isLoading: isFieldsLoading,
    refetch: refetchFilteredFields
  } = useQuery('fields:getAll', () => {
    const filterOptions = window.localStorage.getItem('dashboard:filterOptions')
    return fieldsAPI.filterByParameters(filterOptions ? JSON.parse(filterOptions) : {})
  }, { enabled: false, refetchOnWindowFocus: false })

  const {
    data: irrigations,
    isLoading: isIrrigationLoading,
    refetch: refetchIrrigations
  } = useQuery('irrigations:getAll', () => irrigationAPI.getAll(fields.map(({ id }) => id)), {
    isDataEqual: isDataEqual,
    refetchOnWindowFocus: false,
  })

  const {
    mutateAsync: updateManyIrrigations,
    isLoading: irrigationsUpdating,
  } = useMutation({
    mutationFn: (irrigations: TableIrrigation[]) => irrigationAPI.updateMany(irrigations),
    onSuccess: async  () => {
      await refetchIrrigations()
      await refetchFilteredFields()
      message.success({
        content: t('All changes were successfully saved.')
      });
    }
  });

  useEffect(() => {
    if (!irrigations) {
      return setFieldsWithIrrigations({})
    }
    setTransition(() =>
      setFieldsWithIrrigations(buildFieldsWithIrrigations(fields, irrigationDays, irrigations)))

  }, [fields, irrigationDays, irrigations]);

  const handleEditIrrigations = (irrigation: TableIrrigation) => {
    const { value: irrigationAmount } = irrigation
    if (!fieldsWithIrrigations) return
    if (isNaN(Number(irrigationAmount))) return

    const fieldIrrigation = { ...irrigation, value: irrigationAmount ? irrigationAmount : undefined }
    const updatedFieldsWithIrrigations = Object.entries(fieldsWithIrrigations).reduce((acc, [fieldId, field]) => {
      const isCurrentIrrigation = field.irrigations.find(({ date, fieldId }) =>
        date === irrigation.date && fieldId === irrigation.fieldId)

      if (isCurrentIrrigation) {
        const unchangedIrrigations = field.irrigations.filter(({ date }) => date !== irrigation.date)
        acc = {
          ...acc, [fieldId]: { ...field, irrigations: [...unchangedIrrigations, fieldIrrigation] }
        }
      }

      return acc
    }, { ...fieldsWithIrrigations })

    setFieldsWithIrrigations(updatedFieldsWithIrrigations)
    setChangedIrrigationsExist(true)
  }


  const handleSubmitIrrigations = async () => {
    if (!fieldsWithIrrigations) return

    const irrigations = Object.values(fieldsWithIrrigations).reduce((acc, { irrigations }) => {
      const changedIrrigations = irrigations.filter(({ isEdited }) => isEdited)
      return [...acc, ...changedIrrigations]
    }, [] as TableIrrigation[])

    updateManyIrrigations(irrigations).then(() => {
      setChangedIrrigationsExist(false)
    })
  }

  return {
    fieldsWithIrrigations,
    isLoading: isIrrigationLoading || isFieldsLoading || irrigationsUpdating || isPending,
    changedIrrigationsExist,
    handleEditIrrigations,
    handleSubmitIrrigations
  }
}

export default useIrrigationUpdate
