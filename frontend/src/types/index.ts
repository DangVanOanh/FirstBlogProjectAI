export interface Tag {
  id: number
  name: string
  slug: string
}

export interface PostSummary {
  id: number
  title: string
  slug: string
  thumbnail: string | null
  tags: string[]
  createdAt: string
}

export interface PostDetail {
  id: number
  title: string
  slug: string
  content: string
  thumbnail: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  authorName: string
  content: string
  createdAt: string
}

export interface PagedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface CreatePostRequest {
  title: string
  content: string
  thumbnail: string
  tagIds: number[]
}
