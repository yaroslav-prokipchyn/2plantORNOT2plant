import axiosInstance from 'src/api/axiosInstance.ts';
import { Field, FieldDetailsWithArea } from 'src/types/Fields';
import { downloadAsBlob } from './parsers/downloadAsBlob';
import { getPayloadDate } from 'src/helpers/dateFormat';
import { Category } from 'src/types/Organizations.ts';
import { FilterOptions } from 'src/pages/list-view/AgronomistFilter.tsx';
import { UnitSystem } from "src/context/UnitContext.tsx";

const fieldsAPI = {
  getAll: async (name?: string): Promise<Field[]> => {
    return axiosInstance.get<Field[]>(`/fields`, name ? {
      params: {
        name
      }
    } : {}).then((res) => res.data)
  },
  getById: async (fieldId: string): Promise<Field> => {
    return axiosInstance.get<Field>(`/fields/${fieldId}`)
      .then((res) => res.data)
  },
  create: async (fieldDetails: FieldDetailsWithArea) => {
    return axiosInstance.post<Field>(`/fields`, fieldDetails).then((res) => res.data)
  },
  edit: async ({ id, ...fieldDetails }: { id: Field['id'] } & FieldDetailsWithArea) => {
    return axiosInstance.put<Field>(`/fields/${id}`, fieldDetails).then((res) => res.data)
  },
  delete: async (id: Field['id']) => {
    return axiosInstance.delete<number>(`/fields/${id}`).then((res) => res.status)
  },
  filterByCategory: async (category: Category): Promise<Field[]> => {
    return axiosInstance.post<Field[]>(`/fields/category`, category).then((res) => res.data)
  },
  filterByParameters: async (parameters: FilterOptions): Promise<Field[]> => {
    return axiosInstance.post<Field[]>(`/fields/filter`, parameters).then((res) => res.data)
  },
  exportCsv: async (ids: string[], system: UnitSystem, locale: string): Promise<void> => {
    return axiosInstance.post<string>(`/fields/export/csv?system=${system}&locale=${locale}`, ids).then((res) => {
      downloadAsBlob(res.data, `nave_analytics_fields_${getPayloadDate(new Date)}`, 'text/csv;charset=utf-8')
    })
  },
  exportDashboardCsv: async (ids: string[], system: UnitSystem, locale?: string): Promise<void> => {
    return axiosInstance.post<string>(`/fields/export/dashboard?system=${system}&locale=${locale}`, ids).then((res) => {
      downloadAsBlob(res.data, `nave_analytics_fields_${getPayloadDate(new Date)}`, 'text/csv;charset=utf-8')
    })
  },
  uploadFiles: async (formData: FormData) => {
    return axiosInstance.postForm(`/fields/upload-shapefiles`, formData).then((res) => res.data)
  }
}

export default fieldsAPI;

