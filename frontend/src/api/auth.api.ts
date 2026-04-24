import client from './client'
import type { ApiResponse } from './client'

export const authApi = {
  login: async (username: string, password: string): Promise<string> => {
    const { data } = await client.post<ApiResponse<{ token: string }>>('/auth/login', { username, password })
    return data.data!.token
  }
}
