import ProductForm from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground">Create a new coffee product with variants and sizes.</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <ProductForm />
      </div>
    </div>
  )
}
