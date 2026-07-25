'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MOCK_COUNSELLOR_APPOINTMENTS } from '@/lib/mock-data/admin-mock-data';
import { CounsellorAppointment } from '@/types/common';
import { Calendar, UserCheck, Lock, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export function CounsellorDashboardFeature() {
  const [appointments, setAppointments] = useState<CounsellorAppointment[]>(MOCK_COUNSELLOR_APPOINTMENTS);
  const [selectedApp, setSelectedApp] = useState<CounsellorAppointment | null>(null);
  const [notes, setNotes] = useState('');

  const handleStatusChange = (id: string, status: CounsellorAppointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleSaveNotes = () => {
    if (!selectedApp) return;
    setAppointments(appointments.map(a => a.id === selectedApp.id ? { ...a, restrictedNotes: notes, status: 'COMPLETED' } : a));
    setSelectedApp(null);
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
