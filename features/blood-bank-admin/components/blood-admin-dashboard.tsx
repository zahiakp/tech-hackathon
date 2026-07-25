'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_BLOOD_REQUESTS } from '@/lib/mock-data/admin-mock-data';
import { BloodRequestRecord } from '@/types/common';
import { HeartPulse, CheckCircle2, AlertTriangle, Send, Award } from 'lucide-react';

export function BloodAdminDashboardFeature() {
  const [requests, setRequests] = useState<BloodRequestRecord[]>(MOCK_BLOOD_REQUESTS);

  const handleApproveRequest = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'VERIFIED' } : r));
  };

  return (
    <div className="space-y-6">

      {/* Blood Requests Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-rose-600" /> Urgent Blood Requests
          </CardTitle>
          <CardDescription className="text-xs">Emergency blood requests submitted by campus clinics & partner hospitals</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[550px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>Hospital / Patient</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Units Needed</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Matched Donors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-semibold text-foreground">{req.hospitalName}</div>
                    <div className="text-[11px] text-muted-foreground">{req.contactNumber}</div>
                  </TableCell>
                  <TableCell className="font-bold text-rose-600 text-sm">{req.bloodGroup}</TableCell>
                  <TableCell className="font-mono font-bold">{req.unitsRequired} Units</TableCell>
                  <TableCell><StatusBadge status={req.urgency} /></TableCell>
                  <TableCell className="font-bold text-emerald-600">{req.matchedDonorsCount} Donors</TableCell>
                  <TableCell><StatusBadge status={req.status} /></TableCell>
                  <TableCell className="text-right space-x-1">
                    {req.status === 'PENDING' && (
                      <Button size="sm" onClick={() => handleApproveRequest(req.id)} className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white gap-1">
                        <Send className="h-3 w-3" /> Approve & Dispatch Alert
                      </Button>
                    )}
                    {req.status === 'VERIFIED' && (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Donors Notified
                      </span>
                    )}
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
