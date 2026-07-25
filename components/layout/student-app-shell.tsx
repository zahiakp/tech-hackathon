import type { ReactNode } from "react";

import { ContentContainer } from "@/components/layout/content-container";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

type StudentAppShellProps = {
  children: ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  signOutAction: () => Promise<void>;
};

export function StudentAppShell({
  children,
  user,
  signOutAction,
}: StudentAppShellProps) {
  return (
    <TooltipProvider>
      <Toaster>
        <SidebarProvider>
          <StudentSidebar />
          <SidebarInset className="min-w-0">
            <TopHeader user={user} signOutAction={signOutAction} />
            <main className="min-w-0 flex-1 pb-20 md:pb-0">
              <ContentContainer>{children}</ContentContainer>
            </main>
            <MobileNavigation />
          </SidebarInset>
        </SidebarProvider>
      </Toaster>
    </TooltipProvider>
  );
}
