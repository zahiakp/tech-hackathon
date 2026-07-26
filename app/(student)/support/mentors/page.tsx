import { PageHeader } from "@/components/layout/page-header";
import { SupportDirectory } from "@/features/support/components/support-directory";
import { supportPeople } from "@/lib/mock-data/support";

export default function MentorsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader description="Find peer guidance for academics, careers, and campus life." eyebrow="Peer support" title="Browse mentors" />

      <SupportDirectory people={supportPeople} role="mentor" />
    </div>
  );
}
