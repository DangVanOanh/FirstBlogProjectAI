import client from './client'
import type { ApiResponse } from './client'
import type { Tag } from '../types'

export const tagsApi = {
  getAll: async () => {
    const { data } = await client.get<ApiResponse<Tag[]>>('/tags')
    return data.data!
  },
  create: async (name: string) => {
    const { data } = await client.post<ApiResponse<Tag>>('/tags', { name })
    return data.data!
  },
  delete: async (id: number) => {
    await client.delete(`/tags/${id}`)
  }
}
