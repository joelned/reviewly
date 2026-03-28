import { Activity, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { StatCard } from '@/features/dashboard/components/StatCard'

interface PlatformStatsProps {
  totalUsers: number
  totalSubmissions: number
  activeReviews: number
  completionRate: string
}

export function PlatformStats({ totalUsers, totalSubmissions, activeReviews, completionRate }: PlatformStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total users" value={totalUsers} helper="Across all roles" icon={Users} />
      <StatCard label="Submissions" value={totalSubmissions} helper="Code review requests in system" icon={Sparkles} />
      <StatCard label="Active reviews" value={activeReviews} helper="Assigned or in progress right now" icon={Activity} />
      <StatCard label="Completion rate" value={completionRate} helper="Approved or changes requested" icon={ShieldCheck} />
    </div>
  )
}
