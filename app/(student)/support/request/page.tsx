import { PageHeader } from "@/components/layout/page-header";
import { SupportRequestForm } from "@/features/support/components/support-request-form";

export default function SupportRequestPage() {
  return (
    <div className="grid gap-6">
      <PageHeader description="Share the kind of support you need so the right team can respond." eyebrow="Student care" title="Request support" />
      <SupportRequestForm />
    </div>
  );
}
