import { addDays, subDays } from 'date-fns'
import {
  type CreateCommentPayload,
  type CreateSubmissionPayload,
  type PaginatedResponse,
  type RegisterCredentials,
  type Review,
  type ReviewComment,
  type ReviewStatus,
  type SubmitReviewPayload,
  type Submission,
  type User,
  type UserRole,
} from '@/types'

const now = new Date()

const users: User[] = [
  {
    id: 1,
    email: 'ava@author.dev',
    username: 'Ava Stone',
    role: 'author',
    created_at: subDays(now, 42).toISOString(),
    status: 'active',
  },
  {
    id: 2,
    email: 'marcus@reviewer.dev',
    username: 'Marcus Lee',
    role: 'reviewer',
    created_at: subDays(now, 58).toISOString(),
    status: 'active',
  },
  {
    id: 3,
    email: 'priya@admin.dev',
    username: 'Priya Nwosu',
    role: 'admin',
    created_at: subDays(now, 90).toISOString(),
    status: 'active',
  },
  {
    id: 4,
    email: 'sofia@reviewer.dev',
    username: 'Sofia Kim',
    role: 'reviewer',
    created_at: subDays(now, 31).toISOString(),
    status: 'active',
  },
  {
    id: 5,
    email: 'noah@author.dev',
    username: 'Noah Patel',
    role: 'author',
    created_at: subDays(now, 17).toISOString(),
    status: 'active',
  },
]

const passwords = new Map(
  users.map((user) => [
    user.email,
    {
      password: 'password123',
      userId: user.id,
    },
  ])
)

const sampleFiles = {
  typescript: `export function calculateReviewScore(metrics: number[]) {\n  if (!metrics.length) return 0\n\n  const total = metrics.reduce((sum, metric) => sum + metric, 0)\n  return Math.round((total / metrics.length) * 10) / 10\n}\n`,
  python: `def normalize_complexity(score: float) -> float:\n    if score < 0:\n        return 0.0\n    if score > 10:\n        return 10.0\n    return round(score, 2)\n`,
  go: `package checks\n\nfunc PendingCount(items []string) int {\n\tcount := 0\n\tfor _, item := range items {\n\t\tif item != "" {\n\t\t\tcount++\n\t\t}\n\t}\n\treturn count\n}\n`,
  java: `public class ReviewerMatcher {\n  public boolean canAssign(String reviewerRole) {\n    return reviewerRole != null && reviewerRole.equals("reviewer");\n  }\n}\n`,
}

