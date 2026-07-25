'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { MOCK_ADMIN_USERS } from '@/lib/mock-data/admin-mock-data';
import { AdminUser } from '@/types/common';
import { USER_ROLES, UserRole } from '@/lib/constants/roles';
import { UserPlus, Search, ShieldCheck, UserX, CheckCircle, Edit3 } from 'lucide-react';

export function UserManagementFeature() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STAFF' as UserRole);
  const [campus, setCampus] = useState('Main North Campus');
  const [department, setDepartment] = useState('Administration');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: role || 'FACULTY',
      campus,
      department,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Just now',
    };
    setUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setName('');
    setEmail('');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <div className="space-y-6">
      {/* Filter & Search Controls Bar */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Filter Role:</span>
              <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || 'ALL')}>
                <SelectTrigger className="h-9 w-[160px] text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All System Roles</SelectItem>
                  {Object.keys(USER_ROLES).map((r) => (
                    <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setIsAddUserOpen(true)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs">
              <UserPlus className="h-4 w-4" /> Add New User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto w-full min-w-0">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs">
                <TableHead>User Name & Email</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Campus Location</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-semibold text-foreground">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell><StatusBadge status={user.role} /></TableCell>
                  <TableCell className="text-muted-foreground">{user.campus}</TableCell>
                  <TableCell className="text-muted-foreground">{user.department || 'N/A'}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                        <CheckCircle className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500 font-medium text-xs">
                        <UserX className="h-3.5 w-3.5" /> Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleUserStatus(user.id)}
                      className={user.isActive ? "text-rose-600 border-rose-500/20 hover:bg-rose-500/10 h-7 px-2 text-[11px]" : "text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 h-7 px-2 text-[11px]"}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Staff or Admin User</DialogTitle>
            <DialogDescription className="text-xs">Provision system credentials and role permissions</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Jane Doe" className="h-9" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">University Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.doe@univ.edu" className="h-9" />
            </div>

            <div className="space-y-1.5">
              <Label>Assigned Role</Label>
              <Select value={role} onValueChange={(val) => setRole((val as UserRole) || 'FACULTY')}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(USER_ROLES).map((r) => (
                    <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campus">Campus Assignment</Label>
              <Input id="campus" value={campus} onChange={(e) => setCampus(e.target.value)} className="h-9" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Provision Account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
