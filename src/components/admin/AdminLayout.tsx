"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAtom } from "jotai"
import { adminUserAtom, adminSidebarOpenAtom } from "@/lib/jotai"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Toaster } from "sonner"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [adminUser] = useAtom(adminUserAtom)
  const [sidebarOpen, setSidebarOpen] = useAtom(adminSidebarOpenAtom)
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      const supabase = await import("@/lib/supabase/client").then((mod) => mod.createClient())
      await supabase.auth.signOut()
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/admin" className="text-2xl font-bold text-gold" style={{ color: "#C9A227" }}>
              ROSTRA
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="border-t p-4">
            <div className="flex items-center mb-4">
              <Avatar
                className="h-10 w-10 mr-3"
                fallback={adminUser?.email?.charAt(0).toUpperCase() || "A"}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{adminUser?.email}</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("lg:pl-64 transition-all")}>
        <main className="p-6 lg:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toast Toaster */}
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