let submissions: Submission[] = [
  {
    id: 101,
    title: 'Refactor payment webhook retries',
    description: 'Need a clean pass on idempotency handling and duplicate event protection.',
    language: 'TypeScript',
    status: 'in_review',
    author: users[0],
    reviewer: users[1],
    created_at: subDays(now, 5).toISOString(),
    updated_at: subDays(now, 1).toISOString(),
    urgency: 'high',
    focus_area: 'Idempotency, retry jitter, and failure visibility',
    review_preferences: 'Focus on race conditions and edge-case retries.',
    files: [
      {
        id: 201,
        filename: 'webhooks/retry-policy.ts',
        language: 'typescript',
        content: sampleFiles.typescript,
      },
    ],
    activity: [
      {
        id: 1,
        label: 'Submitted',
        description: 'Submission created and queued for reviewer assignment.',
        created_at: subDays(now, 5).toISOString(),
      },
      {
        id: 2,
        label: 'Assigned',
        description: 'Marcus Lee was assigned as reviewer.',
        created_at: subDays(now, 4).toISOString(),
      },
      {
        id: 3,
        label: 'Review in progress',
        description: 'Reviewer started leaving inline comments.',
        created_at: subDays(now, 1).toISOString(),
      },
    ],
  },
  {
    id: 102,
    title: 'Improve analytics query batching',
    description: 'Seeking performance review for new batching strategy.',
    language: 'Go',
    status: 'approved',
    author: users[0],
    reviewer: users[3],
    created_at: subDays(now, 12).toISOString(),
    updated_at: subDays(now, 6).toISOString(),
    urgency: 'normal',
    focus_area: 'Throughput, DB contention, traceability',
    review_preferences: 'Check for accidental N+1 patterns.',
    files: [
      {
        id: 202,
        filename: 'analytics/batcher.go',
        language: 'go',
        content: sampleFiles.go,
      },
    ],
    activity: [
      {
        id: 4,
        label: 'Approved',
        description: 'Review completed and approved.',
        created_at: subDays(now, 6).toISOString(),
      },
    ],
  },
  {
    id: 103,
    title: 'Stabilize search ranking heuristics',
    description: 'Looking for readability and correctness feedback.',
    language: 'Python',
    status: 'changes_requested',
    author: users[0],
    reviewer: users[1],
    created_at: subDays(now, 16).toISOString(),
    updated_at: subDays(now, 8).toISOString(),
    urgency: 'normal',
    focus_area: 'Explainability, thresholds, and score normalization',
    review_preferences: 'Please focus on maintainability and testability.',
    files: [
      {
        id: 203,
        filename: 'ranking/heuristics.py',
        language: 'python',
        content: sampleFiles.python,
      },
    ],
    activity: [
      {
        id: 5,
        label: 'Changes requested',
        description: 'Summary requested tighter guard rails around scoring.',
        created_at: subDays(now, 8).toISOString(),
      },
    ],
  },
  {
    id: 104,
    title: 'Add reviewer presence indicators',
    description: 'UI pass for richer activity indicators in the shell.',
    language: 'TypeScript',
    status: 'pending',
    author: users[0],
    created_at: subDays(now, 2).toISOString(),
    updated_at: subDays(now, 2).toISOString(),
    urgency: 'low',
    focus_area: 'State model and rendering performance',
    review_preferences: 'Prefer simple data flow over abstraction.',
    files: [
      {
        id: 204,
        filename: 'presence/sidebar-state.ts',
        language: 'typescript',
        content: sampleFiles.typescript,
      },
    ],
    activity: [
      {
        id: 6,
        label: 'Pending',
        description: 'Waiting for reviewer assignment.',
        created_at: subDays(now, 2).toISOString(),
      },
    ],
  },
  {
    id: 105,
    title: 'Harden reviewer eligibility checks',
    description: 'Please review the role gating before rollout.',
    language: 'Java',
    status: 'pending',
    author: users[4],
    created_at: subDays(now, 4).toISOString(),
    updated_at: subDays(now, 4).toISOString(),
    urgency: 'high',
    focus_area: 'Authorization, guard rails, null handling',
    review_preferences: 'Call out anything surprising in role evaluation.',
    files: [
      {
        id: 205,
        filename: 'auth/ReviewerMatcher.java',
        language: 'java',
        content: sampleFiles.java,
      },
    ],
    activity: [
      {
        id: 7,
        label: 'Pending',
        description: 'New submission waiting to be assigned.',
        created_at: subDays(now, 4).toISOString(),
      },
    ],
  },
  {
    id: 106,
    title: 'Refine profile completion nudges',
    description: 'Quick UX and logic pass on completion prompts.',
    language: 'TypeScript',
    status: 'approved',
    author: users[4],
    reviewer: users[3],
    created_at: subDays(now, 18).toISOString(),
    updated_at: subDays(now, 12).toISOString(),
    urgency: 'low',
    focus_area: 'State transitions and copy clarity',
    review_preferences: 'Keep complexity low.',
    files: [
      {
        id: 206,
        filename: 'profile/useCompletionPrompt.ts',
        language: 'typescript',
        content: sampleFiles.typescript,
      },
    ],
    activity: [
      {
        id: 8,
        label: 'Approved',
        description: 'Accepted with minor feedback.',
        created_at: subDays(now, 12).toISOString(),
      },
    ],
  },
  {
    id: 107,
    title: 'Queue stale-review notifications',
    description: 'Need help validating reminder cadence.',
    language: 'Python',
    status: 'in_review',
    author: users[4],
    reviewer: users[3],
    created_at: subDays(now, 7).toISOString(),
    updated_at: subDays(now, 2).toISOString(),
    urgency: 'normal',
    focus_area: 'Reminder cadence, duplicate notifications',
    review_preferences: 'Please inspect for notification storms.',
    files: [
      {
        id: 207,
        filename: 'notifications/stale_reviews.py',
        language: 'python',
        content: sampleFiles.python,
      },
    ],
    activity: [
      {
        id: 9,
        label: 'Review in progress',
        description: 'Sofia started review and added comments.',
        created_at: subDays(now, 2).toISOString(),
      },
    ],
  },
  {
    id: 108,
    title: 'Draft: cached reviewer metrics',
    description: 'Early draft for cacheability discussion.',
    language: 'TypeScript',
    status: 'draft',
    author: users[0],
    created_at: subDays(now, 1).toISOString(),
    updated_at: subDays(now, 1).toISOString(),
    urgency: 'low',
    focus_area: 'Still shaping the API',
    review_preferences: 'Not ready for submission yet.',
    files: [
      {
        id: 208,
        filename: 'reviewers/useMetricsCache.ts',
        language: 'typescript',
        content: sampleFiles.typescript,
      },
    ],
    activity: [
      {
        id: 10,
        label: 'Draft',
        description: 'Draft saved locally and not yet assigned.',
        created_at: subDays(now, 1).toISOString(),
      },
    ],
  },
]

