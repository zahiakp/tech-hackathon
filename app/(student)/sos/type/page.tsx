import { PageHeader } from "@/components/layout/page-header";
import { EmergencyTypeSelector } from "@/features/sos/components/emergency-type-selector";
import { emergencyTypes } from "@/lib/mock-data/sos";

export default function EmergencyTypePage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="Choose the option that best describes the urgent situation."
        eyebrow="Step 1 of 2"
        title="What kind of help do you need?"
      />
      <EmergencyTypeSelector types={emergencyTypes} />
    </div>
  );
}
