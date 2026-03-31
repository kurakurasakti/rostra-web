import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { variantSchema } from "@/lib/schemas/product.schema"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("product_variants")
            .select(`
                *,
                product_sizes (*)
            `)
            .eq("id", id)
            .single()

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json({ error: "Variant not found" }, { status: 404 })
            }
            throw error
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error("Error fetching variant:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch variant" },
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

        const existingVariant = await supabase
            .from("product_variants")
            .select("id")
            .eq("id", id)
            .single()

        if (!existingVariant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 404 })
        }

        const body = await request.json()
        const validatedData = variantSchema.parse(body)

        const { error: updateError } = await supabase
            .from("product_variants")
            .update({
                name: validatedData.name,
                description: validatedData.description || null,
                sort_order: validatedData.sort_order || 0,
            })
            .eq("id", id)

        if (updateError) throw updateError

        const { error: deleteSizesError } = await supabase
            .from("product_sizes")
            .delete()
            .eq("variant_id", id)

        if (deleteSizesError) throw deleteSizesError

        if (validatedData.prices && validatedData.prices.length > 0) {
            const { data: variant } = await supabase
                .from("product_variants")
                .select("product_id")
                .eq("id", id)
                .single()

            const sizePromises = validatedData.prices.map((price) =>
                supabase.from("product_sizes").insert({
                    product_id: variant.product_id,
                    variant_id: id,
                    name: `${price.size_gr}g`,
                    volume_gr: price.size_gr,
                    price_modifier: price.price_modifier,
                    stock_quantity: price.stock_quantity,
                    sku: price.sku || null,
                })
            )

            await Promise.all(sizePromises)
        }

        const { data: fullVariant } = await supabase
            .from("product_variants")
            .select(`
                *,
                product_sizes (*)
            `)
            .eq("id", id)
            .single()

        return NextResponse.json(fullVariant, { status: 200 })
    } catch (error: any) {
        console.error("Error updating variant:", error)
        if (error.errors) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: error.message || "Failed to update variant" },
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

        const { error: deleteSizesError } = await supabase
            .from("product_sizes")
            .delete()
            .eq("variant_id", id)

        if (deleteSizesError) throw deleteSizesError

        const { error } = await supabase
            .from("product_variants")
            .delete()
            .eq("id", id)

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json({ error: "Variant not found" }, { status: 404 })
            }
            throw error
        }

        return NextResponse.json({ success: true, message: "Variant deleted" }, { status: 200 })
    } catch (error: any) {
        console.error("Error deleting variant:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete variant" },
            { status: 500 }
        )
    }
}
