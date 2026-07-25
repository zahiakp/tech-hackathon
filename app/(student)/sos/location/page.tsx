import { PageHeader } from "@/components/layout/page-header";
import { LocationSharingPanel } from "@/features/sos/components/location-sharing-panel";

export default async function LocationSharingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Review location consent before continuing to emergency status."
        eyebrow="Step 2 of 2"
        title="Location sharing"
      />
      <LocationSharingPanel selectedType={type} />
    </div>
  );
}
