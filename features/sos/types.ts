export type EmergencyTypeId =
  | "medical"
  | "security"
  | "fire"
  | "personal-safety"
  | "other";

export type EmergencyStatus =
  | "pending"
  | "active"
  | "cancelled"
  | "failed"
  | "resolved";

export type EmergencyType = {
  id: EmergencyTypeId;
  title: string;
  description: string;
};

export type EmergencyContact = {
  id: string;
  title: string;
  description: string;
  availability: string;
};

export type EmergencyStatusPreview = {
  status: EmergencyStatus;
  title: string;
  description: string;
  updatedAt: string;
};
