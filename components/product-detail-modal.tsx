"use client"

import type { Product } from "@/lib/types/product"
import { formatIDRCompact } from "@/lib/utils/currency"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Minus, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductDetailModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (product: Product, quantity?: number) => void
}

export function ProductDetailModal({ product, open, onOpenChange, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    onOpenChange(false)
    setQuantity(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md p-0 gap-0 max-h-[90vh] flex flex-col
          top-0 translate-y-0 left-[50%] translate-x-[-50%]
          sm:top-[50%] sm:translate-y-[-50%]
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top
          sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95
          sm:data-[state=closed]:slide-out-to-top-0 sm:data-[state=open]:slide-in-from-top-0
          duration-300"
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Product name centered */}
          <h2 className="text-xl font-semibold text-center mb-4">{product.name}</h2>

          {/* Product image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Category */}
          <p className="text-sm text-gray-600 mb-1 capitalize">{product.category}</p>

          {/* Price */}
          <p className="text-2xl font-bold text-amber-600 mb-3">{formatIDRCompact(product.price)}</p>

          {/* Description */}
          {product.description && <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>}
        </div>

        {/* Fixed bottom section with quantity and add to cart button */}
        <div className="border-t border-gray-200 p-6 space-y-4 flex-shrink-0 bg-white">
          {/* Quantity controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Jumlah</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 rounded-md"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-9 w-9 rounded-md"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-12 text-base font-medium"
          >
            Tambah ke Keranjang - {formatIDRCompact(product.price * quantity)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
