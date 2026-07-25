import { Eye } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type PreviewAlertProps = {
  title?: string;
  description: string;
};

export function PreviewAlert({
  title = "UI preview only",
  description,
}: PreviewAlertProps) {
  return (
    <Alert className="border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-100">
      <Eye aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-current/80">
        {description}
      </AlertDescription>
    </Alert>
  );
}
