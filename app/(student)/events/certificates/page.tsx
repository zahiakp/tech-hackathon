import { PageHeader } from "@/components/layout/page-header";
import { CertificateList } from "@/features/events/components/certificate-list";
import { eventCertificates, eventsPreviewData } from "@/lib/mock-data/events";

export default function EventCertificatesPage() {
  return <div className="grid gap-6"><PageHeader description="View participation certificates issued for completed campus events." eyebrow="Achievements" title="Event certificates" /><CertificateList certificates={eventCertificates} events={eventsPreviewData} /></div>;
}
