'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Lock, UserCheck } from 'lucide-react';
import type { AppointmentStatus } from '@/app/generated/prisma/enums';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ApiClientError, apiFetch } from '@/lib/api-client';
import type { ApiAppointment } from '@/lib/api-types';

export function CounsellorDashboardFeature() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [selected, setSelected] = useState<ApiAppointment | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAppointments = useCallback(async () => {
    try {
      const response = await apiFetch<ApiAppointment[]>('/appointments?limit=100');
      setAppointments(response.data);
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAppointments();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadAppointments]);

  async function updateStatus(id: string, status: AppointmentStatus, updatedNotes?: string) {
    setSaving(true);
    try {
      await apiFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(updatedNotes ? { notes: updatedNotes } : {}) }),
      });
      setSelected(null);
      await loadAppointments();
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to update the appointment.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} onRetry={() => void loadAppointments()} />}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calendar className="size-4 text-emerald-600" /> Counselling appointments</CardTitle><CardDescription>Manage requested and confirmed support sessions.</CardDescription></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {loading ? <LoadingState label="Loading counselling schedule..." /> : appointments.length === 0 ? <EmptyState icon={UserCheck} title="No appointments" description="No support appointments are assigned to this account." /> : (
              <Table className="min-w-[620px]">
                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Date and time</TableHead><TableHead>Notes</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{appointments.map((appointment) => <TableRow key={appointment.id}><TableCell className="font-medium">{appointment.student.name ?? 'Student'}</TableCell><TableCell><p>{new Date(appointment.startAt).toLocaleDateString()}</p><p className="text-xs text-muted-foreground">{new Date(appointment.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></TableCell><TableCell className="max-w-48 truncate text-muted-foreground">{appointment.notes ?? 'No notes'}</TableCell><TableCell><StatusBadge status={appointment.status} /></TableCell><TableCell className="space-x-2 text-right">{appointment.status === 'REQUESTED' && <><Button size="sm" disabled={saving} onClick={() => void updateStatus(appointment.id, 'CONFIRMED')}>Confirm</Button><Button size="sm" variant="outline" disabled={saving} onClick={() => void updateStatus(appointment.id, 'CANCELLED')}>Cancel</Button></>}{appointment.status === 'CONFIRMED' && <Button size="sm" variant="outline" onClick={() => { setSelected(appointment); setNotes(appointment.notes ?? ''); }}>Complete session</Button>}{appointment.status === 'COMPLETED' && <span className="text-xs text-emerald-600">Completed</span>}</TableCell></TableRow>)}</TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30 bg-emerald-500/5"><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Lock className="size-4" /> Confidential access</CardTitle></CardHeader><CardContent className="space-y-2 text-xs text-muted-foreground"><p>Appointment and conversation data is restricted to participants and authorized server-side roles.</p><p>Data is protected in transit and by the provider. Do not describe this module as end-to-end encrypted or clinically certified.</p></CardContent></Card>
      </div>
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>{selected && <DialogContent><DialogHeader><DialogTitle>Complete support session</DialogTitle><DialogDescription>Student: {selected.student.name ?? 'Student'}</DialogDescription></DialogHeader><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Session follow-up notes..." /><DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button><Button disabled={saving} onClick={() => void updateStatus(selected.id, 'COMPLETED', notes)}>Save and complete</Button></DialogFooter></DialogContent>}</Dialog>
    </div>
  );
}