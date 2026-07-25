import { PageHeader } from "@/components/layout/page-header";
import { EmergencyContactsList } from "@/features/sos/components/emergency-contacts-list";
import { emergencyContacts } from "@/lib/mock-data/sos";

export default function EmergencyContactsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="Verified campus contact details will appear here when the directory is connected."
        eyebrow="Emergency support"
        title="Emergency contacts"
      />
      <EmergencyContactsList contacts={emergencyContacts} />
    </div>
  );
}
