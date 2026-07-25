import type { ReactNode } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type FormFieldProps = {
  children: ReactNode;
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
};

export function FormField({
  children,
  id,
  label,
  description,
  error,
  required,
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </FieldLabel>
      {children}
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
