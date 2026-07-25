"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Siren } from "lucide-react";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { PreviewAlert } from "@/components/feedback/preview-alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SosLaunchPanel() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <PreviewAlert description="This flow does not contact emergency services. It is a UI preview until the campus emergency backend and contact directory are connected." />

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="items-center text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <Siren className="size-7" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">Need urgent help?</CardTitle>
          <CardDescription className="max-w-md text-balance">
            Start the emergency flow, select what happened, and review location
            sharing before the alert status screen.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ConfirmDialog
            confirmLabel="Continue to emergency type"
            description="Continue only when you need to preview the emergency flow. No alert will be sent from this UI-only version."
            onConfirm={() => router.push("/sos/type")}
            title="Start SOS flow?"
            trigger={
              <Button
                className="size-44 rounded-full border-8 border-destructive/15 text-xl font-bold shadow-xl shadow-destructive/15 sm:size-52"
                type="button"
                variant="destructive"
              >
                <span className="grid place-items-center gap-2">
                  <Siren className="size-10" aria-hidden="true" />
                  SOS
                  <span className="text-xs font-medium opacity-80">
                    Tap to continue
                  </span>
                </span>
              </Button>
            }
          />

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Confirmation helps prevent accidental activation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
