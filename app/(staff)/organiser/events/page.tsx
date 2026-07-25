import { EventOrganiserDashboardFeature } from '@/features/event-organiser/components/event-organiser-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function EventOrganiserPage() {
  await requirePageRole('ADMIN');
  return <EventOrganiserDashboardFeature />;
}