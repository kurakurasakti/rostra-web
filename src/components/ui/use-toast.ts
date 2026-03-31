// Sonner-based toast — re-export for use across the app
export { toast, Toaster } from "sonner"

// Convenience hook that mirrors the old useToast() API
import { toast } from "sonner"

export function useToast() {
  return { toast }
}
