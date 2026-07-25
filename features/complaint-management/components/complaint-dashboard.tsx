'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_COMPLAINTS } from '@/lib/mock-data/admin-mock-data';
import { ComplaintRecord } from '@/types/common';
import { COMPLAINT_STATUS, ComplaintStatus } from '@/lib/constants/roles';
import { Search, Filter, MessageSquare, ArrowUpRight, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ComplaintDashboardFeature() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(MOCK_COMPLAINTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !noteText) return;
    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Admin Desk',
      note: noteText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = {
      ...selectedComplaint,
      internalNotes: [...(selectedComplaint.internalNotes || []), newNote],
    };
    setSelectedComplaint(updated);
    setComplaints(complaints.map(c => c.id === updated.id ? updated : c));
    setNoteText('');
  };

  return (
    <div className="space-y-6">

      {/* Search & Filter Bar */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reference # or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Filter Status:</span>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'ALL')}>
              <SelectTrigger className="h-9 w-[180px] text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.keys(COMPLAINT_STATUS).map((s) => (
                  <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[550px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>Ref Number</TableHead>
                <TableHead>Title & Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredComplaints.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-foreground">{item.referenceNumber}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-muted-foreground">{item.assignedDepartment}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedComplaint(item)}
                      className="h-7 text-[11px] border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                    >
                      Review & Escalate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Complaint Review & Internal Notes Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        {selectedComplaint && (
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base font-bold">{selectedComplaint.referenceNumber}</DialogTitle>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <DialogDescription className="text-xs">{selectedComplaint.title}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                <p className="font-semibold text-foreground mb-1">Issue Description:</p>
                <p className="text-muted-foreground">{selectedComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-muted-foreground">
                <div><span className="font-semibold text-foreground">Category:</span> {selectedComplaint.category}</div>
                <div><span className="font-semibold text-foreground">Assigned Desk:</span> {selectedComplaint.assignedDepartment}</div>
                <div><span className="font-semibold text-foreground">Campus:</span> {selectedComplaint.campus}</div>
                <div><span className="font-semibold text-foreground">Complainant:</span> {selectedComplaint.isAnonymous ? 'Anonymous Student' : selectedComplaint.studentName}</div>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label>Update Complaint Status</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedComplaint.id, 'UNDER_REVIEW')} className="h-7 text-[11px]">
                    Under Review
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedComplaint.id, 'ASSIGNED')} className="h-7 text-[11px]">
                    Assign Staff
                  </Button>
                  <Button size="sm" onClick={() => handleUpdateStatus(selectedComplaint.id, 'RESOLVED')} className="h-7 text-[11px] bg-emerald-600 text-white">
                    Mark Resolved
                  </Button>
                </div>
              </div>

              {/* Internal Notes History & Form */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <Label className="font-semibold">Internal Audit Notes</Label>
                <div className="max-h-32 overflow-y-auto space-y-2 p-2 rounded-lg bg-muted/30">
                  {selectedComplaint.internalNotes?.length ? (
                    selectedComplaint.internalNotes.map(n => (
                      <div key={n.id} className="p-2 rounded border border-border/40 bg-background text-[11px]">
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>{n.author}</span>
                          <span className="text-muted-foreground text-[10px]">{n.createdAt}</span>
                        </div>
                        <p className="text-muted-foreground mt-0.5">{n.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic">No internal notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
                  <Textarea
                    placeholder="Add internal resolution note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="h-14 text-xs"
                  />
                  <Button type="submit" size="sm" className="bg-emerald-600 text-white self-end">Add Note</Button>
                </form>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
