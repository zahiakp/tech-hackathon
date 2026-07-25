"use client";

import Link from "next/link";
import { Archive, Inbox } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ComplaintCard } from "@/features/complaints/components/complaint-card";
import type { ComplaintRecord } from "@/features/complaints/types";
import { buttonVariants } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ComplaintsOverviewProps = {
  complaints: ComplaintRecord[];
};

export function ComplaintsOverview({
  complaints,
}: ComplaintsOverviewProps) {
  const active = complaints.filter(
    (complaint) =>
      complaint.status !== "resolved" && complaint.status !== "closed",
  );
  const resolved = complaints.filter(
    (complaint) =>
      complaint.status === "resolved" || complaint.status === "closed",
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className={buttonVariants({ variant: "outline" })} href="/complaints/inbox">
          <Inbox />
          Anonymous inbox
        </Link>
        <Link className={buttonVariants({ variant: "outline" })} href="/complaints/history">
          <Archive />
          Complaint history
        </Link>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 sm:w-80">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
        </TabsList>
        <TabsContent className="pt-4" value="active">
          {active.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {active.map((complaint) => (
                <ComplaintCard complaint={complaint} key={complaint.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="New and in-progress complaints will appear here."
              title="No active complaints"
            />
          )}
        </TabsContent>
        <TabsContent className="pt-4" value="resolved">
          {resolved.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {resolved.map((complaint) => (
                <ComplaintCard complaint={complaint} key={complaint.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="Completed complaint records will appear here."
              title="No resolved complaints"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
