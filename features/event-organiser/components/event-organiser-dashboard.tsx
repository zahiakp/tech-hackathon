'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_EVENTS } from '@/lib/mock-data/admin-mock-data';
import { EventRecord } from '@/types/common';
import { CalendarDays, Plus, Award, Scan, AwardIcon, FileCheck } from 'lucide-react';

export function EventOrganiserDashboardFeature() {
  const [events, setEvents] = useState<EventRecord[]>(MOCK_EVENTS);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hackathon & Tech');
  const [date, setDate] = useState('2026-08-01');
  const [venue, setVenue] = useState('Auditorium A');
  const [capacity, setCapacity] = useState(250);
  const [rewardPoints, setRewardPoints] = useState(100);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt: EventRecord = {
      id: `evt-${Date.now()}`,
      title,
      description: 'Campus sponsored event',
      category,
      organiserName: 'Marcus Brody',
      date,
      venue,
      capacity,
      registeredCount: 0,
      attendedCount: 0,
      rewardPoints,
      status: 'UPCOMING',
      subSessions: [],
    };
    setEvents([newEvt, ...events]);
    setIsAddEventOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Events Listing Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Active & Upcoming Campus Events</CardTitle>
            <CardDescription className="text-xs">Capacity management, registrations & student point distribution</CardDescription>
          </div>
          <Button onClick={() => setIsAddEventOpen(true)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs">
            <Plus className="h-4 w-4" /> Create New Event
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>Event Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date & Venue</TableHead>
                <TableHead>Capacity / Reg.</TableHead>
                <TableHead>Reward Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {events.map((evt) => (
                <TableRow key={evt.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-foreground">{evt.title}</TableCell>
                  <TableCell className="text-muted-foreground">{evt.category}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{evt.date}</div>
                    <div className="text-[11px] font-mono">{evt.venue}</div>
                  </TableCell>
                  <TableCell className="font-mono">
                    <span className="font-bold text-emerald-600">{evt.registeredCount}</span> / {evt.capacity}
                  </TableCell>
                  <TableCell className="font-bold text-amber-600">+{evt.rewardPoints} pts</TableCell>
                  <TableCell><StatusBadge status={evt.status} /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-emerald-500/30 text-emerald-600">
                      <Scan className="h-3 w-3" /> Scan ID
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-purple-500/30 text-purple-600">
                      <FileCheck className="h-3 w-3" /> Certificates
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Event Modal */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Campus Event</DialogTitle>
            <DialogDescription className="text-xs">Set event capacity, date & reward points</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label>Event Title</Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI Innovation Summit 2026" className="h-9" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Event Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label>Max Capacity</Label>
                <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="h-9" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Venue Location</Label>
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Main Auditorium" className="h-9" />
            </div>

            <div className="space-y-1">
              <Label>Reward Points Awarded</Label>
              <Input type="number" value={rewardPoints} onChange={(e) => setRewardPoints(Number(e.target.value))} className="h-9" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 text-white">Publish Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
