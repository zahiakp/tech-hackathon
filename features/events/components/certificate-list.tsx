"use client";

import { Award, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventCertificate, EventRecord } from "@/features/events/types";

export function CertificateList({ certificates, events }: { certificates: EventCertificate[]; events: EventRecord[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {certificates.map((certificate) => {
        const event = events.find((item) => item.id === certificate.eventId);
        return (
          <Card key={certificate.id}>
            <CardHeader className="flex-row items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"><Award className="size-5" /></span>
              <div><CardTitle>{event?.title}</CardTitle><p className="text-sm text-muted-foreground">Issued {certificate.issuedAt}</p></div>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}><Eye />View certificate</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Participation certificate</DialogTitle>
                    <DialogDescription>Preview certificate — not a downloadable official document.</DialogDescription>
                  </DialogHeader>
                  <div className="grid min-h-64 place-items-center rounded-xl border bg-muted/30 p-8 text-center">
                    <div>
                      <Award className="mx-auto mb-4 size-12 text-primary" />
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Certificate of participation</p>
                      <p className="mt-4 text-2xl font-bold">Preview Student</p>
                      <p className="mt-2 text-muted-foreground">{event?.title}</p>
                      <p className="mt-6 font-mono text-xs">{certificate.certificateNumber}</p>
                    </div>
                  </div>
                  <DialogFooter><DialogClose render={<Button variant="outline" />}>Close</DialogClose></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
