'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageSquareWarning, ShieldAlert, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { ApiClientError, apiFetch } from '@/lib/api-client';
import type { ApiComplaintListItem, ApiSosIncident, ApiUser } from '@/lib/api-types';
import { ROUTES } from '@/lib/constants/routes';

export function AdminDashboardFeature() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [complaints, setComplaints] = useState<ApiComplaintListItem[]>([]);
  const [incidents, setIncidents] = useState<ApiSosIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      const [userResponse, complaintResponse, sosResponse] = await Promise.all([
        apiFetch<ApiUser[]>('/admin/users?limit=100'),
        apiFetch<ApiComplaintListItem[]>('/complaints?limit=100'),
        apiFetch<ApiSosIncident[]>('/sos?limit=100'),
      ]);
      setUsers(userResponse.data);
      setComplaints(complaintResponse.data);
      setIncidents(sosResponse.data);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  if (loading) return <LoadingState label="Loading operational dashboard..." />;

  const activeComplaints = complaints.filter(({ status }) => status !== 'CLOSED' && status !== 'RESOLVED');
  const activeSos = incidents.filter(({ status }) => status !== 'RESOLVED' && status !== 'CANCELLED_FALSE_ALARM');

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} onRetry={() => void loadDashboard()} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Registered users" value={String(users.length)} description="Visible accounts in the current page" icon={Users} iconBgColor="bg-emerald-500/10 text-emerald-600" />
        <StatCard title="Active SOS incidents" value={String(activeSos.length)} description="Open, acknowledged, or dispatched" icon={ShieldAlert} iconBgColor="bg-rose-500/10 text-rose-600" change={activeSos.length ? 'Needs attention' : 'Clear'} changeType={activeSos.length ? 'negative' : 'positive'} />
        <StatCard title="Active complaints" value={String(activeComplaints.length)} description="Not resolved or closed" icon={MessageSquareWarning} iconBgColor="bg-amber-500/10 text-amber-600" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base">Recent complaints</CardTitle><Link href={ROUTES.STAFF_COMPLAINTS} className="text-xs text-primary">View all</Link></div></CardHeader><CardContent className="space-y-2">{complaints.slice(0, 5).map((complaint) => <Link key={complaint.id} href={ROUTES.STAFF_COMPLAINTS} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40"><div><p className="text-sm font-medium">{complaint.title}</p><p className="text-xs text-muted-foreground">{complaint.referenceCode}</p></div><StatusBadge status={complaint.status} /></Link>)}{complaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints available.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Operational modules</CardTitle></CardHeader><CardContent className="space-y-2"><Link href={ROUTES.SECURITY_DASHBOARD} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40"><span className="flex items-center gap-2 text-sm"><ShieldAlert className="size-4 text-rose-600" /> Security desk</span><ArrowUpRight className="size-4" /></Link><Link href={ROUTES.ADMIN_USERS} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40"><span className="flex items-center gap-2 text-sm"><Users className="size-4 text-emerald-600" /> User and role management</span><ArrowUpRight className="size-4" /></Link><Link href={ROUTES.STAFF_COMPLAINTS} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40"><span className="flex items-center gap-2 text-sm"><MessageSquareWarning className="size-4 text-amber-600" /> Complaint management</span><ArrowUpRight className="size-4" /></Link></CardContent></Card>
      </div>
    </div>
  );
}