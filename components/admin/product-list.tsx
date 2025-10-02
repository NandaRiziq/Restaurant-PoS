"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types/product"
import { getAllProductsAdmin } from "@/app/actions/admin"
import { ProductRow } from "./product-row"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeStatus, setActiveStatus] = useState<"active" | "inactive">("active")
  const [activeCategory, setActiveCategory] = useState<"semua" | "makanan" | "minuman">("semua")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [activeCategory, activeStatus, products])

  const loadProducts = async () => {
    setIsLoading(true)
    const data = await getAllProductsAdmin()
    setProducts(data)
    setIsLoading(false)
  }

  const filterProducts = () => {
    let filtered = products.filter((p) => {
      if (activeStatus === "active") {
        return p.is_active !== false
      } else {
        return p.is_active === false
      }
    })

    // Then filter by category
    if (activeCategory !== "semua") {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }

    setFilteredProducts(filtered)
  }

  const activeProducts = products.filter((p) => p.is_active !== false)
  const inactiveProducts = products.filter((p) => p.is_active === false)

  return (
    <div className="space-y-6">
      <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as any)}>
        <TabsList>
          <TabsTrigger value="active">Aktif ({activeProducts.length})</TabsTrigger>
          <TabsTrigger value="inactive">Tidak Aktif ({inactiveProducts.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category Filter */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
        <TabsList>
          <TabsTrigger value="semua">Semua ({filteredProducts.length})</TabsTrigger>
          <TabsTrigger value="makanan">
            Makanan ({filteredProducts.filter((p) => p.category === "makanan").length})
          </TabsTrigger>
          <TabsTrigger value="minuman">
            Minuman ({filteredProducts.filter((p) => p.category === "minuman").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Product Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                {activeStatus === "active" && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visibilitas
                  </th>
                )}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={activeStatus === "active" ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                    Memuat...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={activeStatus === "active" ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada produk
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onUpdate={loadProducts}
                    showVisibility={activeStatus === "active"}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
