import { Clock3, Phone, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmergencyContact } from "@/features/sos/types";

type EmergencyContactsListProps = {
  contacts: EmergencyContact[];
};

export function EmergencyContactsList({
  contacts,
}: EmergencyContactsListProps) {
  return (
    <div className="grid gap-6">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contacts.map((contact) => (
          <Card className="h-full" key={contact.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <StatusBadge label="Directory pending" tone="muted" />
              </div>
              <CardTitle>{contact.title}</CardTitle>
              <CardDescription>{contact.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
                {contact.availability}
              </p>
              <Button className="w-full" disabled variant="outline">
                <Phone />
                Contact unavailable
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