let reviews: Review[] = [
  {
    id: 301,
    submission_id: 102,
    reviewer: users[3],
    status: 'submitted',
    summary:
      'Strong improvement overall. Query batching is clear and the data flow is predictable. I left one note around instrumentation breadth, but the implementation is ready to merge.',
    rating: 5,
    verdict: 'approve',
    created_at: subDays(now, 11).toISOString(),
    submitted_at: subDays(now, 6).toISOString(),
    comments: [
      {
        id: 401,
        review_id: 301,
        file_id: 202,
        line_number: 4,
        content: 'Nice and direct loop. Consider renaming `items` to `queries` if that is always true.',
        author: users[3],
        created_at: subDays(now, 8).toISOString(),
      },
    ],
  },
  {
    id: 302,
    submission_id: 103,
    reviewer: users[1],
    status: 'submitted',
    summary:
      'The scoring guard rails are close, but the boundary conditions need clearer defaults. I requested changes around outlier handling and test coverage before approval.',
    rating: 3,
    verdict: 'request_changes',
    created_at: subDays(now, 15).toISOString(),
    submitted_at: subDays(now, 8).toISOString(),
    comments: [
      {
        id: 402,
        review_id: 302,
        file_id: 203,
        line_number: 2,
        content: 'Could we centralize the lower-bound guard to keep future tuning consistent?',
        author: users[1],
        created_at: subDays(now, 9).toISOString(),
      },
      {
        id: 403,
        review_id: 302,
        file_id: 203,
        line_number: 4,
        content: 'We should document why the upper clamp is fixed at 10.',
        author: users[1],
        created_at: subDays(now, 9).toISOString(),
      },
    ],
  },
  {
    id: 303,
    submission_id: 106,
    reviewer: users[3],
    status: 'submitted',
    summary:
      'The prompt nudges are focused and low risk. I left one small comment on wording, but the state transition logic looks solid.',
    rating: 4,
    verdict: 'approve',
    created_at: subDays(now, 16).toISOString(),
    submitted_at: subDays(now, 12).toISOString(),
    comments: [
      {
        id: 404,
        review_id: 303,
        file_id: 206,
        line_number: 1,
        content: 'This helper feels straightforward. Nice restraint on abstraction.',
        author: users[3],
        created_at: subDays(now, 13).toISOString(),
      },
    ],
  },
  {
    id: 304,
    submission_id: 101,
    reviewer: users[1],
    status: 'in_progress',
    created_at: subDays(now, 4).toISOString(),
    comments: [
      {
        id: 405,
        review_id: 304,
        file_id: 201,
        line_number: 3,
        content: 'Can we expose the empty-metric path in telemetry so retries are easier to inspect?',
        author: users[1],
        created_at: subDays(now, 1).toISOString(),
      },
    ],
  },
  {
    id: 305,
    submission_id: 107,
    reviewer: users[3],
    status: 'assigned',
    created_at: subDays(now, 6).toISOString(),
    comments: [],
  },
]

