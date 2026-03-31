import { atom } from "jotai"

// UI state atoms for admin pages
export const adminSidebarOpenAtom = atom<boolean>(true)
export const adminCurrentPageAtom = atom<string>("dashboard")

// Product form state
export const productFormDirtyAtom = atom<boolean>(false)
export const productFormSubmittingAtom = atom<boolean>(false)

// Toast notifications
export const toastAtom = atom<{
  title: string
  description?: string
  variant?: "default" | "destructive"
} | null>(null)

// Selected product for edit
export const selectedProductIdAtom = atom<string | null>(null)

// Confirmation dialogs
export const confirmDialogAtom = atom<{
  open: boolean
  title: string
  description: string
  onConfirm: () => void
}>({
  open: false,
  title: "",
  description: "",
  onConfirm: () => {},
})
