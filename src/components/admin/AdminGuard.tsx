"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAtom, useSetAtom } from "jotai"
import {
  adminUserAtom,
  adminLoadingAtom,
  adminErrorAtom,
  isAdminAuthenticatedAtom,
} from "@/lib/jotai"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [adminUser, setAdminUser] = useAtom(adminUserAtom)
  const [loading, setLoading] = useAtom(adminLoadingAtom)
  const setError = useSetAtom(adminErrorAtom)
  const isAuthenticated = useAtom(isAdminAuthenticatedAtom)[0]

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      if (adminUser) {
        if (mounted) {
          setLoading(false)
        }
        return
      }

      setLoading(true)

      try {
        const supabase = createClient()

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          if (mounted) {
            setError("Not authenticated")
            if (pathname !== "/admin/login") {
              router.push("/admin/login")
            }
          }
          return
        }

        // Check admin status
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (adminError || !adminData || !adminData.is_active) {
          await supabase.auth.signOut()
          if (mounted) {
            setError("Access denied. Not an admin user.")
            if (pathname !== "/admin/login") {
              router.push("/admin/login")
            }
          }
          return
        }

        // Set admin user in state
        if (mounted) {
          setAdminUser({
            id: session.user.id,
            email: session.user.email!,
            user_metadata: session.user.user_metadata,
          })
        }
      } catch (err: any) {
        console.error("Auth check error:", err)
        if (mounted) {
          setError(err.message || "Authentication check failed")
          if (pathname !== "/admin/login") {
            router.push("/admin/login")
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Quick check: if Jotai says authenticated, skip DB call
    if (!isAuthenticated) {
      checkAuth()
    } else {
      setLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [adminUser, isAuthenticated, setAdminUser, setLoading, setError, router, pathname])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto" style={{ color: "#C9A227" }} />
          <p className="mt-4 text-off-white">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
