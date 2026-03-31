"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye, Plus } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product, ProductWithRelations } from "@/types/database.types"

export default function ProductTable() {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
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
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products", { description: "Please refresh the page to try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").delete().eq("id", deleteId)

      if (error) throw error

      setProducts(products.filter((p) => p.id !== deleteId))
      toast.success("Product deleted successfully", { description: "The product and all its variants have been permanently removed." })
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product", { description: error.message })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const getPriceRange = (product: ProductWithRelations) => {
    const allPrices: number[] = []
    product.product_variants.forEach((variant) => {
      variant.product_sizes.forEach((size) => {
        allPrices.push(size.price_modifier)
      })
    })
    if (allPrices.length === 0) return "-"
    const min = Math.min(...allPrices)
    const max = Math.max(...allPrices)
    return min === max ? `IDR ${min.toLocaleString()}` : `IDR ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">No products yet. Create your first product!</p>
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Price Range</TableHead>
                  <TableHead className="hidden md:table-cell">Availability</TableHead>
                  <TableHead className="hidden lg:table-cell">Variants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium min-w-[200px]">
                      <div>
                        <p>{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="min-w-[120px] hidden sm:table-cell">{getPriceRange(product)}</TableCell>
                    <TableCell className="min-w-[100px] hidden md:table-cell">
                      <Badge variant={product.is_available ? "success" : "secondary"}>
                        {product.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{product.product_variants.length} grind sizes</TableCell>
                    <TableCell className="text-right min-w-[140px]">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(product.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action will also delete all
              associated variants and size configurations. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
