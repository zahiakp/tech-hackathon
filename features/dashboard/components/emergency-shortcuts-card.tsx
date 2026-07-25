import {
  HeartPulse,
  ShieldAlert,
  Siren,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "@/components/shared/section-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { EmergencyShortcut } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type EmergencyShortcutsCardProps = {
  shortcuts: EmergencyShortcut[];
};

const shortcutAppearance: Record<
  EmergencyShortcut["kind"],
  { icon: LucideIcon; className: string }
> = {
  sos: {
    icon: Siren,
    className:
      "border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/5",
  },
  security: {
    icon: ShieldAlert,
    className: "border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-200",
  },
  medical: {
    icon: HeartPulse,
    className:
      "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200",
  },
};

export function EmergencyShortcutsCard({
  shortcuts,
}: EmergencyShortcutsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <SectionHeader
          description="Emergency actions will be enabled when the SOS module is connected"
          title="Emergency shortcuts"
        />
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {shortcuts.map((shortcut) => {
          const appearance = shortcutAppearance[shortcut.kind];
          const Icon = appearance.icon;

          return (
            <Link
              aria-describedby={`${shortcut.id}-description`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto min-h-24 items-start justify-start whitespace-normal p-4 text-left",
                appearance.className,
              )}
              href={shortcut.href}
              key={shortcut.id}
            >
              <Icon className="mt-0.5 size-5" aria-hidden="true" />
              <span className="grid gap-1">
                <span className="font-semibold">{shortcut.title}</span>
                <span
                  className="text-xs font-normal opacity-80"
                  id={`${shortcut.id}-description`}
                >
                  {shortcut.description}
                </span>
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
