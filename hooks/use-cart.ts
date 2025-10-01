"use client"

import { useState, useEffect, useCallback } from "react"
import type { CartItem, Product } from "@/lib/types/product"
import { getSessionId } from "@/lib/utils/session"
import { getCartItems, addToCart, updateCartItemQuantity, removeFromCart } from "@/app/actions/cart"
import { useToast } from "@/hooks/use-toast"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadCart = useCallback(async () => {
    const sessionId = getSessionId()
    if (!sessionId) return

    setIsLoading(true)
    const cartItems = await getCartItems(sessionId)
    setItems(cartItems)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = async (product: Product, quantity = 1) => {
    const sessionId = getSessionId()
    const result = await addToCart(sessionId, product.id, quantity)

    if (result.success) {
      await loadCart()
      toast({
        title: "Ditambahkan ke keranjang",
        description: `${product.name} berhasil ditambahkan`,
      })
    } else {
      toast({
        title: "Gagal menambahkan",
        description: result.error || "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    const result = await updateCartItemQuantity(itemId, quantity)

    if (result.success) {
      await loadCart()
    } else {
      toast({
        title: "Gagal memperbarui",
        description: result.error || "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    const result = await removeFromCart(itemId)

    if (result.success) {
      await loadCart()
      toast({
        title: "Dihapus dari keranjang",
        description: "Item berhasil dihapus",
      })
    } else {
      toast({
        title: "Gagal menghapus",
        description: result.error || "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    loadCart,
    totalAmount,
    totalItems,
  }
}
