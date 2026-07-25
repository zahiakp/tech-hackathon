import { EmptyState } from "@/components/feedback/empty-state";
import { SupportPersonCard } from "@/features/support/components/support-person-card";
import type { SupportPerson, SupportRole } from "@/features/support/types";

export function SupportDirectory({
  people,
  role,
}: {
  people: SupportPerson[];
  role: SupportRole;
}) {
  const filtered = people.filter((person) => person.role === role);

  if (!filtered.length) {
    return (
      <EmptyState
        description={`Available ${role}s will appear here.`}
        title={`No ${role}s available`}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {filtered.map((person) => (
        <SupportPersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}
