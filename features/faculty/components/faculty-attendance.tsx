'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_ATTENDANCE_RECORDS } from '@/lib/mock-data/admin-mock-data';
import { ClassAttendanceRecord, AttendanceStatus } from '@/types/common';
import { QrCode, GraduationCap, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export function FacultyAttendanceFeature() {
  const [record, setRecord] = useState<ClassAttendanceRecord>(MOCK_ATTENDANCE_RECORDS[0]);
  const [showQR, setShowQR] = useState(false);

  const toggleStudentStatus = (studentId: string, newStatus: AttendanceStatus) => {
    const updatedStudents = record.students.map(s => s.studentId === studentId ? { ...s, status: newStatus } : s);
    const presentCount = updatedStudents.filter(s => s.status === 'PRESENT').length;
    const absentCount = updatedStudents.filter(s => s.status === 'ABSENT').length;
    const lateCount = updatedStudents.filter(s => s.status === 'LATE').length;

    setRecord({
      ...record,
      students: updatedStudents,
      presentCount,
      absentCount,
      lateCount,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-end">
        <Button onClick={() => setShowQR(!showQR)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-9 text-xs">
          <QrCode className="h-4 w-4" /> {showQR ? 'Hide Live QR Code' : 'Generate Dynamic QR Attendance'}
        </Button>
      </div>

      {/* Dynamic QR Code Modal Display */}
      {showQR && (
        <Card className="border-emerald-500/40 bg-emerald-500/10 shadow-md animate-in fade-in zoom-in duration-200">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 justify-center md:justify-start">
                <QrCode className="h-5 w-5 text-emerald-600 animate-spin" /> Dynamic Student QR Code Active
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Display this code on lecture screen. Student mobile app scans to automatically verify geolocation & attendance.
              </p>
              <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-300 font-semibold">
                Class: {record.classCode} | Subject: {record.className} | Date: {record.date}
              </p>
            </div>

            {/* Generated QR Graphic Visual */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-emerald-500/30 shadow-lg">
              <div className="h-32 w-32 bg-slate-900 rounded-xl flex items-center justify-center p-2 text-emerald-400 font-mono text-[9px] text-center leading-tight">
                [ DYNAMIC QR ENCRYPTED HASH ]<br/>{record.classCode}-2026-LIVE
              </div>
              <span className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">Expires in 04:59 mins</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Present Students</p>
              <p className="text-2xl font-bold text-emerald-600">{record.presentCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500/20" />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Absent Students</p>
              <p className="text-2xl font-bold text-rose-600">{record.absentCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-rose-500/20" />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Late Arrival</p>
              <p className="text-2xl font-bold text-amber-600">{record.lateCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500/20" />
          </CardContent>
        </Card>
      </div>

      {/* Student Attendance Roster Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Roster: {record.classCode} - {record.className}</CardTitle>
          <CardDescription className="text-xs">Click status buttons to override or mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[450px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Attendance Status</TableHead>
                <TableHead className="text-right">Quick Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {record.students.map((student) => (
                <TableRow key={student.studentId} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-semibold text-foreground">{student.rollNumber}</TableCell>
                  <TableCell className="font-medium text-foreground">{student.studentName}</TableCell>
                  <TableCell><StatusBadge status={student.status} /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      size="sm"
                      variant={student.status === 'PRESENT' ? 'default' : 'outline'}
                      onClick={() => toggleStudentStatus(student.studentId, 'PRESENT')}
                      className={student.status === 'PRESENT' ? "bg-emerald-600 text-white h-7 text-[11px]" : "h-7 text-[11px]"}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'ABSENT' ? 'default' : 'outline'}
                      onClick={() => toggleStudentStatus(student.studentId, 'ABSENT')}
                      className={student.status === 'ABSENT' ? "bg-rose-600 text-white h-7 text-[11px]" : "h-7 text-[11px] text-rose-600"}
                    >
                      Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'LATE' ? 'default' : 'outline'}
                      onClick={() => toggleStudentStatus(student.studentId, 'LATE')}
                      className={student.status === 'LATE' ? "bg-amber-600 text-white h-7 text-[11px]" : "h-7 text-[11px] text-amber-600"}
                    >
                      Late
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
