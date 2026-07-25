'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_BOOKS, MOCK_LIBRARY_ISSUES } from '@/lib/mock-data/admin-mock-data';
import { LibraryBookRecord, LibraryIssueRecord } from '@/types/common';
import { BookOpen, Search, ArrowRightLeft, DollarSign, AlertCircle, Plus } from 'lucide-react';

export function LibraryDashboardFeature() {
  const [books, setBooks] = useState<LibraryBookRecord[]>(MOCK_BOOKS);
  const [issues, setIssues] = useState<LibraryIssueRecord[]>(MOCK_LIBRARY_ISSUES);
  const [studentIdScan, setStudentIdScan] = useState('');
  const [bookIsbnScan, setBookIsbnScan] = useState('');

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdScan || !bookIsbnScan) return;
    const newIssue: LibraryIssueRecord = {
      id: `iss-${Date.now()}`,
      bookId: 'bk-101',
      bookTitle: 'Effective Java (3rd Edition)',
      studentId: studentIdScan,
      studentName: 'Student #' + studentIdScan,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-08-08',
      fineAmount: 0,
      status: 'ISSUED',
    };
    setIssues([newIssue, ...issues]);
    setStudentIdScan('');
    setBookIsbnScan('');
  };

  return (
    <div className="space-y-6">

      {/* Quick Issue / Return Desk Card */}
      <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <ArrowRightLeft className="h-4 w-4 text-emerald-600" /> Rapid Book Circulation Desk
          </CardTitle>
          <CardDescription className="text-xs">Scan or enter Student ID & ISBN to issue or process return</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleIssueBook} className="grid sm:grid-cols-3 gap-3 items-end text-xs">
            <div className="space-y-1">
              <Label>Student ID Number</Label>
              <Input placeholder="Scan or enter STD-204..." value={studentIdScan} onChange={(e) => setStudentIdScan(e.target.value)} className="h-9" />
            </div>

            <div className="space-y-1">
              <Label>Book ISBN Barcode</Label>
              <Input placeholder="Scan ISBN 978-0134685991..." value={bookIsbnScan} onChange={(e) => setBookIsbnScan(e.target.value)} className="h-9" />
            </div>

            <Button type="submit" className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Process Book Issue
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Overdue Issues & Fine Tracker */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Overdue Books & Unpaid Fines
          </CardTitle>
          <CardDescription className="text-xs">Automated daily overdue fine calculations</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[550px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>Student Name</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Fine Accrued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {issues.map((iss) => (
                <TableRow key={iss.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-foreground">{iss.studentName}</TableCell>
                  <TableCell className="font-medium text-foreground">{iss.bookTitle}</TableCell>
                  <TableCell className="text-rose-600 font-mono font-bold">{iss.dueDate}</TableCell>
                  <TableCell className="font-bold text-rose-600">${iss.fineAmount.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={iss.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="h-7 text-[11px] bg-emerald-600 text-white">
                      Clear Fine & Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Library Catalog Inventory */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Library Book Catalog</CardTitle>
          <CardDescription className="text-xs">Copy availability & shelf location index</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>ISBN</TableHead>
                <TableHead>Title & Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Available Copies</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {books.map((bk) => (
                <TableRow key={bk.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-foreground">{bk.isbn}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{bk.title}</div>
                    <div className="text-[11px] text-muted-foreground">{bk.author}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{bk.category}</TableCell>
                  <TableCell className="text-muted-foreground font-mono">{bk.shelfLocation}</TableCell>
                  <TableCell className="font-bold text-emerald-600">{bk.availableCopies} / {bk.totalCopies}</TableCell>
                  <TableCell><StatusBadge status={bk.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