let nextUserId = 6
let nextSubmissionId = 109
let nextFileId = 209
let nextReviewId = 306
let nextCommentId = 406

function createToken(userId: number) {
  return `token-${userId}`
}

export function getUsers() {
  return [...users]
}

export function getReviewers() {
  return users.filter((user) => user.role === 'reviewer' && user.status !== 'inactive')
}

export function getUserByToken(token: string | null) {
  if (!token?.startsWith('token-')) {
    return null
  }

  const userId = Number(token.replace('token-', ''))
  return users.find((user) => user.id === userId) ?? null
}

export function getUserById(userId: number) {
  return users.find((user) => user.id === userId) ?? null
}

export function authenticate(email: string, password: string) {
  const record = passwords.get(email)
  if (!record || record.password !== password) {
    return null
  }

  return {
    access_token: createToken(record.userId),
    token_type: 'bearer',
  }
}

export function registerUser(payload: RegisterCredentials) {
  const user: User = {
    id: nextUserId++,
    email: payload.email,
    username: payload.username,
    role: payload.role,
    created_at: new Date().toISOString(),
    status: 'active',
  }

  users.unshift(user)
  passwords.set(payload.email, {
    password: payload.password,
    userId: user.id,
  })

  return user
}

export function paginate<T>(items: T[], page = 1, size = 10): PaginatedResponse<T> {
  const start = (page - 1) * size
  const sliced = items.slice(start, start + size)
  return {
    items: sliced,
    total: items.length,
    page,
    size,
    pages: Math.max(1, Math.ceil(items.length / size)),
  }
}

export function listSubmissions(currentUser: User, params: URLSearchParams) {
  const search = params.get('search')?.toLowerCase() ?? ''
  const language = params.get('language')
  const statuses = params.getAll('status')
  const from = params.get('date_from')
  const to = params.get('date_to')
  const page = Number(params.get('page') ?? '1')
  const size = Number(params.get('size') ?? '10')

  let items = submissions

  if (currentUser.role === 'author') {
    items = items.filter((submission) => submission.author.id === currentUser.id)
  }
  if (currentUser.role === 'reviewer') {
    items = items.filter((submission) => submission.reviewer?.id === currentUser.id)
  }

  if (search) {
    items = items.filter((submission) => {
      return (
        submission.title.toLowerCase().includes(search) ||
        submission.description.toLowerCase().includes(search) ||
        submission.language.toLowerCase().includes(search)
      )
    })
  }

  if (language) {
    items = items.filter((submission) => submission.language === language)
  }

  if (statuses.length) {
    items = items.filter((submission) => statuses.includes(submission.status))
  }

  if (from) {
    items = items.filter((submission) => submission.created_at >= new Date(from).toISOString())
  }

  if (to) {
    items = items.filter((submission) => submission.created_at <= addDays(new Date(to), 1).toISOString())
  }

  return paginate(items.sort((left, right) => right.created_at.localeCompare(left.created_at)), page, size)
}

export function getSubmission(submissionId: number) {
  return submissions.find((submission) => submission.id === submissionId) ?? null
}

