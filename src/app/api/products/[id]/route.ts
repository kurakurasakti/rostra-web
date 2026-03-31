import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { productSchema } from "@/lib/schemas"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_variants (
          *,
          product_sizes (*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify admin auth
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
    const validatedData = productSchema.parse(body)

    // Update product
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: validatedData.name,
        description: validatedData.description || null,
        category: validatedData.category || "coffee",
        is_available: validatedData.is_available ?? true,
        image_url: validatedData.image_url || null,
        metadata: validatedData.metadata || {},
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    // Delete existing variants and sizes (cascade will handle sizes)
    const { error: deleteVariantError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id)

    if (deleteVariantError) throw deleteVariantError

    // Create new variants and sizes
    if (validatedData.variants && validatedData.variants.length > 0) {
      const variantPromises = validatedData.variants.map(async (variant) => {
        const { data: variantData, error: variantError } = await supabase
          .from("product_variants")
          .insert({
            product_id: id,
            name: variant.name,
            description: variant.description || null,
            sort_order: variant.sort_order || 0,
          })
          .select()
          .single()

        if (variantError) throw variantError

        if (variant.prices && variant.prices.length > 0) {
          const sizePromises = variant.prices.map((price) =>
            supabase.from("product_sizes").insert({
              product_id: id,
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

    // Fetch updated product
    const { data: fullProduct } = await supabase
      .from("products")
      .select(`
        *,
        product_variants (
          *,
          product_sizes (*)
        )
      `)
      .eq("id", id)
      .single()

    return NextResponse.json(fullProduct, { status: 200 })
  } catch (error: any) {
    console.error("Error updating product:", error)
    if (error.errors) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify admin auth
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

    // Delete product (cascade will delete variants and sizes)
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    )
  }
}
