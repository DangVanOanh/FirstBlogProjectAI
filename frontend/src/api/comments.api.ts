import client from './client'
import type { ApiResponse } from './client'
import type { Comment } from '../types'

export const commentsApi = {
  getByPost: async (postId: number) => {
    const { data } = await client.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`)
    return data.data!
  },
  create: async (postId: number, authorName: string, content: string) => {
    const { data } = await client.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, { authorName, content })
    return data.data!
  }
}
