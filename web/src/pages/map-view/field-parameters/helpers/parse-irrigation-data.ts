import { IrrigationResponse } from 'src/api/irrigationAPI';
import { IrrigationTableItem } from '../FieldIrrigationTable';

export function parseIrrigationsData(irrigations: IrrigationResponse[]): IrrigationTableItem[] {
    return  irrigations.map(irrigation=>({
      key: irrigation.id.toString(),
      irrigationDate: irrigation.date,
      irrigationAmount: irrigation.value
    }))
  }