"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAtom } from "jotai"
import { adminUserAtom, adminLoadingAtom, adminErrorAtom } from "@/lib/jotai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [adminUser, setAdminUser] = useAtom(adminUserAtom)
  const [loading, setLoading] = useAtom(adminLoadingAtom)
  const [error, setError] = useAtom(adminErrorAtom)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to authenticate")
      }

      // Login was successful and the server-side cookie has been set securely.
      toast.success("Login successful", {
        description: `Welcome back to the admin portal`,
      })

      // Redirect to admin dashboard using the route's provided path
      setTimeout(() => {
        window.location.href = result.redirectTo || "/admin"
      }, 500)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to login")
      toast.error("Login failed", {
        description: err.message || "Invalid credentials",
      })
    } finally {
      setLoading(false)
    }
  }

  // If already logged in, redirect
  if (adminUser) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin"
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold" style={{ color: "#C9A227" }}>
            ROSTRA
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-off-white">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage products and orders
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-900/20 border border-red-900">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Protected area. Authorized personnel only.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
