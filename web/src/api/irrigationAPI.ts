import axiosInstance from 'src/api/axiosInstance.ts';
import {
  AddIrrigation,
  IrrigationTableItem
} from 'src/pages/map-view/field-parameters/FieldIrrigationTable';
import { parseIrrigationsData } from 'src/pages/map-view/field-parameters/helpers/parse-irrigation-data';

type AddIrrigationQuery = {
  fieldId: string;
  body: AddIrrigation
}

export type IrrigationResponse = {
  date: string;
  value: number;
  fieldId: string;
  id: string;
}

const irrigationAPI = {
  getAll: async (fieldIds?: string[]): Promise<IrrigationResponse[]> => {
    return axiosInstance.post<IrrigationResponse[]>(`/fields/irrigation/all`, fieldIds).then((res) => res.data)
  },
  updateMany: async (irrigations: Partial<IrrigationResponse>[]): Promise<IrrigationResponse[]> => {
    return axiosInstance.put<IrrigationResponse[]>(`/fields/irrigation/update`, irrigations).then((res) => res.data)
  },
  getAllByField: async (fieldId: string): Promise<IrrigationTableItem[]> => {
    return axiosInstance.get<IrrigationResponse[]>(`/fields/${fieldId}/irrigation`).then((res) => parseIrrigationsData(res.data))
  },
  add: async ({
    fieldId,
    body
  }: AddIrrigationQuery): Promise<IrrigationResponse> => {
    return axiosInstance.post<IrrigationResponse>(`/fields/irrigation`, { fieldId, ...body }).then((res) => res.data)
  },
  delete: async ({
    fieldId,
    body
  }: AddIrrigationQuery): Promise<IrrigationResponse> => {
    return axiosInstance.post<IrrigationResponse>(`/fields/irrigation`, { fieldId, ...body }).then((res) => res.data)
  }
}

export default irrigationAPI;
