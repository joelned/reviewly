import { type UserRole } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function UserRoleSelector({
  value,
  onChange,
}: {
  value: UserRole
  onChange: (value: UserRole) => void
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as UserRole)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="author">Author</SelectItem>
        <SelectItem value="reviewer">Reviewer</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}

