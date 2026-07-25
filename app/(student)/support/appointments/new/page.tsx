import { PageHeader } from "@/components/layout/page-header";
import { AppointmentBookingForm } from "@/features/support/components/appointment-booking-form";

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ person?: string }>;
}) {
  const { person } = await searchParams;
  return (
    <div className="grid gap-6">
      <PageHeader description="Choose a person, available date, time, and meeting mode." eyebrow="Student care" title="Book an appointment" />
      <AppointmentBookingForm initialPersonId={person} />
    </div>
  );
}
