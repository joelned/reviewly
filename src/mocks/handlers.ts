import { delay, http, HttpResponse } from 'msw'
import {
  addReviewComment,
  assignReviewer,
  authenticate,
  closeSubmission,
  createSubmission,
  getRecentRegistrations,
  getReviewBySubmissionId,
  getReviewerLoad,
  getReviewerStats,
  getReviewers,
  getSubmission,
  getSubmissionsByStatusLast30Days,
  getUserById,
  getUserByToken,
  getUsers,
  listAdminUsers,
  listReviews,
  listSubmissions,
  registerUser,
  submitReview,
  toggleUserStatus,
  updateUserRole,
} from '@/mocks/data'
import { type AssignReviewerPayload, type CreateCommentPayload, type CreateSubmissionPayload, type RegisterCredentials, type SubmitReviewPayload, type UpdateRolePayload } from '@/types'

function getAuthorizedUser(request: Request) {
  const header = request.headers.get('Authorization')
  const token = header?.replace('Bearer ', '') ?? null
  return getUserByToken(token)
}

export const handlers = [
  http.post(`${import.meta.env.VITE_API_URL}/auth/login`, async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as { email: string; password: string }
    const token = authenticate(body.email, body.password)

    if (!token) {
      return HttpResponse.json({ detail: 'Invalid email or password.' }, { status: 401 })
    }

    return HttpResponse.json(token)
  }),

  http.post(`${import.meta.env.VITE_API_URL}/auth/register`, async ({ request }) => {
    await delay(500)
    const payload = (await request.json()) as RegisterCredentials
    const existing = getUsers().find((user) => user.email === payload.email)

    if (existing) {
      return HttpResponse.json(
        {
          errors: [{ field: 'email', message: 'That email is already in use.' }],
        },
        { status: 422 }
      )
    }

    return HttpResponse.json(registerUser(payload), { status: 201 })
  }),

  http.get(`${import.meta.env.VITE_API_URL}/auth/me`, async ({ request }) => {
    await delay(250)
    const user = getAuthorizedUser(request)

    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    return HttpResponse.json(user)
  }),

  http.get(`${import.meta.env.VITE_API_URL}/submissions`, async ({ request }) => {
    await delay(450)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    return HttpResponse.json(listSubmissions(user, url.searchParams))
  }),

  http.post(`${import.meta.env.VITE_API_URL}/submissions`, async ({ request }) => {
    await delay(600)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const submission = createSubmission(user, (await request.json()) as CreateSubmissionPayload)

    if (!submission) {
      return HttpResponse.json(
        {
          errors: [{ field: 'reviewer_id', message: 'Choose a valid reviewer before submitting.' }],
        },
        { status: 422 }
      )
    }

    return HttpResponse.json(submission, { status: 201 })
  }),

  http.get(`${import.meta.env.VITE_API_URL}/submissions/:id`, async ({ params, request }) => {
    await delay(350)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const submission = getSubmission(Number(params.id))
    if (!submission) {
      return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    }

    return HttpResponse.json(submission)
  }),

  http.delete(`${import.meta.env.VITE_API_URL}/submissions/:id`, async ({ params, request }) => {
    await delay(300)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    closeSubmission(user, Number(params.id))
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${import.meta.env.VITE_API_URL}/reviews`, async ({ request }) => {
    await delay(400)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const size = Number(url.searchParams.get('size') ?? '20')
    const status = url.searchParams.get('status') ?? undefined
    return HttpResponse.json(listReviews(user, page, size, status as 'assigned' | 'in_progress' | 'submitted' | undefined))
  }),

  http.get(`${import.meta.env.VITE_API_URL}/reviews/:submissionId`, async ({ params, request }) => {
    await delay(300)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const review = getReviewBySubmissionId(Number(params.submissionId))
    if (!review) {
      return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    }

    return HttpResponse.json(review)
  }),

  http.post(`${import.meta.env.VITE_API_URL}/reviews/:submissionId/comments`, async ({ params, request }) => {
    await delay(350)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const comment = addReviewComment(
      user,
      Number(params.submissionId),
      (await request.json()) as CreateCommentPayload
    )

    if (!comment) {
      return HttpResponse.json({ detail: 'Unable to add comment.' }, { status: 400 })
    }

    return HttpResponse.json(comment, { status: 201 })
  }),

  http.put(`${import.meta.env.VITE_API_URL}/reviews/:id/submit`, async ({ params, request }) => {
    await delay(450)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const review = submitReview(Number(params.id), (await request.json()) as SubmitReviewPayload)
    if (!review) {
      return HttpResponse.json({ detail: 'Review not found.' }, { status: 404 })
    }

    return HttpResponse.json(review)
  }),

  http.get(`${import.meta.env.VITE_API_URL}/admin/users`, async ({ request }) => {
    await delay(300)
    const user = getAuthorizedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ detail: 'Forbidden' }, { status: 401 })
    }

    return HttpResponse.json(listAdminUsers())
  }),

  http.put(`${import.meta.env.VITE_API_URL}/admin/users/:id/role`, async ({ params, request }) => {
    await delay(250)
    const user = getAuthorizedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ detail: 'Forbidden' }, { status: 401 })
    }

    const payload = (await request.json()) as UpdateRolePayload & { toggleStatus?: boolean }
    const targetUser = payload.toggleStatus
      ? toggleUserStatus(Number(params.id))
      : updateUserRole(Number(params.id), payload.role)

    if (!targetUser) {
      return HttpResponse.json({ detail: 'User not found' }, { status: 404 })
    }

    return HttpResponse.json(targetUser)
  }),

  http.post(`${import.meta.env.VITE_API_URL}/admin/assignments`, async ({ request }) => {
    await delay(350)
    const user = getAuthorizedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ detail: 'Forbidden' }, { status: 401 })
    }

    const payload = (await request.json()) as AssignReviewerPayload
    const submission = assignReviewer(payload.submissionId, payload.reviewerId)

    if (!submission) {
      return HttpResponse.json({ detail: 'Could not assign reviewer.' }, { status: 404 })
    }

    return HttpResponse.json(submission)
  }),

  http.get(`${import.meta.env.VITE_API_URL}/admin/metrics`, async ({ request }) => {
    await delay(150)
    const user = getAuthorizedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ detail: 'Forbidden' }, { status: 401 })
    }

    return HttpResponse.json({
      totalUsers: getUsers().length,
      activeReviewers: getReviewers().length,
      recentRegistrations: getRecentRegistrations(),
      submissionsByStatus: getSubmissionsByStatusLast30Days(),
      reviewerLoads: getReviewers().map((reviewer) => ({
        reviewer,
        load: getReviewerLoad(reviewer.id),
        stats: getReviewerStats(reviewer.id),
      })),
      unassigned: [105].map((id) => getSubmission(id)).filter(Boolean),
    })
  }),

  http.get(`${import.meta.env.VITE_API_URL}/admin/reviewers`, async ({ request }) => {
    await delay(200)
    const user = getAuthorizedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ detail: 'Forbidden' }, { status: 401 })
    }

    return HttpResponse.json(
      getReviewers().map((reviewer) => ({
        ...reviewer,
        load: getReviewerLoad(reviewer.id),
        stats: getReviewerStats(reviewer.id),
      }))
    )
  }),

  http.get(`${import.meta.env.VITE_API_URL}/reviewers`, async ({ request }) => {
    await delay(200)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    return HttpResponse.json(
      getReviewers().map((reviewer) => ({
        ...reviewer,
        load: getReviewerLoad(reviewer.id),
        stats: getReviewerStats(reviewer.id),
      }))
    )
  }),

  http.get(`${import.meta.env.VITE_API_URL}/users/:id`, async ({ params, request }) => {
    await delay(150)
    const user = getAuthorizedUser(request)
    if (!user) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const target = getUserById(Number(params.id))
    if (!target) {
      return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    }

    return HttpResponse.json(target)
  }),
]
