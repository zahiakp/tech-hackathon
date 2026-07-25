import { redirect } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requirePageUser } from '@/server/auth/page-guards';

export default async function DashboardPage() {
  const user = await requirePageUser();
  if (user.roles.includes('ADMIN')) redirect('/admin');
  if (user.roles.includes('SECURITY')) redirect('/security');
  if (user.roles.includes('COORDINATOR')) redirect('/admin/complaints');
  if (user.roles.includes('COUNSELLOR')) redirect('/counsellor/appointments');
  if (user.roles.includes('FACULTY')) redirect('/faculty/attendance');
  if (user.roles.includes('LIBRARY_STAFF')) redirect('/library-staff');

  return (
    <main className="grid min-h-screen place-items-center bg-background p-5">
      <Card className="w-full max-w-xl">
        <CardHeader><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="size-5" /></span><CardTitle className="mt-4 text-3xl">Welcome, {user.name ?? 'student'}.</CardTitle><CardDescription>Your student safety and support frontend is not part of the staff UI handoff yet. Authentication and student APIs are active.</CardDescription></CardHeader>
        <CardContent><p className="mb-5 text-sm text-muted-foreground">Signed in as {user.email}</p><form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}><Button type="submit" variant="outline"><LogOut /> Sign out</Button></form></CardContent>
      </Card>
    </main>
  );
}