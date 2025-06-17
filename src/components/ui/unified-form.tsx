
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UnifiedFormProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const UnifiedForm: React.FC<UnifiedFormProps> = ({
  title,
  description,
  children,
  onSubmit,
  className
}) => {
  return (
    <Card className={cn("bg-slate-950 border-slate-300", className)}>
      <CardHeader className="bg-slate-950 rounded-t-lg">
        <CardTitle className="text-white">{title}</CardTitle>
        {description && (
          <p className="text-slate-400 text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="bg-slate-950 rounded-b-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </CardContent>
    </Card>
  );
};

interface UnifiedFormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export const UnifiedFormField: React.FC<UnifiedFormFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-white font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className="bg-slate-900 border-slate-300 text-white placeholder:text-slate-400 focus:ring-primary focus:border-primary resize-none"
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="bg-slate-900 border-slate-300 text-white placeholder:text-slate-400 focus:ring-primary focus:border-primary"
        />
      )}
    </div>
  );
};

interface UnifiedFormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  className?: string;
}

export const UnifiedFormActions: React.FC<UnifiedFormActionsProps> = ({
  onCancel,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  isSubmitting = false,
  className
}) => {
  return (
    <div className={cn("flex gap-2 justify-end pt-4", className)}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-primary hover:bg-primary/90 text-white"
      >
        {isSubmitting ? "Saving..." : submitText}
      </Button>
    </div>
  );
};