export function createSubmission(author: User, payload: CreateSubmissionPayload) {
  const reviewer = getUserById(payload.reviewer_id)

  if (!reviewer || reviewer.role !== 'reviewer') {
    return null
  }

  const submission: Submission = {
    id: nextSubmissionId++,
    title: payload.title,
    description: payload.description,
    language: payload.language,
    status: 'pending',
    author,
    reviewer,
    files: payload.files.map((file) => ({
      ...file,
      id: nextFileId++,
    })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    urgency: payload.urgency,
    focus_area: payload.focus_area,
    review_preferences: payload.focus_area,
    activity: [
      {
        id: Date.now(),
        label: 'Submitted',
        description: `Submission created and sent to ${reviewer.username} for review.`,
        created_at: new Date().toISOString(),
      },
      {
        id: Date.now() + 1,
        label: 'Reviewer selected',
        description: `${reviewer.username} was chosen by the author before submission.`,
        created_at: new Date().toISOString(),
      },
    ],
  }

  submissions = [submission, ...submissions]
  reviews = [
    {
      id: nextReviewId++,
      submission_id: submission.id,
      reviewer,
      status: 'assigned',
      created_at: new Date().toISOString(),
      comments: [],
    },
    ...reviews,
  ]
  return submission
}

export function closeSubmission(currentUser: User, submissionId: number) {
  submissions = submissions.map((submission) =>
    submission.id === submissionId && submission.author.id === currentUser.id
      ? {
          ...submission,
          status: 'closed',
          updated_at: new Date().toISOString(),
          activity: [
            {
              id: Date.now(),
              label: 'Closed',
              description: 'Author closed the submission before review started.',
              created_at: new Date().toISOString(),
            },
            ...(submission.activity ?? []),
          ],
        }
      : submission
  )
}

export function listReviews(currentUser: User, page = 1, size = 10, status?: ReviewStatus) {
  const items =
    currentUser.role === 'reviewer'
      ? reviews.filter((review) => review.reviewer.id === currentUser.id)
      : reviews

  return paginate(
    items
      .filter((review) => (status ? review.status === status : true))
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .map((review) => ({
        ...review,
        submission: getSubmission(review.submission_id) ?? undefined,
      })),
    page,
    size
  )
}

export function getReviewBySubmissionId(submissionId: number) {
  return reviews.find((review) => review.submission_id === submissionId) ?? null
}

export function addReviewComment(currentUser: User, submissionId: number, payload: CreateCommentPayload) {
  let review = getReviewBySubmissionId(submissionId)
  if (!review) {
    const submission = getSubmission(submissionId)
    if (!submission?.reviewer) {
      return null
    }

    review = {
      id: nextReviewId++,
      submission_id: submissionId,
      reviewer: submission.reviewer,
      status: 'in_progress',
      created_at: new Date().toISOString(),
      comments: [],
    }
    reviews = [review, ...reviews]
  }

  const comment: ReviewComment = {
    id: nextCommentId++,
    review_id: review.id,
    file_id: payload.file_id,
    line_number: payload.line_number,
    content: payload.content,
    author: currentUser,
    created_at: new Date().toISOString(),
  }

  reviews = reviews.map((item) =>
    item.id === review?.id
      ? {
          ...item,
          status: 'in_progress',
          comments: [...item.comments, comment],
        }
      : item
  )

  submissions = submissions.map((submission) =>
    submission.id === submissionId
      ? {
          ...submission,
          status: 'in_review',
          updated_at: new Date().toISOString(),
        }
      : submission
  )

  return comment
}

export function submitReview(reviewId: number, payload: SubmitReviewPayload) {
  let updatedReview: Review | null = null

  reviews = reviews.map((review) => {
    if (review.id !== reviewId) {
      return review
    }

    updatedReview = {
      ...review,
      status: 'submitted',
      summary: payload.summary,
      rating: payload.rating,
      verdict: payload.verdict,
      submitted_at: new Date().toISOString(),
    }
    return updatedReview
  })

  if (!updatedReview) {
    return null
  }

  submissions = submissions.map((submission) =>
    submission.id === updatedReview?.submission_id
      ? {
          ...submission,
          status: payload.verdict === 'approve' ? 'approved' : 'changes_requested',
          updated_at: new Date().toISOString(),
          activity: [
            {
              id: Date.now(),
              label: payload.verdict === 'approve' ? 'Approved' : 'Changes requested',
              description: 'Reviewer submitted the final summary.',
              created_at: new Date().toISOString(),
            },
            ...(submission.activity ?? []),
          ],
        }
      : submission
  )

  return updatedReview
}

export function listAdminUsers(page = 1, size = 20) {
  return paginate(users, page, size)
}

export function updateUserRole(userId: number, role: UserRole) {
  let updatedUser: User | null = null

  for (const user of users) {
    if (user.id === userId) {
      user.role = role
      updatedUser = user
    }
  }

  return updatedUser
}

export function toggleUserStatus(userId: number) {
  let updatedUser: User | null = null

  for (const user of users) {
    if (user.id === userId) {
      user.status = user.status === 'inactive' ? 'active' : 'inactive'
      updatedUser = user
    }
  }

  return updatedUser
}

export function assignReviewer(submissionId: number, reviewerId: number) {
  const reviewer = getUserById(reviewerId)
  if (!reviewer) {
    return null
  }

  let updatedSubmission: Submission | null = null

  submissions = submissions.map((submission) => {
    if (submission.id !== submissionId) {
      return submission
    }

    updatedSubmission = {
      ...submission,
      reviewer,
      status: 'in_review',
      updated_at: new Date().toISOString(),
      activity: [
        {
          id: Date.now(),
          label: 'Assigned',
          description: `${reviewer.username} is now assigned to this submission.`,
          created_at: new Date().toISOString(),
        },
        ...(submission.activity ?? []),
      ],
    }
    return updatedSubmission
  })

  if (!updatedSubmission) {
    return null
  }

  const existingReview = getReviewBySubmissionId(submissionId)
  if (!existingReview) {
    reviews = [
      {
        id: nextReviewId++,
        submission_id: submissionId,
        reviewer,
        status: 'assigned',
        created_at: new Date().toISOString(),
        comments: [],
      },
      ...reviews,
    ]
  }

  return updatedSubmission
}

export function getReviewerLoad(reviewerId: number) {
  return reviews.filter(
    (review) =>
      review.reviewer.id === reviewerId && (review.status === 'assigned' || review.status === 'in_progress')
  ).length
}

export function getReviewerStats(reviewerId: number) {
  const reviewerReviews = reviews.filter((review) => review.reviewer.id === reviewerId)
  const completed = reviewerReviews.filter((review) => review.status === 'submitted')
  const rating =
    completed.reduce((sum, review) => sum + (review.rating ?? 0), 0) / (completed.length || 1)

  return {
    totalReviews: reviewerReviews.length,
    avgRating: Number(rating.toFixed(1)),
    currentLoad: getReviewerLoad(reviewerId),
  }
}

export function getDashboardActivity(currentUser: User) {
  if (currentUser.role === 'author') {
    return submissions
      .filter((submission) => submission.author.id === currentUser.id)
      .flatMap((submission) =>
        (submission.activity ?? []).map((activity) => ({
          ...activity,
          submissionId: submission.id,
          submissionTitle: submission.title,
        }))
      )
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .slice(0, 8)
  }

  return reviews
    .filter((review) => review.reviewer.id === currentUser.id)
    .map((review) => {
      const submission = getSubmission(review.submission_id)
      return {
        id: review.id,
        label: review.status === 'submitted' ? 'Review submitted' : 'Review activity',
        description: submission ? `${submission.title} is ${review.status.replace('_', ' ')}` : 'Review updated',
        created_at: review.submitted_at ?? review.created_at,
      }
    })
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .slice(0, 8)
}

export function getRecentRegistrations() {
  return [...users].sort((left, right) => right.created_at.localeCompare(left.created_at)).slice(0, 5)
}

export function getSubmissionsByStatusLast30Days() {
  return ['pending', 'in_review', 'changes_requested', 'approved', 'closed'].map((status) => ({
    status,
    count: submissions.filter((submission) => submission.status === status).length,
  }))
}
