import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { type User } from '@/types'

interface UserAvatarProps {
  user: User
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar_url} alt={user.username} />
      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
    </Avatar>
  )
}

