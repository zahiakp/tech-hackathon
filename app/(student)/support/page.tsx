import Link from "next/link";
import {
  Bot,
  CalendarDays,
  HeartHandshake,
  LibraryBig,
  MessageCircleHeart,
  UserRoundSearch,
} from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const supportActions = [
  { href: "/support/mentors", title: "Browse mentors", description: "Academic, career, and campus guidance.", icon: UserRoundSearch },
  { href: "/support/counsellors", title: "Browse counsellors", description: "Confidential professional well-being support.", icon: HeartHandshake },
  { href: "/support/request", title: "Request support", description: "Tell the team what kind of help you need.", icon: MessageCircleHeart },
  { href: "/support/appointments", title: "Appointments", description: "Review and book support sessions.", icon: CalendarDays },
  { href: "/support/resources", title: "Well-being resources", description: "Short guides for everyday student well-being.", icon: LibraryBig },
  { href: "/support/lexa", title: "Lexa", description: "Ask Voxa's campus-resource assistant for safe next steps.", icon: Bot },
];

export default function SupportPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        action={<Link className={buttonVariants()} href="/support/request">Request support</Link>}
        description="Find the right person, book a conversation, or explore practical well-being resources."
        eyebrow="Student care"
        title="Peer support & well-being"
      />
      <PreviewAlert description="Some directory cards use demo data. Lexa and protected support services connect to the Voxa backend." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {supportActions.map((action) => (
          <Link className="group" href={action.href} key={action.href}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <action.icon className="size-6 text-primary" aria-hidden="true" />
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
