"use client"

import type { CartItem } from "@/lib/types/product"
import { formatIDRCompact } from "@/lib/utils/currency"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart()

  if (!item.product) return null

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      removeItem(item.id)
    }
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  const subtotal = item.product.price * item.quantity

  return (
    <div className="flex gap-4 bg-white rounded-lg border border-gray-200 p-3">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
        <Image
          src={item.product.image_url || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.product.name}</h4>
            <p className="text-sm text-amber-600 font-semibold mt-1">{formatIDRCompact(item.product.price)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              className="h-7 w-7 rounded-full bg-transparent"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-7 w-7 rounded-full bg-transparent"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-sm font-bold text-gray-900">{formatIDRCompact(subtotal)}</span>
        </div>
      </div>
    </div>
  )
}
