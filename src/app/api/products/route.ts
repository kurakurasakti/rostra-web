import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { productSchema } from "@/lib/schemas"

// For now, we'll skip authentication middleware in dev
// In production, protect with AdminGuard server-side

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Join products with variants and sizes
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

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin auth (simplified - should use proper admin check)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin status
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("is_active")
      .eq("id", user.id)
      .single()

    if (!adminData?.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Validate input
    const validatedData = productSchema.parse(body)

    // Create product in transaction
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: validatedData.name,
        description: validatedData.description || null,
        category: validatedData.category || "coffee",
        is_available: validatedData.is_available ?? true,
        image_url: validatedData.image_url || null,
        metadata: validatedData.metadata || {},
      })
      .select()
      .single()

    if (productError) throw productError

    // Create variants and sizes
    if (validatedData.variants && validatedData.variants.length > 0) {
      const variantPromises = validatedData.variants.map(async (variant) => {
        const { data: variantData, error: variantError } = await supabase
          .from("product_variants")
          .insert({
            product_id: product.id,
            name: variant.name,
            description: variant.description || null,
            sort_order: variant.sort_order || 0,
          })
          .select()
          .single()

        if (variantError) throw variantError

        // Create sizes for this variant
        if (variant.prices && variant.prices.length > 0) {
          const sizePromises = variant.prices.map((price) =>
            supabase.from("product_sizes").insert({
              product_id: product.id,
              variant_id: variantData.id,
              name: `${price.size_gr}g`,
              volume_gr: price.size_gr,
              price_modifier: price.price_modifier,
              stock_quantity: price.stock_quantity,
              sku: price.sku || null,
            })
          )

          await Promise.all(sizePromises)
        }

        return variantData
      })

      await Promise.all(variantPromises)
    }

    // Fetch the full created product with relations
    const { data: fullProduct } = await supabase
      .from("products")
      .select(`
        *,
        product_variants (
          *,
          product_sizes (*)
        )
      `)
      .eq("id", product.id)
      .single()

    return NextResponse.json(fullProduct, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    if (error.errors) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    )
  }
}
