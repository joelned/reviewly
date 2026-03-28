import { useQuery } from '@tanstack/react-query'
import { axios } from '@/lib/axios'
import { type PaginatedResponse, type Review } from '@/types'

export function useReviewQueue(page = 1, size = 20) {
  return useQuery({
    queryKey: ['reviews', page, size],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Review>>('/reviews', {
        params: { page, size },
      })
      return data
    },
  })
}

