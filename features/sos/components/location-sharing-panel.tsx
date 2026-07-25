import Link from "next/link";
import { LocateFixed, LockKeyhole, MapPin, Navigation } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LocationSharingPanelProps = {
  selectedType?: string;
};

export function LocationSharingPanel({
  selectedType,
}: LocationSharingPanelProps) {
  return (
    <div className="grid gap-6">
      <PreviewAlert description="Location permission is not requested and coordinates are not transmitted in this UI-only version." />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                Share your location
              </CardTitle>
              <CardDescription>
                Responders would use this location to reach you faster.
              </CardDescription>
            </div>
            <StatusBadge label="Not shared" tone="muted" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="relative grid min-h-56 place-items-center overflow-hidden rounded-xl border bg-muted/40">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
            <span className="relative grid size-16 place-items-center rounded-full border-8 border-primary/10 bg-background text-primary shadow-sm">
              <LocateFixed className="size-7" aria-hidden="true" />
            </span>
          </div>

          <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Emergency type</p>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {selectedType?.replace("-", " ") ?? "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Privacy</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <LockKeyhole className="size-3.5" aria-hidden="true" />
                Explicit consent required
              </p>
            </div>
          </div>

          <button
            className={cn(
              buttonVariants(),
              "h-11 w-full cursor-not-allowed opacity-50",
            )}
            disabled
            type="button"
          >
            <Navigation />
            Share current location
          </button>

          <Link
            className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full")}
            href="/sos/status"
          >
            Preview emergency status
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
