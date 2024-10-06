import { App } from 'antd';
import organizationAPI from 'src/api/organizarionsApi.ts';
import { OrganizationWithAdmin, OrganizationWithAdmins } from 'src/types/Organizations.ts';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from "react-i18next";

function useOrganizations() {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const {
    data: organizations = [],
    isLoading,
    isFetching,
    refetch: refetchOrganizations
  } = useQuery('organizations:getAll', () => organizationAPI.getAll(), { refetchOnWindowFocus: false })

  const {
    mutateAsync: createOrganization,
    isLoading: organizationCreating
  } = useMutation({
    mutationFn: (values: Omit<OrganizationWithAdmin, 'id' | 'locked' | 'lockedAt'>) => organizationAPI.create(values),
    onSuccess: (_, variables) => {
      refetchOrganizations()
      message.success({
        content: t(`New organization was successfully added.`, { organization: variables.name })
      });
    }
  });

  const {
    mutateAsync: editOrganization,
    isLoading: organizationEditing
  } = useMutation({
    mutationFn: (organization: OrganizationWithAdmin) => organizationAPI.edit(organization),
    onSuccess: () => {
      refetchOrganizations()
      message.success({
        content: t('All changes were successfully saved.')
      });
    }
  });

  const {
    mutateAsync: deleteOrganization,
    isLoading: organizationDeleting
  } = useMutation({
    mutationFn: (organization: OrganizationWithAdmins) => organizationAPI.delete(organization.id),
    onSuccess: (_, organization) => {
      refetchOrganizations()
      message.success({
        content: t(`The Organization was successfully deleted.`, { organization: organization.name })
      });
    }
  })

  return {
    isLoading: isLoading || isFetching || organizationDeleting || organizationCreating || organizationEditing,
    organizations,
    createOrganization,
    editOrganization,
    deleteOrganization,
  }
}

export default useOrganizations
