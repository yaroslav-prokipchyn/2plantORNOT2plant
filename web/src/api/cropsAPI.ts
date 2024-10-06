import axiosInstance from 'src/api/axiosInstance.ts';
import { Crop } from 'src/types/Crops.ts';

const cropsAPI = {
  getAll: async(): Promise<Crop[]> => {
    return axiosInstance.get<Crop[]>(`/crops`).then((res) => res.data)
  }
}

export default cropsAPI;
