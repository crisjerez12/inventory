"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="toast-professional">
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="toast-title">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="toast-description">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="toast-close" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="brutal-card bg-white font-bold">
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-black text-foreground uppercase tracking-wide">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="font-bold text-muted-foreground uppercase tracking-wide">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="brutal-button bg-white text-black border-2 border-black" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
