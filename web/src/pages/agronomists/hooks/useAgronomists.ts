import { App } from 'antd';

import { getUserFullName } from 'src/helpers/getUserFullName.ts';
import { Roles, User } from 'src/types/Users.ts';
import usersAPI from 'src/api/usersAPI.ts';
import { useCurrentOrganization } from 'src/context/hooks/useCurrentOrganizationContext.ts';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from "react-i18next";

export type AgronomistDetails = Pick<User, 'firstName' | 'lastName' | 'email'>

function useAgronomists() {
  const { currentOrganization } = useCurrentOrganization()
  const { message } = App.useApp()
  const { t } = useTranslation()
  const {
    data: agronomists = [],
    isLoading,
    isFetching,
    refetch: refetchAgronomists
  } = useQuery('users:getAllAgronomists', () => usersAPI.getAll(Roles.AGRONOMIST), { refetchOnWindowFocus: false })

  const {
    mutateAsync: createAgronomist,
    isLoading: agronomistCreating
  } = useMutation({
    mutationFn: (agronomistDetails: AgronomistDetails) => usersAPI.create({
      ...agronomistDetails,
      roles: [Roles.AGRONOMIST],
      organizationId: currentOrganization.id
    }),
    onSuccess: (_, agronomist: AgronomistDetails) => {
      refetchAgronomists()
      message.success({
        content: t(`New agronomist was successfully added.`, { name: getUserFullName(agronomist) })
      });
    }
  });


  const {
    mutateAsync: editAgronomist,
    isLoading: agronomistEditing
  } = useMutation({
    mutationFn: ({ id, ...agronomistDetails }: User) => usersAPI.edit(id, agronomistDetails),
    onSuccess: () => {
      refetchAgronomists()
      message.success({
        content: t('All changes were successfully saved.')
      });
    }
  });

  const {
    mutateAsync: editAgronomistStatus,
    isLoading: agronomistStatusEditing
  } = useMutation({
    mutationFn: (agronomist: User) => usersAPI.editStatus(agronomist.id, !agronomist.active),
    onSuccess: (_, agronomist) => {
      refetchAgronomists()
      message.success({
        content: agronomist.active
          ? t(`The agronomist access was successfully turned off.`, { name: getUserFullName(agronomist) })
          : t(`The agronomist access was successfully turned on.`, { name: getUserFullName(agronomist) })
      });
    }
  });

  const {
    mutateAsync: deleteAgronomist,
    isLoading: agronomistDeleting
  } = useMutation({
    mutationFn: (agronomist: User) => usersAPI.delete(agronomist.id),
    onSuccess: (_, agronomist: User) => {
      refetchAgronomists()
      message.success({
        content: t(`The agronomist was successfully deleted.`, { name: getUserFullName(agronomist) })
      });
    }
  });

  return {
    isLoading: isLoading || isFetching || agronomistEditing || agronomistStatusEditing || agronomistCreating || agronomistDeleting,
    agronomists,
    createAgronomist,
    editAgronomist,
    editAgronomistStatus,
    deleteAgronomist,
  }
}

export default useAgronomists
