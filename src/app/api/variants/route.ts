import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { variantSchema } from "@/lib/schemas/product.schema"
import { z } from "zod"

const createVariantSchema = variantSchema.extend({
    product_id: z.string().uuid("Invalid product_id format"),
})

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get("product_id")

        let query = supabase
            .from("product_variants")
            .select(`
                *,
                product_sizes (*)
            `)
            .order("sort_order", { ascending: true })

        if (productId) {
            query = query.eq("product_id", productId)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error("Error fetching variants:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch variants" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
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
        const validatedData = createVariantSchema.parse(body)

        const { data: product } = await supabase
            .from("products")
            .select("id")
            .eq("id", validatedData.product_id)
            .single()

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        const { data: variant, error: variantError } = await supabase
            .from("product_variants")
            .insert({
                product_id: validatedData.product_id,
                name: validatedData.name,
                description: validatedData.description || null,
                sort_order: validatedData.sort_order || 0,
            })
            .select()
            .single()

        if (variantError) throw variantError

        if (validatedData.prices && validatedData.prices.length > 0) {
            const sizePromises = validatedData.prices.map((price) =>
                supabase.from("product_sizes").insert({
                    product_id: validatedData.product_id,
                    variant_id: variant.id,
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
            .eq("id", variant.id)
            .single()

        return NextResponse.json(fullVariant, { status: 201 })
    } catch (error: any) {
        console.error("Error creating variant:", error)
        if (error.errors) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: error.message || "Failed to create variant" },
            { status: 500 }
        )
    }
}
