import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '@/lib/axios'
import { type CreateSubmissionPayload, type PaginatedResponse, type Submission, type SubmissionListParams, type User } from '@/types'

export interface ReviewerDirectoryItem extends User {
  load: number
  stats: {
    totalReviews: number
    avgRating: number
    currentLoad: number
  }
}

function buildParams(params: SubmissionListParams) {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.size) searchParams.set('size', String(params.size))
  if (params.search) searchParams.set('search', params.search)
  if (params.language) searchParams.set('language', params.language)
  if (params.date_from) searchParams.set('date_from', params.date_from)
  if (params.date_to) searchParams.set('date_to', params.date_to)
  params.statuses?.forEach((status) => searchParams.append('status', status))

  return searchParams
}

export function useSubmissions(params: SubmissionListParams) {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Submission>>('/submissions', {
        params: buildParams(params),
      })
      return data
    },
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSubmissionPayload) => {
      const { data } = await axios.post<Submission>('/submissions', payload)
      return data
    },
    onSuccess: () => {
      toast.success('Submission created and queued for review.')
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

export function useAvailableReviewers() {
  return useQuery({
    queryKey: ['reviewers', 'directory'],
    queryFn: async () => {
      const { data } = await axios.get<ReviewerDirectoryItem[]>('/reviewers')
      return data
    },
  })
}
