"use client"

import type { Product } from "@/lib/types/product"
import { formatIDRCompact } from "@/lib/utils/currency"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { ProductDetailModal } from "./product-detail-modal"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <>
      <Card className="group overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-gray-50 cursor-pointer" onClick={() => setShowDetail(true)}>
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="cursor-pointer" onClick={() => setShowDetail(true)}>
            <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            {product.description && <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>}
            <p className="text-lg font-semibold text-amber-600 mt-1">{formatIDRCompact(product.price)}</p>
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </Button>
        </div>
      </Card>

      <ProductDetailModal product={product} open={showDetail} onOpenChange={setShowDetail} onAddToCart={onAddToCart} />
    </>
  )
}
