import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sizeSchema, sizeUpdateSchema } from "@/lib/schemas"
import { ProductSize } from "@/types/database"

async function verifyAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null }
  }

  const { data: adminData } = await supabase
    .from("admin_users")
    .select("is_active")
    .eq("id", user.id)
    .single()

  if (!adminData?.is_active) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), user: null }
  }

  return { error: null, user }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ProductSize | { error: string }>> {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("product_sizes")
      .select("*, product_variants(*, products(*))")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Size not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching size:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch size" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ProductSize | { error: string; details?: any }>> {
  try {
    const { id } = await params
    const supabase = await createClient()

    const adminCheck = await verifyAdmin(supabase)
    if (adminCheck.error) return adminCheck.error

    const body = await request.json()
    const validatedData = sizeUpdateSchema.parse(body)

    const { data: existingSize } = await supabase
      .from("product_sizes")
      .select("id")
      .eq("id", id)
      .single()

    if (!existingSize) {
      return NextResponse.json({ error: "Size not found" }, { status: 404 })
    }

    const updateData: Partial<{
      name: string;
      volume_gr: number;
      price_modifier: number;
      stock_quantity: number;
      sku: string | null;
    }> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.volume_gr !== undefined) updateData.volume_gr = validatedData.volume_gr
    if (validatedData.price_modifier !== undefined) updateData.price_modifier = validatedData.price_modifier
    if (validatedData.stock_quantity !== undefined) updateData.stock_quantity = validatedData.stock_quantity
    if (validatedData.sku !== undefined) updateData.sku = validatedData.sku

    const { data: updatedSize, error: updateError } = await supabase
      .from("product_sizes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(updatedSize, { status: 200 })
  } catch (error: any) {
    console.error("Error updating size:", error)
    if (error.errors) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to update size" },
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

    const adminCheck = await verifyAdmin(supabase)
    if (adminCheck.error) return adminCheck.error

    const { data: existingSize } = await supabase
      .from("product_sizes")
      .select("id")
      .eq("id", id)
      .single()

    if (!existingSize) {
      return NextResponse.json({ error: "Size not found" }, { status: 404 })
    }

    const { error } = await supabase
      .from("product_sizes")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true, message: "Size deleted" }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting size:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete size" },
      { status: 500 }
    )
  }
}
