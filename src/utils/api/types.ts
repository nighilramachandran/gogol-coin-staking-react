export interface ErrorRes {
  status: boolean
  message: string
  body: null
}

export interface Paginate {
  page: number
  count?: number
  canNext?: boolean
  canPrevious?: boolean
  search?: string
}

export interface Response<Type> {
  count: number
  data: Type[]
  page: string
  total_pages: number
  search?: string
}

