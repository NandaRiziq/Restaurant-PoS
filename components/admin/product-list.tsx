"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types/product"
import { getProducts } from "@/app/actions/products"
import { ProductRow } from "./product-row"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<"semua" | "makanan" | "minuman">("semua")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [activeCategory, products])

  const loadProducts = async () => {
    setIsLoading(true)
    const data = await getProducts()
    setProducts(data)
    setIsLoading(false)
  }

  const filterProducts = () => {
    if (activeCategory === "semua") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === activeCategory))
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
        <TabsList>
          <TabsTrigger value="semua">Semua ({products.length})</TabsTrigger>
          <TabsTrigger value="makanan">Makanan ({products.filter((p) => p.category === "makanan").length})</TabsTrigger>
          <TabsTrigger value="minuman">Minuman ({products.filter((p) => p.category === "minuman").length})</TabsTrigger>
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Memuat...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada produk
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <ProductRow key={product.id} product={product} onUpdate={loadProducts} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
