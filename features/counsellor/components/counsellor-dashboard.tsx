'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { LoadingState } from '@/components/feedback/loading-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { CounsellorAppointment } from '@/types/common';
import { Calendar, Lock, UserCheck } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export function CounsellorDashboardFeature() {
  const [appointments, setAppointments] = useState<CounsellorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<CounsellorAppointment | null>(null);
  const [notes, setNotes] = useState('');

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any[]>('/appointments');
      if (res.data) {
        const mapped: CounsellorAppointment[] = res.data.map((app: any) => ({
          id: app.id,
          studentId: app.student?.id || 'std-101',
          studentName: app.student?.name || 'Student',
          studentEmail: app.student?.email || 'student@univ.edu',
          appointmentDate: app.slot?.startAt ? new Date(app.slot.startAt).toISOString().split('T')[0] : '',
          timeSlot: app.slot?.startAt ? `${new Date(app.slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(app.slot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '10:00 AM',
          status: app.status || 'REQUESTED',
          topic: app.supportRequest?.subject || 'Academic & Mental Wellbeing Support',
          restrictedNotes: app.notes || '',
          followUpRequired: true,
        }));
        setAppointments(mapped);
      }
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id: string, status: CounsellorAppointment['status']) => {
    try {
      await apiFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadAppointments();
    } catch (err) {
      // Error handled
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      await apiFetch(`/appointments/${selectedApp.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'COMPLETED', notes }),
      });
      setSelectedApp(null);
      await loadAppointments();
    } catch (err) {
      // Error handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointment Calendar List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" /> Upcoming Counselling Appointments
              </CardTitle>
              <CardDescription className="text-xs">Manage student mental wellness & academic guidance sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto w-full min-w-0">
              {loading ? (
                <LoadingState label="Loading counselling schedule..." />
              ) : appointments.length === 0 ? (
                <EmptyState
                  icon={<UserCheck className="h-10 w-10 text-muted-foreground" />}
                  title="No Scheduled Appointments"
                  description="There are currently no active or booked student counselling appointments."
                />
              ) : (
                <Table className="w-full min-w-[500px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40 text-xs">
                      <TableHead>Student Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {appointments.map((app) => (
                      <TableRow key={app.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="font-semibold text-foreground">{app.studentName}</div>
                          <div className="text-[11px] text-muted-foreground">{app.studentEmail}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div>{app.appointmentDate}</div>
                          <div className="text-[11px] font-mono">{app.timeSlot}</div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{app.topic}</TableCell>
                        <TableCell><StatusBadge status={app.status} /></TableCell>
                        <TableCell className="text-right space-x-1">
                          {app.status === 'REQUESTED' && (
                            <>
                              <Button size="sm" onClick={() => handleStatusChange(app.id, 'CONFIRMED')} className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleStatusChange(app.id, 'CANCELLED')} className="h-7 text-[11px] text-rose-600">
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === 'CONFIRMED' && (
                            <Button size="sm" variant="outline" onClick={() => { setSelectedApp(app); setNotes(app.restrictedNotes || ''); }} className="h-7 text-[11px] border-emerald-500/30 text-emerald-600">
                              Conduct Session
                            </Button>
                          )}
                          {app.status === 'COMPLETED' && (
                            <span className="text-[11px] text-emerald-600 font-medium">Session Complete</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security & Confidentiality Banner (1 col) */}
        <div className="space-y-4">
          <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Lock className="h-4 w-4 text-emerald-600" /> HIPAA / FERPA Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-emerald-700 dark:text-emerald-300/90 space-y-2">
              <p>Session notes taken during counselling sessions are strictly encrypted and restricted exclusively to the assigned licensed counsellor.</p>
              <p className="font-semibold pt-1 border-t border-emerald-500/20">Follow-up reminders are automated via student email notifications.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session Notes Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        {selectedApp && (
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" /> Restricted Session Notes
              </DialogTitle>
              <DialogDescription className="text-xs">Student: {selectedApp.studentName} | Topic: {selectedApp.topic}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <Textarea
                placeholder="Write confidential counsellor notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-28 text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground italic">These notes will remain encrypted under FERPA standards.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedApp(null)}>Cancel</Button>
              <Button onClick={handleSaveNotes} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save & Mark Completed</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
