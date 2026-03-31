"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const loadingToast = toast.loading("Loading product details...")
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            product_variants (
              *,
              product_sizes (*)
            )
          `)
          .eq("id", productId)
          .single()

        if (error) throw error
        setInitialData(data)
      } catch (error: any) {
        console.error("Error fetching product:", error)
        toast.error("Failed to load product", { description: error.message })
      } finally {
        setLoading(false)
        toast.dismiss(loadingToast)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="p-6">
        <p className="text-red-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product details, variants, and pricing.</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <ProductForm productId={productId} initialData={initialData} />
      </div>
    </div>
  )
}
