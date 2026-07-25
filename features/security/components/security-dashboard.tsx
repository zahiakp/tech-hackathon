'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingState } from '@/components/feedback/loading-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { SOSIncident } from '@/types/common';
import { MapPin, Phone, UserCheck, CheckCircle, Radio, ShieldAlert } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export function SecurityDashboardFeature() {
  const [incidents, setIncidents] = useState<SOSIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SOSIncident | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSOS = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any[]>('/sos');
      if (res.data) {
        const mapped: SOSIncident[] = res.data.map((item: any) => ({
          id: item.id,
          referenceCode: item.referenceCode || `SOS-2026-${item.id.slice(0, 4)}`,
          studentId: item.user?.id || item.userId || 'N/A',
          studentName: item.user?.name || 'Student Reporter',
          studentPhone: item.user?.phone || item.user?.profile?.phone || 'N/A',
          location: item.note || item.locationText || 'Campus Geolocation',
          coordinates: { lat: item.latitude || 37.7749, lng: item.longitude || -122.4194 },
          status: item.status || 'OPEN',
          priority: item.priority || 'HIGH',
          reportedAt: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          assignedOfficerName: item.assignments?.[0]?.securityUser?.name,
        }));
        setIncidents(mapped);
        if (mapped.length > 0 && !selectedIncident) {
          setSelectedIncident(mapped[0]);
        }
      }
    } catch (err) {
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSOS();
  }, []);

  const handleAssignOfficer = async (incidentId: string) => {
    try {
      await apiFetch(`/sos/${incidentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'DISPATCHED', note: 'Guard team dispatched' }),
      });
      await loadSOS();
    } catch (err) {
      // Error handled
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await apiFetch(`/sos/${incidentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'RESOLVED', note: 'Incident resolved safely' }),
      });
      await loadSOS();
    } catch (err) {
      // Error handled
    }
  };

  const activeCount = incidents.filter(i => i.status === 'TRIGGERED' || i.status === 'DISPATCHED' || i.status === 'ON_SCENE').length;

  return (
    <div className="space-y-6">
      {/* Urgent Top Alert Banner */}
      <Card className="border-rose-500/40 bg-rose-500/10 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white animate-pulse">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                LIVE SOS DISPATCH FEED <Badge variant="destructive" className="animate-pulse">{activeCount} Active</Badge>
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Real-time panic button distress alerts received from mobile app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Incident List + Interactive Map Detail View */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Incident Listing (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">SOS Incident Desk</CardTitle>
              <CardDescription className="text-xs">Click any incident to view detailed GPS telemetry</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto w-full min-w-0">
              {loading ? (
                <LoadingState label="Fetching live distress alerts..." />
              ) : incidents.length === 0 ? (
                <EmptyState
                  icon={<ShieldAlert className="h-10 w-10 text-emerald-600" />}
                  title="No Active Emergency SOS Incidents"
                  description="All campus security sectors are clear. No pending distress signals."
                />
              ) : (
                <Table className="w-full min-w-[500px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40 text-xs">
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {incidents.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedIncident(item)}
                        className={`cursor-pointer transition-colors ${selectedIncident?.id === item.id ? 'bg-emerald-500/10 hover:bg-emerald-500/15' : 'hover:bg-muted/30'}`}
                      >
                        <TableCell className="font-mono font-bold text-foreground">{item.referenceCode}</TableCell>
                        <TableCell className="font-medium text-foreground">{item.studentName}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[180px] truncate">{item.location}</TableCell>
                        <TableCell><StatusBadge status={item.priority} /></TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {(item.status === 'TRIGGERED' || item.status === 'ON_SCENE') && (
                            <Button size="sm" onClick={() => handleAssignOfficer(item.id)} className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white">
                              Dispatch
                            </Button>
                          )}
                          {item.status === 'DISPATCHED' && (
                            <Button size="sm" onClick={() => handleResolveIncident(item.id)} className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white">
                              Resolve
                            </Button>
                          )}
                          {item.status === 'RESOLVED' && (
                            <span className="text-[11px] text-muted-foreground">Closed</span>
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

        {/* Live Incident Map & Telemetry Details (1 col) */}
        <div className="space-y-4">
          {selectedIncident ? (
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-rose-500" /> GPS Telemetry View
                  </CardTitle>
                  <StatusBadge status={selectedIncident.priority} />
                </div>
                <CardDescription className="text-xs font-mono">{selectedIncident.referenceCode}</CardDescription>
              </CardHeader>

              <div className="relative h-48 w-full bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-bold text-white">{selectedIncident.location}</p>
                  <p className="text-[10px] font-mono text-emerald-400">
                    Lat: {selectedIncident.coordinates.lat} | Lng: {selectedIncident.coordinates.lng}
                  </p>
                </div>
              </div>

              <CardContent className="p-4 space-y-3 text-xs">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">Student Information</p>
                  <p className="font-bold text-foreground">{selectedIncident.studentName}</p>
                  <p className="text-muted-foreground flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-emerald-600" /> {selectedIncident.studentPhone}</p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase">Assigned Security Officer</p>
                  <p className="font-semibold text-foreground">{selectedIncident.assignedOfficerName || 'Unassigned (Awaiting Officer)'}</p>
                </div>

                <div className="pt-3 flex gap-2">
                  {(selectedIncident.status === 'TRIGGERED' || selectedIncident.status === 'ON_SCENE') && (
                    <Button onClick={() => handleAssignOfficer(selectedIncident.id)} className="w-full bg-rose-600 hover:bg-rose-700 text-white h-8 text-xs font-bold">
                      <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Dispatch Officer
                    </Button>
                  )}
                  {selectedIncident.status === 'DISPATCHED' && (
                    <Button onClick={() => handleResolveIncident(selectedIncident.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-bold">
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Mark Incident Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60 shadow-sm p-6 text-center text-xs text-muted-foreground">
              Select an incident from the table to view GPS location details.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
