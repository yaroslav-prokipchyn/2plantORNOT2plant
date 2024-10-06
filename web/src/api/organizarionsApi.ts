import axiosInstance from 'src/api/axiosInstance.ts';
import { Organization, OrganizationWithAdmin, OrganizationWithAdmins } from 'src/types/Organizations.ts';

type OrganizationPayload = Omit<OrganizationWithAdmin, 'id' | 'locked' | 'lockedAt'>
type CreatedOrganization = Omit<OrganizationWithAdmins, 'admins'>

const organizationAPI = {
  getAll: async (): Promise<OrganizationWithAdmins[]> => {
    return axiosInstance.get<OrganizationWithAdmins[]>(`/organizations`).then(res => res.data)
  },
  getById: async (id: Organization['id']): Promise<OrganizationWithAdmins> => {
    return axiosInstance.get<OrganizationWithAdmins>(`/organizations/${id}`).then(res => res.data)
  },
  create: async (organization: OrganizationPayload): Promise<CreatedOrganization> => {
    return axiosInstance.post<CreatedOrganization>(`/organizations/with-admin`, organization)
      .then((res) => res.data)
  },
  edit: async ({ id, ...organizationDetails }: OrganizationWithAdmin): Promise<OrganizationWithAdmin> => {
    return axiosInstance.put<OrganizationWithAdmin>(`/organizations/with-admin/${id}`, organizationDetails)
      .then((res) => res.data)
  },
  delete: async (id: string): Promise<void> => {
    return axiosInstance.delete<void>(`/organizations/${id}`)
      .then((res) => res.data)
  },
  lock: async (id: Organization['id']): Promise<Organization> => {
    return axiosInstance.put<Organization>(`/organizations/${id}/lock`).then((res) => res.data)
  },
  checkIfAllFieldAreValid: async (id: Organization['id']) => {
    return axiosInstance.get<Record<string, string[]>>(`/organizations/${id}/is-ready-to-lock`).then(res => res.data)
  }
}

export default organizationAPI
