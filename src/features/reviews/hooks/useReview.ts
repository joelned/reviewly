import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '@/lib/axios'
import { type CreateCommentPayload, type Review, type ReviewComment, type SubmitReviewPayload } from '@/types'

export function useReview(submissionId?: number) {
  return useQuery({
    queryKey: ['review', submissionId],
    enabled: Boolean(submissionId),
    queryFn: async () => {
      const { data } = await axios.get<Review>(`/reviews/${submissionId}`)
      return data
    },
  })
}

export function useAddReviewComment(submissionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const { data } = await axios.post<ReviewComment>(`/reviews/${submissionId}/comments`, payload)
      return data
    },
    onSuccess: () => {
      toast.success('Inline comment added.')
      queryClient.invalidateQueries({ queryKey: ['review', submissionId] })
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export function useSubmitReview(reviewId: number, submissionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const { data } = await axios.put<Review>(`/reviews/${reviewId}/submit`, payload)
      return data
    },
    onSuccess: () => {
      toast.success('Review submitted successfully.')
      queryClient.invalidateQueries({ queryKey: ['review', submissionId] })
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}
