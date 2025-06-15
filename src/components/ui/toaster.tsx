import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
export function Toaster() {
  const {
    toasts
  } = useToast();
  return <ToastProvider>
      {toasts.map(function ({
      id,
      title,
      description,
      action,
      ...props
    }) {
      return <Toast key={id} className="bg-slate-950">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-cyan-600 ">{title}</ToastTitle>}
              {description && <ToastDescription className="bg-slate-950 text-cyan-600">{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>;
    })}
      <ToastViewport />
    </ToastProvider>;
}