import Link from "next/link";
import { CalendarPlus, Languages, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SupportPerson } from "@/features/support/types";

export function SupportPersonCard({ person }: { person: SupportPerson }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start">
        <Avatar className="size-11">
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle>{person.name}</CardTitle>
          <CardDescription>{person.specialty}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid flex-1 gap-3 text-sm">
        <p className="leading-6 text-muted-foreground">{person.bio}</p>
        <p className="font-medium text-primary">{person.availability}</p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Languages className="size-4" aria-hidden="true" />
          {person.languages.join(" · ")}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/support/chat/${person.id}`}
        >
          <MessageCircle />
          Chat
        </Link>
        <Link
          className={buttonVariants()}
          href={`/support/appointments/new?person=${person.id}`}
        >
          <CalendarPlus />
          Book
        </Link>
      </CardFooter>
    </Card>
  );
}
