import { useQuery } from '@tanstack/react-query'
import { axios } from '@/lib/axios'
import { type PaginatedResponse, type Review, type ReviewStatus } from '@/types'

export function useReviewQueue(page = 1, size = 20, status?: ReviewStatus) {
  return useQuery({
    queryKey: ['reviews', page, size, status],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Review>>('/reviews', {
        params: { page, size, status },
      })
      return data
    },
  })
}
