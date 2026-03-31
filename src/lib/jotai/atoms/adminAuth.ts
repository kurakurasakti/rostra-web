import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { AdminUser } from "@/types"

// Auth state atom (non-persisted)
export const adminUserAtom = atom<AdminUser | null>(null)
export const adminLoadingAtom = atom<boolean>(false)
export const adminErrorAtom = atom<string | null>(null)

// Session persistence (optional - can also rely on Supabase session)
export const adminSessionAtom = atomWithStorage<{
  access_token: string
  refresh_token: string
  expires_at: number
} | null>("admin-session", null)

// Helper atom to check if admin is authenticated
export const isAdminAuthenticatedAtom = atom(
  (get) => !!get(adminUserAtom)
)
