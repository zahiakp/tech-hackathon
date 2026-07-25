"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, CheckCircle2, Clock3, GraduationCap, QrCode, Users } from "lucide-react";
import type { AttendanceMark } from "@/app/generated/prisma/enums";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiClientError, apiFetch } from "@/lib/api-client";
import type { AttendanceSessionDto } from "@/lib/operational-types";

const marks: AttendanceMark[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

export function FacultyAttendanceFeature() {
  const [sessions, setSessions] = useState<AttendanceSessionDto[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ classCode: "", className: "", subject: "", date: new Date().toISOString().slice(0, 10) });

  const load = useCallback(async () => {
    try {
      const response = await apiFetch<AttendanceSessionDto[]>("/attendance?limit=100");
      setSessions(response.data);
      setSelectedId((current) => current || response.data[0]?.id || "");
      setError("");
    } catch (cause) { setError(cause instanceof ApiClientError ? cause.message : "Unable to load attendance."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const selected = sessions.find((session) => session.id === selectedId);
  const totals = useMemo(() => selected?.entries.reduce((acc, entry) => ({ ...acc, [entry.status]: acc[entry.status] + 1 }), { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 } as Record<AttendanceMark, number>), [selected]);

  async function createSession(event: React.FormEvent) {
    event.preventDefault(); setSaving(true);
    try { const response = await apiFetch<AttendanceSessionDto>("/attendance", { method: "POST", body: JSON.stringify({ ...form, date: new Date(`${form.date}T09:00:00`).toISOString() }) }); setOpen(false); setSessions((items) => [response.data, ...items]); setSelectedId(response.data.id); setError(""); }
    catch (cause) { setError(cause instanceof ApiClientError ? cause.message : "Unable to create attendance session."); }
    finally { setSaving(false); }
  }

  async function updateEntries(entries: Array<{ studentId: string; status: AttendanceMark }>, qrActive?: boolean) {
    if (!selected) return; setSaving(true);
    try { const response = await apiFetch<AttendanceSessionDto>(`/attendance/${selected.id}`, { method: "PATCH", body: JSON.stringify({ entries, ...(qrActive === undefined ? {} : { qrActive }) }) }); setSessions((items) => items.map((item) => item.id === response.data.id ? response.data : item)); setError(""); }
    catch (cause) { setError(cause instanceof ApiClientError ? cause.message : "Unable to update attendance."); }
    finally { setSaving(false); }
  }

  if (loading) return <LoadingState label="Loading attendance sessions..." />;
  return <div className="space-y-6">
    {error && <ErrorState message={error} onRetry={() => void load()} />}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard title="Sessions" value={sessions.length} description="Recorded class meetings" icon={GraduationCap} /><StatCard title="Students" value={selected?.entries.length ?? 0} description="Roster in selected session" icon={Users} /><StatCard title="Present" value={totals?.PRESENT ?? 0} description="Marked present" icon={CheckCircle2} /><StatCard title="Late / Excused" value={(totals?.LATE ?? 0) + (totals?.EXCUSED ?? 0)} description="Needs review" icon={Clock3} /></div>
    <Card><CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><Select value={selectedId} onValueChange={(value) => value && setSelectedId(value)}><SelectTrigger className="w-full sm:w-96"><SelectValue placeholder="Select a class session" /></SelectTrigger><SelectContent>{sessions.map((session) => <SelectItem key={session.id} value={session.id}>{session.classCode} · {new Date(session.date).toLocaleDateString()}</SelectItem>)}</SelectContent></Select><div className="flex gap-2"><Button variant="outline" disabled={!selected || saving} onClick={() => selected && void updateEntries([], !selected.qrActive)}><QrCode /> {selected?.qrActive ? "Close QR" : "Open QR"}</Button><Button onClick={() => setOpen(true)}><CalendarPlus /> New session</Button></div></CardContent></Card>
    {!selected ? <EmptyState icon={GraduationCap} title="No attendance sessions" description="Create a session to load the active student roster." /> : <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>{selected.className}</CardTitle><p className="text-sm text-muted-foreground">{selected.subject} · {new Date(selected.date).toLocaleString()}</p></div><Button size="sm" disabled={saving || selected.entries.length === 0} onClick={() => void updateEntries(selected.entries.map((entry) => ({ studentId: entry.studentId, status: "PRESENT" })))}>Mark all present</Button></CardHeader><CardContent className="overflow-x-auto p-0"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Student ID</TableHead><TableHead>Course</TableHead><TableHead className="w-44">Status</TableHead></TableRow></TableHeader><TableBody>{selected.entries.map((entry) => <TableRow key={entry.id}><TableCell><p className="font-medium">{entry.student.name ?? "Student"}</p><p className="text-xs text-muted-foreground">{entry.student.email}</p></TableCell><TableCell>{entry.student.profile?.studentId ?? "—"}</TableCell><TableCell>{entry.student.profile?.course ?? "—"}</TableCell><TableCell><Select value={entry.status} onValueChange={(value) => value && void updateEntries([{ studentId: entry.studentId, status: value as AttendanceMark }])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{marks.map((mark) => <SelectItem key={mark} value={mark}>{mark}</SelectItem>)}</SelectContent></Select></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Create attendance session</DialogTitle><DialogDescription>The active student roster is added automatically and starts as absent.</DialogDescription></DialogHeader><form onSubmit={createSession} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1"><Label>Class code</Label><Input required value={form.classCode} onChange={(event) => setForm({ ...form, classCode: event.target.value })} /></div><div className="space-y-1"><Label>Date</Label><Input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></div></div><div className="space-y-1"><Label>Class name</Label><Input required value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })} /></div><div className="space-y-1"><Label>Subject</Label><Input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></div><DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={saving} type="submit">Create session</Button></DialogFooter></form></DialogContent></Dialog>
  </div>;
}