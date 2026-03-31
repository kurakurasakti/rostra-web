import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sizeSchema } from "@/lib/schemas"
import { ProductSize } from "@/types/database"

export async function GET(request: NextRequest): Promise<NextResponse<ProductSize[] | { error: string }>> {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const variantId = searchParams.get("variant_id")

    let query = supabase
      .from("product_sizes")
      .select("*, product_variants(*, products(*))")
      .order("created_at", { ascending: false })

    if (variantId) {
      query = query.eq("variant_id", variantId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching sizes:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch sizes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ProductSize | { error: string; details?: any }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("is_active")
      .eq("id", user.id)
      .single()

    if (!adminData?.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = sizeSchema.parse(body)

    const { data: size, error: sizeError } = await supabase
      .from("product_sizes")
      .insert({
        product_id: validatedData.product_id,
        variant_id: validatedData.variant_id,
        name: validatedData.name,
        volume_gr: validatedData.volume_gr,
        price_modifier: validatedData.price_modifier,
        stock_quantity: validatedData.stock_quantity ?? 0,
        sku: validatedData.sku || null,
      })
      .select()
      .single()

    if (sizeError) throw sizeError

    return NextResponse.json(size, { status: 201 })
  } catch (error: any) {
    console.error("Error creating size:", error)
    if (error.errors) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to create size" },
      { status: 500 }
    )
  }
}
