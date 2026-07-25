'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, Search, UserPlus, Users, UserX } from 'lucide-react';
import type { RoleCode } from '@/app/generated/prisma/enums';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ApiClientError, apiFetch } from '@/lib/api-client';
import type { ApiUser } from '@/lib/api-types';
import { USER_ROLES } from '@/lib/constants/roles';

export function UserManagementFeature() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleCode>('FACULTY');
  const [campus, setCampus] = useState('Main Campus');
  const [department, setDepartment] = useState('Administration');

  const loadUsers = useCallback(async () => {
    try {
      const response = await apiFetch<ApiUser[]>('/admin/users?limit=100');
      setUsers(response.data);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) =>
      (user.name?.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) &&
      (roleFilter === 'ALL' || user.roles.some(({ role: assignedRole }) => assignedRole.code === roleFilter)),
    );
  }, [roleFilter, search, users]);

  async function createUser(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, roles: [role], campus, department }),
      });
      setDialogOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to create the user.');
    } finally {
      setSaving(false);
    }
  }

  async function setUserActive(user: ApiUser, active: boolean) {
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ active }),
      });
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to update account status.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} onRetry={() => void loadUsers()} />}
      <Card className="border-border/60 shadow-sm"><CardContent className="flex flex-col items-center justify-between gap-3 p-4 sm:flex-row"><div className="relative w-full sm:w-80"><Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter by name or email..." className="h-9 pl-9" /></div><div className="flex w-full gap-3 sm:w-auto"><Select value={roleFilter} onValueChange={(value) => setRoleFilter(value ?? 'ALL')}><SelectTrigger className="w-44"><SelectValue placeholder="All roles" /></SelectTrigger><SelectContent><SelectItem value="ALL">All roles</SelectItem>{Object.values(USER_ROLES).map((value) => <SelectItem key={value} value={value}>{value.replaceAll('_', ' ')}</SelectItem>)}</SelectContent></Select><Button onClick={() => setDialogOpen(true)}><UserPlus /> Add user</Button></div></CardContent></Card>

      <Card className="overflow-hidden border-border/60 shadow-sm"><CardContent className="p-0 overflow-x-auto">{loading ? <LoadingState label="Loading users..." /> : filtered.length === 0 ? <EmptyState icon={Users} title="No users found" description="No users match the current filters." /> : <Table className="min-w-[760px]"><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Roles</TableHead><TableHead>Campus</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{filtered.map((user) => <TableRow key={user.id}><TableCell><p className="font-medium">{user.name ?? 'User'}</p><p className="text-xs text-muted-foreground">{user.email}</p></TableCell><TableCell><div className="flex flex-wrap gap-1">{user.roles.map(({ role: assignedRole }) => <StatusBadge key={assignedRole.code} status={assignedRole.code} />)}</div></TableCell><TableCell>{user.profile?.campus ?? 'Not set'}</TableCell><TableCell>{user.profile?.department ?? 'Not set'}</TableCell><TableCell>{user.status === 'ACTIVE' ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle className="size-4" /> Active</span> : <span className="inline-flex items-center gap-1 text-rose-600"><UserX className="size-4" /> Suspended</span>}</TableCell><TableCell className="text-right"><Button size="sm" variant="outline" disabled={saving} onClick={() => void setUserActive(user, user.status !== 'ACTIVE')}>{user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</Button></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>Create staff account</DialogTitle><DialogDescription>Create credentials, role, and profile assignment.</DialogDescription></DialogHeader><form onSubmit={createUser} className="space-y-4"><div className="space-y-1"><Label htmlFor="new-name">Full name</Label><Input id="new-name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} /></div><div className="space-y-1"><Label htmlFor="new-email">Email</Label><Input id="new-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="space-y-1"><Label htmlFor="new-password">Temporary password</Label><Input id="new-password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></div><div className="space-y-1"><Label>Role</Label><Select value={role} onValueChange={(value) => value && setRole(value as RoleCode)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(USER_ROLES).map((value) => <SelectItem key={value} value={value}>{value.replaceAll('_', ' ')}</SelectItem>)}</SelectContent></Select></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label htmlFor="new-campus">Campus</Label><Input id="new-campus" value={campus} onChange={(event) => setCampus(event.target.value)} /></div><div className="space-y-1"><Label htmlFor="new-department">Department</Label><Input id="new-department" value={department} onChange={(event) => setDepartment(event.target.value)} /></div></div><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>Create account</Button></DialogFooter></form></DialogContent></Dialog>
    </div>
  );
}