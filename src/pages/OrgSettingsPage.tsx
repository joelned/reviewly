import { useRef, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Copy,
  KeyRound,
  Layers3,
  MoreVertical,
  Search,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Avatar,
  DesktopViewport,
  ScreenCanvas,
  WorkspaceShell,
} from '../components/showcase'
import { AccountMenu } from '../components/ui/AccountMenu'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Select } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Toast } from '../components/ui/Toast'

const tabs = ['general', 'members', 'billing', 'api', 'danger'] as const
const tabLabels = {
  api: 'API Keys',
  billing: 'Billing',
  danger: 'Danger Zone',
  general: 'General',
  members: 'Members',
}

export function OrgSettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>('general')
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteSlug, setDeleteSlug] = useState('')
  const [savingGeneral, setSavingGeneral] = useState(false)
  const [copyingKey, setCopyingKey] = useState(false)
  const [deletingOrg, setDeletingOrg] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [avatarFileName, setAvatarFileName] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const initials =
    user?.displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? 'EM'

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const handleSaveGeneral = () => {
    setSavingGeneral(true)
    window.requestAnimationFrame(() => {
      setSavingGeneral(false)
      showToast('General settings updated')
    })
  }

  const handleCopyKey = () => {
    setCopyingKey(true)
    window.requestAnimationFrame(async () => {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText('rev_live_a1b2c3d4e5f6g7h8i9j0')
        }
      } catch {
        // Fall back to the same confirmation feedback even if clipboard is unavailable.
      }
      setCopyingKey(false)
      showToast('API Key copied to clipboard')
    })
  }

  const handleDeleteOrg = () => {
    setDeletingOrg(true)
    window.requestAnimationFrame(() => {
      setDeletingOrg(false)
      setDeleteModalOpen(false)
      setDeleteSlug('')
      showToast('Organization deletion requires final owner confirmation')
    })
  }

  const handleInviteMember = () => {
    showToast('Invite flow opens from your team directory integration')
  }

  const handleManageMember = (name: string) => {
    showToast(`Member management for ${name} opens in the access panel`)
  }

  const handleRevokeKey = (name: string) => {
    showToast(`${name} revoke flow requires owner approval`)
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent p-0">
        <DesktopViewport className="relative min-h-[calc(100svh-3rem)] lg:min-h-[920px]">
          <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
            <WorkspaceShell wide className="flex items-center justify-between px-4 py-3 lg:px-6">
              <div className="flex items-center gap-2">
                <div className="rounded bg-brand p-1 text-white shadow-md shadow-brand/20">
                  <Layers3 className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Reviewly
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  aria-label="Open notifications"
                  className="text-text-body hover:text-text-strong"
                  onClick={() => navigate('/notifications')}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <AccountMenu initials={initials} />
              </div>
            </WorkspaceShell>
            <nav className="hide-scrollbar flex gap-4 overflow-x-auto px-4 text-sm font-medium text-text-muted sm:gap-6 lg:hidden">
              <SegmentedControl
                ariaLabel="Organization settings sections"
                className="mb-3 w-full min-w-max bg-transparent p-0"
                onChange={setActiveTab}
                options={tabs.map((tab) => ({
                  label: tab === 'api' ? 'API Keys' : tab.replace('-', ' '),
                  value: tab,
                }))}
                value={activeTab}
              />
            </nav>
          </header>

          <WorkspaceShell wide className="px-4 py-6 lg:px-6 lg:py-8">
            <main key={activeTab} className="grid animate-fade-in gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <aside className="hidden lg:block">
                <Card elevated className="sticky top-24 space-y-2">
                  <div className="px-2 pb-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      Settings
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      Keep identity, access, billing, and risk controls separated so
                      each admin task is easier to find under pressure.
                    </p>
                  </div>
                  {tabs.map((tab) => {
                    const active = activeTab === tab
                    return (
                      <button
                        key={tab}
                        className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                          active
                            ? 'bg-brand text-white shadow-sm shadow-brand/15'
                            : 'text-text-body hover:bg-neutral-100 hover:text-text-strong'
                        }`}
                        onClick={() => setActiveTab(tab)}
                        type="button"
                      >
                        {tabLabels[tab]}
                      </button>
                    )
                  })}
                </Card>
              </aside>

              <div className="min-w-0">
            {activeTab === 'general' && (
              <section className="space-y-8 py-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">General Settings</h2>
                  <p className="text-sm text-text-muted">
                    Manage your organization&apos;s core identity.
                  </p>
                </div>
                <Card className="space-y-6" elevated>
                  <Field label="Organization Name">
                    <Input
                      className="rounded-md focus:border-black"
                      defaultValue="Acme Development"
                      type="text"
                    />
                  </Field>
                  <Field
                    hint="Slugs are used for team URLs and cannot be changed."
                    label="Organization Slug"
                  >
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-neutral-200 bg-neutral-50 px-3 text-sm text-text-muted">
                        reviewly.app/org/
                      </span>
                      <Input
                        className="flex-1 rounded-l-none rounded-r-md border-neutral-200 bg-neutral-50 text-text-muted"
                        readOnly
                        type="text"
                        value="acme-dev"
                      />
                    </div>
                  </Field>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">
                      Organization Avatar
                    </span>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <Avatar className="h-16 w-16 rounded-lg text-lg" initials="AD" />
                      <input
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          setAvatarFileName(file.name)
                          showToast(`Selected avatar: ${file.name}`)
                        }}
                        ref={avatarInputRef}
                        type="file"
                      />
                      <Button
                        className="w-fit"
                        onClick={() => avatarInputRef.current?.click()}
                        type="button"
                        variant="outline"
                      >
                        Upload new
                      </Button>
                      <Button
                        className="w-fit text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          setAvatarFileName('')
                          if (avatarInputRef.current) {
                            avatarInputRef.current.value = ''
                          }
                          showToast('Organization avatar removed')
                        }}
                        type="button"
                        variant="ghost"
                      >
                        Remove
                      </Button>
                    </div>
                    {avatarFileName ? (
                      <p className="text-xs text-text-muted">{avatarFileName}</p>
                    ) : null}
                  </div>
                </Card>
                <div className="flex justify-end border-t pt-6">
                  <Button
                    loading={savingGeneral}
                    onClick={handleSaveGeneral}
                    type="button"
                    variant="secondary"
                  >
                    Save Changes
                  </Button>
                </div>
              </section>
            )}

            {activeTab === 'members' && (
              <section className="space-y-8 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <p className="text-sm text-gray-500">
                      Manage access for your organization.
                    </p>
                  </div>
                  <Button
                    leadingIcon={<KeyRound className="h-4 w-4" />}
                    onClick={handleInviteMember}
                    type="button"
                    variant="secondary"
                  >
                    Invite
                  </Button>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="space-y-2" elevated>
                    <div className="text-sm font-semibold text-text-strong">Access overview</div>
                    <p className="text-sm leading-6 text-text-muted">
                      Owners and admins can change permissions, invite teammates, and manage
                      review visibility across the workspace.
                    </p>
                  </Card>
                  <Card className="space-y-2" elevated>
                    <div className="text-sm font-semibold text-text-strong">Pending decisions</div>
                    <p className="text-sm leading-6 text-text-muted">
                      Review role changes and pending invites together so access updates do not
                      get lost in day-to-day member maintenance.
                    </p>
                  </Card>
                </div>
                <Card className="space-y-3" surface="subtle">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Member Limit</span>
                    <span className="text-text-muted">8 of 20 used</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-200">
                    <div className="h-2 w-[40%] rounded-full bg-brand" />
                  </div>
                </Card>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input
                    aria-label="Search team members"
                    className="rounded-md py-2.5 pl-10 focus:border-brand"
                    placeholder="Search members..."
                    type="text"
                  />
                </div>
                <Card className="overflow-hidden" padding="none">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[28rem] text-left text-sm sm:min-w-[30rem]">
                      <thead className="border-b bg-neutral-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-text-muted">
                            Member
                          </th>
                          <th className="px-4 py-3 font-medium text-text-muted">
                            Role
                          </th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8" initials="SC" />
                              <div>
                                <div className="font-medium text-text-strong">
                                  Sarah Chen
                                </div>
                                <div className="text-xs text-text-muted">
                                  sarah@acme.dev
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Select
                              aria-label="Change Sarah Chen's role"
                              className="min-h-[40px] min-w-[7.5rem] rounded-lg border-neutral-200 px-3 py-2 text-sm font-medium"
                            >
                              <option>Owner</option>
                              <option>Admin</option>
                              <option>Member</option>
                            </Select>
                          </td>
                          <td className="w-[1%] whitespace-nowrap px-4 py-4 text-right text-neutral-400">
                            <button
                              aria-label="Open actions for Sarah Chen"
                              className="ml-auto inline-flex rounded-full p-2 transition hover:bg-neutral-100"
                              onClick={() => handleManageMember('Sarah Chen')}
                              type="button"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            )}

            {activeTab === 'billing' && (
              <section className="space-y-8 py-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Billing &amp; Usage</h2>
                  <p className="text-sm text-text-muted">
                    Manage your subscription and track usage.
                  </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="space-y-3" elevated>
                    <div className="text-sm font-semibold text-text-strong">Billing overview</div>
                    <p className="text-sm leading-6 text-text-muted">
                      Start here for plan, renewal, and payment health before you review invoices
                      or usage trends.
                    </p>
                  </Card>
                  <Card className="space-y-3" elevated>
                    <div className="text-sm font-semibold text-text-strong">Usage attention</div>
                    <p className="text-sm leading-6 text-text-muted">
                      At 68% of quota used, there is room left this cycle. You only need to act
                      if request volume accelerates.
                    </p>
                  </Card>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="flex flex-col justify-between space-y-4" elevated>
                    <div className="text-sm font-semibold text-text-strong">Current plan</div>
                    <div>
                      <div className="mb-4 flex items-start justify-between">
                        <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
                          PRO
                        </span>
                        <span className="text-sm font-medium text-text-muted">
                          Billing changes managed by workspace owners
                        </span>
                      </div>
                      <h3 className="mb-1 text-3xl font-bold">
                        $29
                        <span className="text-base font-normal text-text-muted">
                          /mo
                        </span>
                      </h3>
                      <p className="mb-4 text-sm text-text-muted">
                        Renews on Oct 12, 2023
                      </p>
                    </div>
                    <p className="rounded bg-neutral-50 p-2 text-xs text-neutral-400">
                      Overage: $0.10 per extra request
                    </p>
                  </Card>
                  <Card className="flex flex-col items-center space-y-3" elevated>
                    <div className="w-full text-sm font-semibold text-text-strong">Usage this cycle</div>
                    <div className="mb-2 flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-brand-100 border-t-brand-500">
                      <div className="text-center">
                        <div className="text-2xl font-bold">34/50</div>
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                          Requests
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">
                      68% of monthly quota used
                    </p>
                  </Card>
                </div>
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <Card elevated className="space-y-4">
                    <div className="text-sm font-semibold text-text-strong">Payment method</div>
                    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-bold italic text-secondary-800">
                          VISA
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-strong">Visa ending in 4242</div>
                          <div className="text-sm text-text-muted">Expires 12/26</div>
                        </div>
                      </div>
                      <Button type="button" variant="ghost">
                        Billing owner only
                      </Button>
                    </div>
                  </Card>
                  <Card elevated className="space-y-4">
                    <div className="text-sm font-semibold text-text-strong">Recent invoices</div>
                    <div className="space-y-3">
                      {[
                        ['Sep 12, 2023', '$29.00'],
                        ['Aug 12, 2023', '$29.00'],
                      ].map(([date, amount]) => (
                        <div
                          key={date}
                          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3"
                        >
                          <div>
                            <div className="text-sm font-medium text-text-strong">{date}</div>
                            <div className="text-sm text-text-muted">Monthly subscription renewal</div>
                          </div>
                          <div className="text-sm font-semibold text-text-strong">{amount}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </section>
            )}

            {activeTab === 'api' && (
              <section className="space-y-8 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">API Keys</h2>
                    <p className="text-sm text-gray-500">
                      Programmatic access to your organization.
                    </p>
                  </div>
                  <Button
                    onClick={() => setKeyModalOpen(true)}
                    type="button"
                    variant="secondary"
                  >
                    Create New Key
                  </Button>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="space-y-3" elevated>
                    <div className="text-sm font-semibold text-slate-900">Access model</div>
                    <p className="text-sm leading-6 text-slate-500">
                      Keep production and local-development keys separate so rotation and incident
                      response stay predictable.
                    </p>
                  </Card>
                  <Card className="space-y-3" elevated>
                    <div className="text-sm font-semibold text-slate-900">Key hygiene</div>
                    <p className="text-sm leading-6 text-slate-500">
                      Review last-used activity before revoking keys, and rotate any credential
                      that is shared beyond one environment.
                    </p>
                  </Card>
                </div>
                <Card className="overflow-hidden space-y-0" elevated padding="none">
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="text-sm font-semibold text-slate-900">Active keys</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[32rem] text-left text-sm sm:min-w-[34rem]">
                      <thead className="border-b bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-gray-500">
                            Name
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-500">
                            Last Used
                          </th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[
                          ['Production API', 'rev_live_••••••••••••x7a2', '2 hours ago'],
                          ['Local Development', 'rev_test_••••••••••••a3f9', 'Never'],
                        ].map(([name, key, lastUsed]) => (
                          <tr key={name}>
                            <td className="px-4 py-4">
                              <div className="font-medium">{name}</div>
                              <div className="break-all font-mono text-xs text-gray-400 sm:break-normal">
                                {key}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500">{lastUsed}</td>
                            <td className="w-[1%] whitespace-nowrap px-4 py-4 text-right">
                              <button
                                aria-label={`Revoke ${name}`}
                                className="text-xs font-semibold text-red-500"
                                onClick={() => handleRevokeKey(name)}
                                type="button"
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            )}

            {activeTab === 'danger' && (
              <section className="space-y-8 py-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Danger Zone</h2>
                  <p className="text-sm text-gray-500">
                    Irreversible actions for your organization.
                  </p>
                </div>
                <Card className="border-red-100 bg-red-50/30 lg:max-w-2xl" elevated>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-red-900">Before you delete</div>
                    <ul className="space-y-2 text-sm leading-6 text-slate-500">
                      <li>Transfer ownership of any active billing responsibilities.</li>
                      <li>Export the records your team needs to retain.</li>
                      <li>Confirm the org slug with another owner before proceeding.</li>
                    </ul>
                  </div>
                </Card>
                <Card className="border-red-200 bg-red-50/50 p-6 lg:max-w-2xl">
                  <h3 className="mb-1 font-bold text-red-900">
                    Delete Organization
                  </h3>
                  <p className="mb-6 text-sm text-red-700">
                    Once deleted, all data associated with Acme Development will
                    be permanently removed. This action cannot be undone.
                  </p>
                  <Button
                    block
                    onClick={() => setDeleteModalOpen(true)}
                    type="button"
                    variant="danger"
                  >
                    Delete Organization
                  </Button>
                </Card>
              </section>
            )}
              </div>
            </main>
          </WorkspaceShell>

          {keyModalOpen && (
            <Modal onClose={() => setKeyModalOpen(false)} title="API Key Generated">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Copy this key now. You won&apos;t be able to see it again.
                    </p>
                  </div>
                  <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                    For security reasons, we only show this once.
                  </div>
                  <div className="relative">
                    <Input
                      className="rounded-xl border-slate-300 bg-slate-50 pr-12 font-mono text-sm"
                      readOnly
                      type="text"
                      value="rev_live_a1b2c3d4e5f6g7h8i9j0"
                    />
                    <Button
                      aria-label="Copy API key"
                      className="absolute right-1 top-1/2 h-9 w-9 min-h-[36px] min-w-[36px] -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-black"
                      iconOnlyLabel="Copy API key"
                      loading={copyingKey}
                      onClick={handleCopyKey}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    block
                    onClick={() => setKeyModalOpen(false)}
                    type="button"
                    variant="secondary"
                  >
                    Done
                  </Button>
                </div>
            </Modal>
          )}

          {deleteModalOpen && (
            <Modal onClose={() => {
              setDeleteModalOpen(false)
              setDeleteSlug('')
            }} title={<span className="text-red-600">Are you absolutely sure?</span>}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    This action will delete the <strong>Acme Development</strong>{' '}
                    organization and all related data.
                  </p>
                  <Field
                    hint="This confirmation protects against accidental deletion."
                    id="delete-confirmation"
                    label={
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Type <span className="font-bold text-black">acme-dev</span>{' '}
                        to confirm
                      </span>
                    }
                  >
                    <Input
                      className="rounded-xl border-slate-300 focus:border-red-500"
                      onChange={(event) => setDeleteSlug(event.target.value)}
                      placeholder="acme-dev"
                      type="text"
                      value={deleteSlug}
                    />
                  </Field>
                  <div className="flex gap-3">
                    <Button
                      block
                      onClick={() => {
                        setDeleteModalOpen(false)
                        setDeleteSlug('')
                      }}
                      type="button"
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                    <Button
                      block
                      loading={deletingOrg}
                      disabled={deleteSlug !== 'acme-dev'}
                      onClick={handleDeleteOrg}
                      type="button"
                      variant="danger"
                    >
                      Delete Org
                    </Button>
                  </div>
                </div>
            </Modal>
          )}
          <Toast icon={<CheckCircle2 className="h-4 w-4 text-green-400" />} message={toast ?? ''} visible={Boolean(toast)} />
        </DesktopViewport>
      </ScreenCanvas>
    </div>
  )
}
