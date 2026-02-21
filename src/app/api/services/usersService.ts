import { apiClient } from '../client';
import type { ApiUser, CreateUserRequest, UpdateUserRequest } from '../types/user';

const USERS_PATH = '/users';

export const usersService = {
  async getList(): Promise<ApiUser[]> {
    return apiClient<ApiUser[]>(USERS_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<ApiUser> {
    return apiClient<ApiUser>(`${USERS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateUserRequest): Promise<ApiUser> {
    return apiClient<ApiUser>(USERS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateUserRequest): Promise<ApiUser> {
    return apiClient<ApiUser>(`${USERS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    return apiClient<void>(`${USERS_PATH}/${id}`, { method: 'DELETE' });
  },
};
