import { z } from "zod"

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  description: z.string().optional().nullable(),
  sort_order: z.number().int().nonnegative().optional(),
  prices: z.array(
    z.object({
      size_gr: z.number().int().positive(),
      price_modifier: z.number().nonnegative(),
      stock_quantity: z.number().int().nonnegative(),
      sku: z.string().optional().nullable(),
    })
  ).min(1, "At least one size is required"),
})

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  category: z.string().default("coffee"),
  is_available: z.boolean().default(true),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  metadata: z.record(z.string(), z.any()).optional().default({}),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
})

export type ProductFormData = z.infer<typeof productSchema>
export type VariantFormData = z.infer<typeof variantSchema>
