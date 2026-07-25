import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ComplaintForm } from "@/features/complaints/components/complaint-form";

export default function NewComplaintPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="Submit with your identity or use the anonymous flow."
        eyebrow="Complaints"
        title="New complaint"
      />
      <Card>
        <CardContent>
          <ComplaintForm />
        </CardContent>
      </Card>
    </div>
  );
}
