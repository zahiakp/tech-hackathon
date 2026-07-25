import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type SuccessStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function SuccessState({
  title,
  description,
  action,
}: SuccessStateProps) {
  return (
    <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200">
      <CircleCheck aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-current/80">
        {description}
      </AlertDescription>
      {action && <AlertAction>{action}</AlertAction>}
    </Alert>
  );
}
