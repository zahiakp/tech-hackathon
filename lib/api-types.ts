import type {
  AppointmentStatus,
  ComplaintStatus,
  RoleCode,
  SosStatus,
  UserStatus,
} from "@/app/generated/prisma/enums";

export type ApiRole = { role: { code: RoleCode; name: string } };

export type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  status: UserStatus;
  profile: {
    campus: string | null;
    department: string | null;
  } | null;
  roles: ApiRole[];
  createdAt: string;
};

export type ApiComplaintListItem = {
  id: string;
  referenceCode: string;
  title: string;
  description: string;
  anonymous: boolean;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
  assignedTo: { id: string; name: string | null } | null;
};

export type ApiComplaintDetail = ApiComplaintListItem & {
  reporter: { id: string; name: string | null; email: string } | null;
  messages: Array<{
    id: string;
    body: string;
    fromStaff: boolean;
    createdAt: string;
    author: { id: string; name: string | null } | null;
  }>;
};

export type ApiSosIncident = {
  id: string;
  creatorId: string;
  status: SosStatus;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  capturedAt: string;
  note: string | null;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    profile?: { phone?: string | null } | null;
  };
  assignments: Array<{
    securityUser: { id: string; name: string | null };
  }>;
};

export type ApiAppointment = {
  id: string;
  status: AppointmentStatus;
  startAt: string;
  endAt: string;
  notes: string | null;
  student: { id: string; name: string | null };
  conversation: { id: string } | null;
  supportProfile: {
    id: string;
    user: { id: string; name: string | null };
  };
};
