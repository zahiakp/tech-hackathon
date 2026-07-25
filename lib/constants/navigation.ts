import {
  Award,
  CalendarDays,
  CalendarCheck2,
  FilePlus2,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LibraryBig,
  Siren,
} from "lucide-react";

import type { NavigationItem } from "@/types/navigation";

export const studentNavigation = [
  {
    title: "Student",
    href: "/student",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "SOS",
    href: "/sos",
    icon: Siren,
  },
  {
    title: "New complaint",
    href: "/complaints/new",
    icon: FilePlus2,
    exact: true,
  },
  {
    title: "Complaints",
    href: "/complaints",
    icon: FileText,
    exact: true,
  },
  {
    title: "Support",
    href: "/support",
    icon: HeartHandshake,
  },
  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck2,
  },
  {
    title: "Rewards",
    href: "/rewards",
    icon: Award,
  },
  {
    title: "Library",
    href: "/library",
    icon: LibraryBig,
  },
] satisfies NavigationItem[];
