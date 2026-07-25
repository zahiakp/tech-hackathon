'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_STARTUPS } from '@/lib/mock-data/admin-mock-data';
import { StartupProfileRecord } from '@/types/common';
import { Rocket, Building, DollarSign, CheckCircle, UserCheck } from 'lucide-react';

export function StartupAdminDashboardFeature() {
  const [startups, setStartups] = useState<StartupProfileRecord[]>(MOCK_STARTUPS);

  const handleApproveStartup = (id: string) => {
    setStartups(startups.map(s => s.id === id ? { ...s, stage: 'INCUBATING', assignedMentor: 'Dr. Sarah Jenkins' } : s));
  };

  return (
    <div className="space-y-6">

      {/* Startups Review Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Rocket className="h-4 w-4 text-purple-600" /> Student Venture Applications
          </CardTitle>
          <CardDescription className="text-xs">Incubation, grant funding & mentor matching tracking</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[550px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>Startup Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Founder Email</TableHead>
                <TableHead>Funding Requested</TableHead>
                <TableHead>Incubation Stage</TableHead>
                <TableHead>Assigned Mentor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {startups.map((stp) => (
                <TableRow key={stp.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-bold text-foreground">{stp.startupName}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">{stp.pitchSummary}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{stp.category}</TableCell>
                  <TableCell className="text-muted-foreground">{stp.founderEmail}</TableCell>
                  <TableCell className="font-bold text-emerald-600">${stp.fundingRequested.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={stp.stage} /></TableCell>
                  <TableCell className="text-muted-foreground">{stp.assignedMentor || 'Unassigned'}</TableCell>
                  <TableCell className="text-right">
                    {stp.stage === 'UNDER_REVIEW' && (
                      <Button size="sm" onClick={() => handleApproveStartup(stp.id)} className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white gap-1">
                        <CheckCircle className="h-3 w-3" /> Approve Incubation
                      </Button>
                    )}
                    {stp.stage !== 'UNDER_REVIEW' && (
                      <span className="text-[11px] text-purple-600 font-semibold flex items-center justify-end gap-1">
                        <UserCheck className="h-3.5 w-3.5" /> Mentor Assigned
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
