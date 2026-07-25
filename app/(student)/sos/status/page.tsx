import Link from "next/link";
import { ContactRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EmergencyStatusPanel } from "@/features/sos/components/emergency-status-panel";
import { emergencyStatusPreviews } from "@/lib/mock-data/sos";

export default function EmergencyStatusPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        action={
          <Link className={buttonVariants({ variant: "outline" })} href="/sos/contacts">
            <ContactRound />
            Contacts
          </Link>
        }
        description="Review every emergency response state and false-alarm cancellation."
        eyebrow="Emergency response"
        title="SOS status"
      />
      <EmergencyStatusPanel previews={emergencyStatusPreviews} />
    </div>
  );
}
