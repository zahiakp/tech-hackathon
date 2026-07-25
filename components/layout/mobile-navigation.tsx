"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { studentNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryItems = studentNavigation.slice(0, 4);
  const moreItems = studentNavigation.slice(4);
  const isMoreActive = moreItems.some((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  );

  return (
    <nav
      aria-label="Student navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around">
        {primaryItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <li className="flex-1" key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && "bg-primary/10 text-primary",
                )}
                href={item.href}
              >
                <item.icon className="size-5" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <Sheet onOpenChange={setMoreOpen} open={moreOpen}>
            <button
              aria-current={isMoreActive ? "page" : undefined}
              aria-expanded={moreOpen}
              className={cn(
                "flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isMoreActive && "bg-primary/10 text-primary",
              )}
              onClick={() => setMoreOpen(true)}
              type="button"
            >
              <Menu className="size-5" aria-hidden="true" />
              <span>More</span>
            </button>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Student services</SheetTitle>
                <SheetDescription>
                  Open another campus service.
                </SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {moreItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-center gap-3 rounded-xl border p-3 text-sm font-medium transition-colors",
                        isActive && "border-primary bg-primary/5 text-primary",
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={() => setMoreOpen(false)}
                    >
                      <item.icon className="size-5" aria-hidden="true" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
}
