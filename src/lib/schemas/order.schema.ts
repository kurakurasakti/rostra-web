import { z } from "zod"

export const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  sizeId: z.string(),
  quantity: z.number().int().positive(),
  totalPrice: z.number(),
  productName: z.string(),
  variantName: z.string(),
  sizeName: z.string(),
  unitPrice: z.number(),
})

export const orderSchema = z.object({
  order_number: z.string(),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().optional().nullable(),
  total_amount: z.number().nonnegative(),
  status: z.enum(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]),
  items: z.array(orderItemSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Order = z.infer<typeof orderSchema>
