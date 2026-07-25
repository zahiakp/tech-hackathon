import Link from "next/link";
import { ContactRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { SosLaunchPanel } from "@/features/sos/components/sos-launch-panel";

export default function SosPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        action={
          <Link className={buttonVariants({ variant: "outline" })} href="/sos/contacts">
            <ContactRound />
            Emergency contacts
          </Link>
        }
        description="Start a clear, accessible emergency flow with accidental-tap protection."
        eyebrow="Emergency support"
        title="SOS"
      />
      <SosLaunchPanel />
    </div>
  );
}
