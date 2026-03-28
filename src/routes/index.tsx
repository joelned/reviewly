import { Suspense, lazy, type LazyExoticComponent, type ComponentType } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { PageLoadingFallback } from '@/components/shared/PageLoadingFallback'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleGuard } from '@/routes/RoleGuard'

const LoginPage = lazy(async () => {
  const module = await import('@/features/auth/pages/LoginPage')
  return { default: module.LoginPage }
})

const RegisterPage = lazy(async () => {
  const module = await import('@/features/auth/pages/RegisterPage')
  return { default: module.RegisterPage }
})

const DashboardPage = lazy(async () => {
  const module = await import('@/features/dashboard/pages/DashboardPage')
  return { default: module.DashboardPage }
})

const SubmissionsListPage = lazy(async () => {
  const module = await import('@/features/submissions/pages/SubmissionsListPage')
  return { default: module.SubmissionsListPage }
})

const NewSubmissionPage = lazy(async () => {
  const module = await import('@/features/submissions/pages/NewSubmissionPage')
  return { default: module.NewSubmissionPage }
})

const SubmissionDetailPage = lazy(async () => {
  const module = await import('@/features/submissions/pages/SubmissionDetailPage')
  return { default: module.SubmissionDetailPage }
})

const ReviewQueuePage = lazy(async () => {
  const module = await import('@/features/reviews/pages/ReviewQueuePage')
  return { default: module.ReviewQueuePage }
})

const ReviewEditorPage = lazy(async () => {
  const module = await import('@/features/reviews/pages/ReviewEditorPage')
  return { default: module.ReviewEditorPage }
})

const UsersPage = lazy(async () => {
  const module = await import('@/features/admin/pages/UsersPage')
  return { default: module.UsersPage }
})

const AssignmentsPage = lazy(async () => {
  const module = await import('@/features/admin/pages/AssignmentsPage')
  return { default: module.AssignmentsPage }
})

function withSuspense(Component: LazyExoticComponent<ComponentType>, fullScreen = false) {
  return (
    <Suspense fallback={<PageLoadingFallback fullScreen={fullScreen} />}>
      <Component />
    </Suspense>
  )
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: withSuspense(LoginPage, true),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage, true),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/dashboard',
            element: withSuspense(DashboardPage),
          },
          {
            path: '/submissions',
            element: withSuspense(SubmissionsListPage),
          },
          {
            path: '/submissions/:id',
            element: withSuspense(SubmissionDetailPage),
          },
          {
            element: <RoleGuard allowedRoles={['author']} />,
            children: [
              {
                path: '/submissions/new',
                element: withSuspense(NewSubmissionPage),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              {
                path: '/admin/users',
                element: withSuspense(UsersPage),
              },
              {
                path: '/admin/assignments',
                element: withSuspense(AssignmentsPage),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['reviewer']} />,
            children: [
              {
                path: '/reviews',
                element: withSuspense(ReviewQueuePage),
              },
            ],
          },
        ],
      },
      {
        element: <RoleGuard allowedRoles={['reviewer']} />,
        children: [
          {
            path: '/reviews/:id',
            element: withSuspense(ReviewEditorPage, true),
          },
        ],
      },
    ],
  },
])
