"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types/product"
import { getProducts } from "@/app/actions/products"
import { ProductCard } from "@/components/product-card"
import { CategoryTabs } from "@/components/category-tabs"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { formatIDRCompact } from "@/lib/utils/currency"

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<"semua" | "makanan" | "minuman">("semua")
  const [isLoading, setIsLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const { items, addItem, totalAmount, totalItems } = useCart()

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

  const handleAddToCart = (product: Product, quantity = 1) => {
    addItem(product, quantity)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Warung Makan</h1>
              <p className="text-sm text-gray-500">Pesan makanan & minuman favorit Anda</p>
            </div>
            {/* Desktop Cart Button */}
            <Button
              onClick={() => setCartOpen(true)}
              className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-white gap-2"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Keranjang</span>
              {totalItems > 0 && <Badge className="bg-white text-amber-600 ml-1">{totalItems}</Badge>}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Category Filter */}
        <div className="mb-6">
          <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <Button
            onClick={() => setCartOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="flex-1 text-left">Keranjang ({totalItems})</span>
            <span className="font-bold">{formatIDRCompact(totalAmount)}</span>
          </Button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
