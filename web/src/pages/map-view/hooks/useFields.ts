import { useEffect } from 'react';
import { App } from 'antd';
import fieldsAPI from 'src/api/fieldsAPI.ts';
import { Field, FieldDetailsWithArea, } from 'src/types/Fields.ts';
import { Category } from 'src/types/Organizations.ts';
import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FilterOptions } from 'src/pages/list-view/AgronomistFilter.tsx';
import { useTranslation } from 'react-i18next';

function useFields() {
  const { isAdmin } = useCurrentUser()
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const {
    data: fields = [],
    isLoading,
    isFetching,
    refetch: refetchFields
  } = useQuery('fields:getAll', () => fieldsAPI.getAll(), { refetchOnWindowFocus: false })

  useEffect(() => {
    refetchFields()
  }, [isAdmin, refetchFields]);

  const {
    mutateAsync: createField,
    isLoading: fieldCreating
  } = useMutation({
    mutationFn: (fieldDetails: FieldDetailsWithArea) => fieldsAPI.create(fieldDetails),
    onSuccess: (_, field) => {
      refetchFields()
      message.success({
        content: t(`The new field was successfully created.`, { name: field.name }),
      })
    }
  });

  const {
    mutateAsync: editField,
    isLoading: fieldEditing
  } = useMutation({
    mutationFn: (field: { id: Field['id'] } & FieldDetailsWithArea) => fieldsAPI.edit(field),
    onSuccess: () => {
      refetchFields()
      message.success({
        content: t('All changes were successfully saved.')
      });
    }
  });

  const {
    mutateAsync: deleteField,
    isLoading: fieldDeleting
  } = useMutation({
    mutationFn: (field: Field) => fieldsAPI.delete(field.id),
    onSuccess: (_, field) => {
      refetchFields()
      message.success({
        content: t(`The field was successfully deleted.`,{ name: field.name })
      })
    }
  });

  const {
    mutateAsync: filterByCategory,
    isLoading: fieldsFiltering
  } = useMutation({
    mutationFn: (category: Category): Promise<Field[]> => fieldsAPI.filterByCategory(category),
    onSuccess: (filteredFields: Field[]) => {
      queryClient.setQueryData('fields:getAll', filteredFields)
    }
  });

  const {
    mutateAsync: filterByParameters,
    isLoading: fieldsFilteringByParameters
  } = useMutation({
    mutationFn: (filterOptions: FilterOptions): Promise<Field[]> => fieldsAPI.filterByParameters(filterOptions),
    onSuccess: (filteredFields: Field[]) => {
      queryClient.setQueryData('fields:getAll', filteredFields)
    }
  });

  return {
    isLoading: isFetching || isLoading || fieldCreating || fieldEditing || fieldDeleting || fieldsFiltering || fieldsFilteringByParameters,
    fields,
    refetchFields,
    createField,
    editField,
    deleteField,
    filterByCategory,
    filterByParameters
  }
}

export default useFields
