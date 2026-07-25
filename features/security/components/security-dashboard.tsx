'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, MapPin, Radio, ShieldAlert, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ApiClientError, apiFetch } from '@/lib/api-client';
import type { ApiSosIncident } from '@/lib/api-types';

export function SecurityDashboardFeature() {
  const [incidents, setIncidents] = useState<ApiSosIncident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSOS = useCallback(async () => {
    try {
      const response = await apiFetch<ApiSosIncident[]>('/sos?limit=100');
      setIncidents(response.data);
      setSelectedId((current) =>
        response.data.some(({ id }) => id === current)
          ? current
          : response.data[0]?.id ?? null,
      );
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to load SOS incidents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSOS();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadSOS]);

  async function updateStatus(
    incidentId: string,
    status: 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED',
  ) {
    setUpdatingId(incidentId);
    try {
      await apiFetch(`/sos/${incidentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note: `Status changed to ${status.toLowerCase()}.` }),
      });
      await loadSOS();
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Unable to update the incident.');
    } finally {
      setUpdatingId(null);
    }
  }

  const selected = incidents.find(({ id }) => id === selectedId) ?? null;
  const activeCount = incidents.filter(
    ({ status }) => status !== 'RESOLVED' && status !== 'CANCELLED_FALSE_ALARM',
  ).length;

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} onRetry={() => void loadSOS()} />}

      <Card className="border-rose-500/40 bg-rose-500/10 shadow-sm">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="grid size-10 place-items-center rounded-xl bg-rose-600 text-white">
            <Radio className="size-5" />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
              LIVE SOS DISPATCH FEED
              <Badge variant="destructive">{activeCount} active</Badge>
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-400">
              Location is visible only to authorized security and admin users.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">SOS Incident Desk</CardTitle>
            <CardDescription>Select an incident to inspect its current GPS telemetry.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <LoadingState label="Fetching live distress alerts..." />
            ) : incidents.length === 0 ? (
              <EmptyState icon={ShieldAlert} title="No SOS incidents" description="No emergency records are visible to this account." />
            ) : (
              <Table className="min-w-[640px]">
                <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Reporter</TableHead><TableHead>Captured</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Next action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id} onClick={() => setSelectedId(incident.id)} className="cursor-pointer">
                      <TableCell className="font-mono text-xs">SOS-{incident.id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>{incident.creator.name ?? 'Campus member'}</TableCell>
                      <TableCell>{new Date(incident.capturedAt).toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={incident.status} /></TableCell>
                      <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                        {incident.status === 'OPEN' && <Button size="sm" disabled={updatingId === incident.id} onClick={() => updateStatus(incident.id, 'ACKNOWLEDGED')}>Acknowledge</Button>}
                        {incident.status === 'ACKNOWLEDGED' && <Button size="sm" disabled={updatingId === incident.id} onClick={() => updateStatus(incident.id, 'DISPATCHED')} className="bg-rose-600 text-white"><UserCheck /> Dispatch</Button>}
                        {incident.status === 'DISPATCHED' && <Button size="sm" disabled={updatingId === incident.id} onClick={() => updateStatus(incident.id, 'RESOLVED')} className="bg-emerald-600 text-white"><CheckCircle /> Resolve</Button>}
                        {(incident.status === 'RESOLVED' || incident.status === 'CANCELLED_FALSE_ALARM') && <span className="text-xs text-muted-foreground">No action</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selected ? (
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm"><MapPin className="size-4 text-rose-500" /> GPS telemetry</CardTitle>
              <CardDescription>SOS-{selected.id.slice(-8).toUpperCase()}</CardDescription>
            </CardHeader>
            <div className="grid h-44 place-items-center bg-slate-950 p-4 text-center text-white">
              <div>
                <MapPin className="mx-auto size-8 text-rose-500" />
                <p className="mt-2 text-xs">{selected.note ?? 'Current captured location'}</p>
                <p className="mt-1 font-mono text-[11px] text-emerald-400">{selected.latitude.toFixed(6)}, {selected.longitude.toFixed(6)}</p>
                {selected.accuracy != null && <p className="text-[10px] text-slate-400">Accuracy: {selected.accuracy.toFixed(0)} m</p>}
              </div>
            </div>
            <CardContent className="space-y-3 p-4 text-xs">
              <div><p className="text-muted-foreground">Reporter</p><p className="font-semibold">{selected.creator.name ?? 'Campus member'}</p></div>
              <div><p className="text-muted-foreground">Assigned responder</p><p className="font-semibold">{selected.assignments[0]?.securityUser.name ?? 'Unassigned'}</p></div>
              <StatusBadge status={selected.status} />
            </CardContent>
          </Card>
        ) : (
          <Card className="grid place-items-center p-8 text-sm text-muted-foreground">Select an incident to view details.</Card>
        )}
      </div>
    </div>
  );
}