import type {
  ComplaintCategory,
  ComplaintStatus,
} from "@/features/complaints/types";
import type { StatusTone } from "@/types/status";

export const complaintCategories: Array<{
  value: ComplaintCategory;
  label: string;
}> = [
  { value: "academic", label: "Academic" },
  { value: "facilities", label: "Campus facilities" },
  { value: "harassment", label: "Harassment or misconduct" },
  { value: "hostel", label: "Hostel" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
];

export const complaintStatusDisplay: Record<
  ComplaintStatus,
  { label: string; tone: StatusTone }
> = {
  submitted: { label: "Submitted", tone: "muted" },
  assigned: { label: "Assigned", tone: "info" },
  "in-review": { label: "In review", tone: "warning" },
  "awaiting-student": { label: "Action needed", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  closed: { label: "Closed", tone: "muted" },
};

export const complaintCategoryLabels = Object.fromEntries(
  complaintCategories.map((category) => [category.value, category.label]),
) as Record<ComplaintCategory, string>;
