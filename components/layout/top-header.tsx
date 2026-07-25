import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type TopHeaderProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  signOutAction: () => Promise<void>;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "Student";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function TopHeader({ user, signOutAction }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
      <Separator className="hidden h-5 md:block" orientation="vertical" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">Voxa</p>
        <p className="truncate text-xs text-muted-foreground">
          {user.email ?? "Signed in"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          {user.image && <AvatarImage alt="" src={user.image} />}
          <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
        </Avatar>
        <form action={signOutAction}>
          <Button
            aria-label="Sign out"
            className="sm:w-auto"
            size="icon"
            type="submit"
            variant="outline"
          >
            <LogOut />
          </Button>
        </form>
      </div>
    </header>
  );
}
