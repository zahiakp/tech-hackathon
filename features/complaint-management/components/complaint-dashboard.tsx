'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, Search } from 'lucide-react';
import type { ComplaintStatus } from '@/app/generated/prisma/enums';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ApiClientError, apiFetch } from '@/lib/api-client';
import type { ApiComplaintDetail, ApiComplaintListItem } from '@/lib/api-types';
import { COMPLAINT_STATUS } from '@/lib/constants/roles';

const transitions: Partial<Record<ComplaintStatus, ComplaintStatus[]>> = {
  SUBMITTED: ['IN_REVIEW', 'ESCALATED'],
  ASSIGNED: ['IN_REVIEW', 'ESCALATED', 'RESOLVED'],
  IN_REVIEW: ['ESCALATED', 'RESOLVED'],
  ESCALATED: ['IN_REVIEW', 'RESOLVED'],
  RESOLVED: ['CLOSED', 'IN_REVIEW'],
};

export function ComplaintDashboardFeature() {
  const [complaints, setComplaints] = useState<ApiComplaintListItem[]>([]);
  const [selected, setSelected] = useState<ApiComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadComplaints = useCallback(async () => {
    try {
      const response = await apiFetch<ApiComplaintListItem[]>('/complaints?limit=100');
      setComplaints(response.data);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to load complaints.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadComplaints();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadComplaints]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return complaints.filter((complaint) =>
      (status === 'ALL' || complaint.status === status) &&
      (complaint.title.toLowerCase().includes(query) || complaint.referenceCode.toLowerCase().includes(query)),
    );
  }, [complaints, search, status]);

  async function openComplaint(id: string) {
    setDetailLoading(true);
    try {
      const response = await apiFetch<ApiComplaintDetail>(`/complaints/${id}`);
      setSelected(response.data);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to load complaint details.');
    } finally {
      setDetailLoading(false);
    }
  }

  async function refreshSelected(id: string) {
    const response = await apiFetch<ApiComplaintDetail>(`/complaints/${id}`);
    setSelected(response.data);
  }

  async function updateStatus(nextStatus: ComplaintStatus) {
    if (!selected) return;
    setSaving(true);
    try {
      await apiFetch(`/complaints/${selected.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus, note: 'Updated from complaint management desk.' }),
      });
      await Promise.all([loadComplaints(), refreshSelected(selected.id)]);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to update complaint status.');
    } finally {
      setSaving(false);
    }
  }

  async function addMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !message.trim()) return;
    setSaving(true);
    try {
      await apiFetch(`/complaints/${selected.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body: message.trim() }),
      });
      setMessage('');
      await refreshSelected(selected.id);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to add the message.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} onRetry={() => void loadComplaints()} />}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center justify-between gap-3 p-4 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reference or title..." className="h-9 pl-9" />
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value ?? 'ALL')}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {Object.values(COMPLAINT_STATUS).map((value) => <SelectItem key={value} value={value}>{value.replaceAll('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? <LoadingState label="Fetching complaints..." /> : filtered.length === 0 ? (
            <EmptyState icon={FileText} title="No complaints found" description="No accessible complaints match the current filters." />
          ) : (
            <Table className="min-w-[720px]">
              <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Assigned staff</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono text-xs">{complaint.referenceCode}</TableCell>
                    <TableCell><p className="font-medium">{complaint.title}</p><p className="line-clamp-1 text-xs text-muted-foreground">{complaint.description}</p></TableCell>
                    <TableCell>{complaint.category.name}</TableCell>
                    <TableCell>{complaint.assignedTo?.name ?? 'Unassigned'}</TableCell>
                    <TableCell><StatusBadge status={complaint.status} /></TableCell>
                    <TableCell className="text-right"><Button variant="outline" size="sm" disabled={detailLoading} onClick={() => void openComplaint(complaint.id)}>Review</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader><DialogTitle>{selected.referenceCode}</DialogTitle><DialogDescription>{selected.title}</DialogDescription></DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border bg-muted/30 p-3"><p>{selected.description}</p></div>
              <div className="grid gap-2 sm:grid-cols-2"><p><strong>Reporter:</strong> {selected.anonymous ? 'Anonymous' : selected.reporter?.name ?? 'Unknown'}</p><p><strong>Assigned:</strong> {selected.assignedTo?.name ?? 'Unassigned'}</p><p><strong>Category:</strong> {selected.category.name}</p><div><StatusBadge status={selected.status} /></div></div>
              <div className="space-y-2 border-t pt-3">
                <Label>Valid next status</Label>
                <div className="flex flex-wrap gap-2">
                  {(transitions[selected.status] ?? []).map((nextStatus) => <Button key={nextStatus} size="sm" variant={nextStatus === 'RESOLVED' ? 'default' : 'outline'} disabled={saving} onClick={() => void updateStatus(nextStatus)}>{nextStatus.replaceAll('_', ' ')}</Button>)}
                  {!transitions[selected.status]?.length && <span className="text-xs text-muted-foreground">No further transitions are available.</span>}
                </div>
              </div>
              <div className="space-y-2 border-t pt-3">
                <Label>Complaint messages</Label>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg bg-muted/30 p-2">
                  {selected.messages.length === 0 ? <p className="text-xs text-muted-foreground">No messages yet.</p> : selected.messages.map((item) => <div key={item.id} className="rounded border bg-background p-2 text-xs"><div className="flex justify-between font-medium"><span>{item.author?.name ?? (item.fromStaff ? 'Staff' : 'Anonymous reporter')}</span><span className="text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span></div><p className="mt-1 text-muted-foreground">{item.body}</p></div>)}
                </div>
                <form onSubmit={addMessage} className="space-y-2"><Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add a complaint message..." /><Button type="submit" size="sm" disabled={saving || !message.trim()}>Send message</Button></form>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}