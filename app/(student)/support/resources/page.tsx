import { PageHeader } from "@/components/layout/page-header";
import { ResourceGrid } from "@/features/support/components/resource-grid";
import { wellbeingResources } from "@/lib/mock-data/support";

export default function WellbeingResourcesPage() {
  return (
    <div className="grid gap-6">
      <PageHeader description="Short, practical guides for managing everyday student stress and maintaining balance." eyebrow="Self care" title="Well-being resources" />

      <ResourceGrid resources={wellbeingResources} />
    </div>
  );
}
