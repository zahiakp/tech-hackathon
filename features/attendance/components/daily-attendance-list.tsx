import { CalendarCheck2, Clock3 } from "lucide-react";

import { AttendanceStatusBadge } from "@/features/attendance/components/attendance-status-badge";
import type { DailyAttendanceRecord } from "@/features/attendance/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DailyAttendanceList({ records }: { records: DailyAttendanceRecord[] }) {
  return (
    <>
      <div className="grid gap-3 md:hidden">
        {records.map((record) => (
          <Card key={record.id}>
            <CardHeader className="flex-row items-start justify-between">
              <div><CardTitle>{record.subject}</CardTitle><p className="text-sm text-muted-foreground">{record.day} · {record.date}</p></div>
              <AttendanceStatusBadge status={record.status} />
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4" />{record.time}</CardContent>
          </Card>
        ))}
      </div>
      <Card className="hidden md:block">
        <CardHeader><CardTitle className="flex items-center gap-2"><CalendarCheck2 className="size-5 text-primary" />Attendance log</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Subject</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{records.map((record) => <TableRow key={record.id}><TableCell><p className="font-medium">{record.day}</p><p className="text-xs text-muted-foreground">{record.date}</p></TableCell><TableCell>{record.subject}</TableCell><TableCell>{record.time}</TableCell><TableCell><AttendanceStatusBadge status={record.status} /></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
