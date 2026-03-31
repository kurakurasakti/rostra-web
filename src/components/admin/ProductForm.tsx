"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import {
  productSchema,
  type ProductFormData,
  type VariantFormData,
} from "@/lib/schemas"
import {
  STANDARD_GRIND_SIZES,
  STANDARD_WEIGHTS,
} from "@/types"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ProductFormProps {
  productId?: string
  initialData?: any
}

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const isEditing = !!productId

  // Transform initial data to form format
  const getDefaultValues = (): ProductFormData => {
    if (initialData) {
      const variants: VariantFormData[] = initialData.product_variants.map((variant: any) => ({
        id: variant.id || undefined,
        name: variant.name || "",
        description: variant.description || null,
        sort_order: variant.sort_order ?? 0,
        prices: variant.product_sizes.map((size: any) => ({
          size_gr: size.volume_gr || 0,
          price_modifier: size.price_modifier || 0,
          stock_quantity: size.stock_quantity || 0,
          sku: size.sku ?? null,
        })),
      }))

      return {
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "coffee",
        is_available: initialData.is_available ?? true,
        image_url: initialData.image_url || "",
        metadata: initialData.metadata || {},
        variants,
      }
    }

    // Default: 4 grind sizes with 3 weights each
    const defaultVariants: VariantFormData[] = STANDARD_GRIND_SIZES.map((grind, index) => ({
      name: grind.name,
      description: grind.description,
      sort_order: index,
      prices: STANDARD_WEIGHTS.map((weight) => ({
        size_gr: weight.volume_gr,
        price_modifier: 0,
        stock_quantity: 0,
        sku: null,
      })),
    }))

    return {
      name: "",
      description: "",
      category: "coffee",
      is_available: true,
      image_url: "",
      metadata: {},
      variants: defaultVariants,
    }
  }

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: getDefaultValues(),
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  useEffect(() => {
    if (initialData) {
      form.reset(getDefaultValues())
    }
  }, [initialData, form])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) {
        throw new Error("Cloudinary not configured")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "rostra-products") // Create unsigned preset in Cloudinary
      formData.append("folder", "rostra/products")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      return data.secure_url
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error("Image upload failed", { description: error.message })
      return null
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    const loadingToast = toast.loading("Saving product...")
    setLoading(true)
    try {
      const url = isEditing
        ? `/api/products/${productId}`
        : "/api/products"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save product")
      }

      toast.success(isEditing ? "Product updated successfully" : "Product created successfully", {
        description: isEditing ? "Your changes have been saved." : "Your new product has been added to the catalog.",
      })

      router.push("/admin/products")
    } catch (error: any) {
      console.error("Submit error:", error)
      toast.error("Failed to save product", { description: error.message })
    } finally {
      setLoading(false)
      toast.dismiss(loadingToast)
    }
  }

  const handleAddVariant = () => {
    append({
      name: "",
      description: "",
      sort_order: fields.length,
      prices: STANDARD_WEIGHTS.map((weight) => ({
        size_gr: weight.volume_gr,
        price_modifier: 0,
        stock_quantity: 0,
        sku: null,
      })),
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await handleImageUpload(file)
    if (url) {
      form.setValue("image_url", url)
    }
  }

  return (
    <Form form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., The Origin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} placeholder="Product description..." value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., coffee, merchandise" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Show product in store
                    </p>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <div className="flex gap-4">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/image.jpg"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <Button type="button" variant="outline" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
                {field.value && (
                  <div className="mt-2 w-full max-w-[200px] h-32 border rounded overflow-hidden">
                    <img
                      src={field.value}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <FormDescription>
                  Enter a URL or upload an image to Cloudinary
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Variants (Grind Sizes) */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Grind Sizes</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <VariantField
                key={field.id}
                index={index}
                control={form.control}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Variant sub-component
function VariantField({
  index,
  control,
  onRemove,
  canRemove,
}: {
  index: number
  control: any
  onRemove: () => void
  canRemove: boolean
}) {
  const { fields: sizeFields, update: updateSize } = useFieldArray({
    control,
    name: `variants.${index}.prices`,
  }) as any

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 flex-1">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`variants.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grind Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Coarse" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`variants.${index}.sort_order`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <FormField
        control={control}
        name={`variants.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Variant description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sizes (Weights) */}
      <div className="space-y-2">
        <FormLabel>Weight Options & Pricing</FormLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sizeFields.map((sizeField: any, sizeIndex: number) => (
            <div
              key={sizeField.id}
              className="border rounded p-3 space-y-3 bg-muted/30"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">
                  {sizeField.size_gr}g
                </span>
              </div>

              <FormField
                control={control}
                name={`variants.${index}.prices.${sizeIndex}.price_modifier`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Price Modifier (IDR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.prices.${sizeIndex}.stock_quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.prices.${sizeIndex}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">SKU (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SKU" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
