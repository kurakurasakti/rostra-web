import { z } from "zod"

export const sizeSchema = z.object({
  product_id: z.string().uuid("Valid product ID is required"),
  variant_id: z.string().uuid("Valid variant ID is required"),
  name: z.string().min(1, "Size name is required"),
  volume_gr: z.number().int().positive("Volume must be a positive integer"),
  price_modifier: z.number().nonnegative("Price modifier must be non-negative"),
  stock_quantity: z.number().int().nonnegative().default(0),
  sku: z.string().optional().nullable(),
})

export const sizeUpdateSchema = sizeSchema.omit({ product_id: true, variant_id: true }).partial()

export type SizeFormData = z.infer<typeof sizeSchema>
export type SizeUpdateData = z.infer<typeof sizeUpdateSchema>
