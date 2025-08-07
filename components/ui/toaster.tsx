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
          <Toast key={id} {...props} className="brutal-card bg-white font-semibold">
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-bold text-foreground uppercase tracking-wide">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="font-medium text-muted-foreground">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="brutal-button bg-white text-black border-3 border-black" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
