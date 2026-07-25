'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { MOCK_ADMIN_USERS, MOCK_COMPLAINTS, MOCK_SOS_INCIDENTS } from '@/lib/mock-data/admin-mock-data';
import { Users, ShieldAlert, MessageSquareWarning, Award, GraduationCap, BookOpen, HeartPulse, Building, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export function AdminDashboardFeature() {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered Students"
          value="4,850"
          description="Active across 4 university campuses"
          change="+12.4%"
          changeType="positive"
          icon={Users}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Active SOS Incidents"
          value="1"
          description="1 Critical Incident requiring dispatch"
          change="Urgent"
          changeType="negative"
          icon={ShieldAlert}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Active Complaints"
          value="14"
          description="8 Under review, 6 Assigned"
          change="-5.2%"
          changeType="positive"
          icon={MessageSquareWarning}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Attendance Rate Today"
          value="91.2%"
          description="Average daily student attendance"
          change="+2.1%"
          changeType="positive"
          icon={GraduationCap}
          iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Urgent Live Incidents & Complaints Overview (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Complaints Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Recent Campus Complaints</CardTitle>
                <CardDescription className="text-xs">Live tracking of administrative and facility tickets</CardDescription>
              </div>
              <Link href={ROUTES.STAFF_COMPLAINTS}>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                  View All <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto w-full min-w-0">
              <Table className="w-full min-w-[450px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs">
                    <TableHead className="w-[120px]">Reference</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {MOCK_COMPLAINTS.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-bold text-foreground">{item.referenceNumber}</TableCell>
                      <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* User & Role Overview Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Staff & Admin Users</CardTitle>
                <CardDescription className="text-xs">Active faculty and security administration accounts</CardDescription>
              </div>
              <Link href={ROUTES.ADMIN_USERS}>
                <Button variant="outline" size="sm" className="text-xs">Manage Users</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto w-full min-w-0">
              <Table className="w-full min-w-[450px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs">
                    <TableHead>User Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {MOCK_ADMIN_USERS.slice(0, 4).map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-foreground">{user.name}</TableCell>
                      <TableCell><StatusBadge status={user.role} /></TableCell>
                      <TableCell className="text-muted-foreground">{user.campus}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Module Access Shortcuts (1 col) */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Staff Control Hub</CardTitle>
              <CardDescription className="text-xs">Direct access to assigned administrative dashboards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={ROUTES.SECURITY_DASHBOARD} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600"><ShieldAlert className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Security SOS</p>
                    <p className="text-[10px] text-muted-foreground">Emergency dispatch & maps</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-rose-600" />
              </Link>

              <Link href={ROUTES.FACULTY_ATTENDANCE} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><GraduationCap className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Faculty Attendance</p>
                    <p className="text-[10px] text-muted-foreground">Class QR & correction logs</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600" />
              </Link>

              <Link href={ROUTES.LIBRARY_STAFF_DASHBOARD} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600"><BookOpen className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Library Staff</p>
                    <p className="text-[10px] text-muted-foreground">Book issues & fines</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600" />
              </Link>

              <Link href={ROUTES.BLOOD_ADMIN_DASHBOARD} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><HeartPulse className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Blood Donation</p>
                    <p className="text-[10px] text-muted-foreground">Request approvals & points</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600" />
              </Link>

              <Link href={ROUTES.STARTUP_ADMIN_DASHBOARD} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-purple-500/10 hover:border-purple-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600"><Building className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Startup Incubation</p>
                    <p className="text-[10px] text-muted-foreground">Review pitches & mentors</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
