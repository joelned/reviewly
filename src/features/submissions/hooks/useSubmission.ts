import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '@/lib/axios'
import { type Submission } from '@/types'

export function useSubmission(submissionId?: number) {
  return useQuery({
    queryKey: ['submission', submissionId],
    enabled: Boolean(submissionId),
    queryFn: async () => {
      const { data } = await axios.get<Submission>(`/submissions/${submissionId}`)
      return data
    },
  })
}

export function useCloseSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (submissionId: number) => {
      await axios.delete(`/submissions/${submissionId}`)
    },
    onSuccess: (_, submissionId) => {
      toast.success('Submission closed.')
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] })
    },
  })
}

