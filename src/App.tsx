import { useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { ReviewerOnlyRoute } from './components/layout/ReviewerOnlyRoute'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { FeedbackReportPage } from './pages/FeedbackReportPage'
import { NewSubmissionPage } from './pages/NewSubmissionPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { OrgSettingsPage } from './pages/OrgSettingsPage'
import { ProfileSettingsPage } from './pages/ProfileSettingsPage'
import { ReviewMobilePage } from './pages/ReviewMobilePage'
import { ReviewerProfilePage } from './pages/ReviewerProfilePage'
import { SubmissionDetailPage } from './pages/SubmissionDetailPage'

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const pendingShortcut = useRef<string | null>(null)
  const shortcutTimer = useRef<number | null>(null)

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      const tagName = target.tagName.toLowerCase()
      return (
        target.isContentEditable ||
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select'
      )
    }

    const clearPendingShortcut = () => {
      pendingShortcut.current = null
      if (shortcutTimer.current) {
        window.clearTimeout(shortcutTimer.current)
        shortcutTimer.current = null
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        navigate('/submissions/new')
        clearPendingShortcut()
        return
      }

      if (event.key.toLowerCase() === 'g' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        pendingShortcut.current = 'g'
        if (shortcutTimer.current) window.clearTimeout(shortcutTimer.current)
        shortcutTimer.current = window.setTimeout(clearPendingShortcut, 900)
        return
      }

      if (
        pendingShortcut.current === 'g' &&
        event.key.toLowerCase() === 'd' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault()
        navigate('/dashboard')
        clearPendingShortcut()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearPendingShortcut()
    }
  }, [navigate, location.pathname])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/submissions/new"
          element={
            <ProtectedRoute>
              <NewSubmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/402"
          element={
            <ProtectedRoute>
              <SubmissionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/402"
          element={
            <ProtectedRoute>
              <ReviewerOnlyRoute>
                <ReviewMobilePage />
              </ReviewerOnlyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/402"
          element={
            <ProtectedRoute>
              <FeedbackReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewers/sarah-connor"
          element={
            <ProtectedRoute>
              <ReviewerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/organization"
          element={
            <ProtectedRoute>
              <OrgSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submissions/detail-desktop"
          element={<Navigate to="/submissions/402" replace />}
        />
        <Route
          path="/submissions/detail-mobile"
          element={<Navigate to="/submissions/402" replace />}
        />
        <Route
          path="/submissions/402/mobile"
          element={<Navigate to="/submissions/402" replace />}
        />
        <Route path="/review/mobile" element={<Navigate to="/reviews/402" replace />} />
        <Route path="/reports/feedback" element={<Navigate to="/reports/402" replace />} />
        <Route path="/notifications/mobile" element={<Navigate to="/notifications" replace />} />
        <Route
          path="/reviewers/profile"
          element={<Navigate to="/reviewers/sarah-connor" replace />}
        />
        <Route
          path="/settings/org"
          element={<Navigate to="/settings/organization" replace />}
        />
        <Route
          path="/settings"
          element={<Navigate to="/settings/organization" replace />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
