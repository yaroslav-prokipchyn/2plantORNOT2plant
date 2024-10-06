import axiosInstance from 'src/api/axiosInstance.ts';
import { Roles, User, UserDetails } from 'src/types/Users.ts';

const usersAPI = {
  getCurrent: async () => {
    return axiosInstance.get<User>(`/users/current`).then((res) => res.data)
  },
  getAll: async (role: Roles, active?: boolean): Promise<User[]> => {
    return axiosInstance.get<User[]>(`/users`, { params: { role, active } }).then((res) => res.data)
  },
  getById: async (id: number): Promise<User> => {
    return axiosInstance.get<User>(`/users/${id}`).then((res) => res.data)
  },
  create: async (user: UserDetails): Promise<User> => {
    return axiosInstance.post<User>(`/users`, user).then((res) => res.data)
  },
  edit: async (id: number, userDetails: Omit<User, 'id'>): Promise<User> => {
    return axiosInstance.put<User>(`/users/${id}`, userDetails).then((res) => res.data)
  },
  editStatus: async (id: number, status: boolean): Promise<User> => {
    return axiosInstance.put<User>(`/users/${id}/status?active=${status}`).then((res) => res.data)
  },
  delete: async (id: number): Promise<number> => {
    return axiosInstance.delete<number>(`/users/${id}`).then((res) => res.data)
  }
}

export default usersAPI