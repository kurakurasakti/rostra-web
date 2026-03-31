import ProductTable from "@/components/admin/ProductTable"

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your coffee products, variants, and pricing.</p>
      </div>
      <ProductTable />
    </div>
  )
}
