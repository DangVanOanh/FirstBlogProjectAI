import client from './client'
import type { ApiResponse } from './client'
import type { CreatePostRequest, PagedResponse, PostDetail, PostSummary } from '../types'

export const postsApi = {
  getAll: async (page = 1, pageSize = 5, tag?: string) => {
    const { data } = await client.get<ApiResponse<PagedResponse<PostSummary>>>('/posts', {
      params: { page, pageSize, ...(tag && { tag }) }
    })
    return data.data!
  },
  getBySlug: async (slug: string) => {
    const { data } = await client.get<ApiResponse<PostDetail>>(`/posts/${slug}`)
    return data.data!
  },
  search: async (q: string) => {
    const { data } = await client.get<ApiResponse<PostSummary[]>>('/posts/search', { params: { q } })
    return data.data!
  },
  create: async (post: CreatePostRequest) => {
    const { data } = await client.post<ApiResponse<PostDetail>>('/posts', post)
    return data.data!
  },
  update: async (id: number, post: CreatePostRequest) => {
    await client.put(`/posts/${id}`, post)
  },
  delete: async (id: number) => {
    await client.delete(`/posts/${id}`)
  }
}
