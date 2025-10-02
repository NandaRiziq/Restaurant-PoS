"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { CartItem, Product } from "@/lib/types/product"
import { getSessionId } from "@/lib/utils/session"
import { getCartItems, addToCart, updateCartItemQuantity, removeFromCart } from "@/app/actions/cart"
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addItem: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  loadCart: () => Promise<void>
  totalAmount: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadCart = useCallback(async (showLoading = true) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    if (showLoading) {
      setIsLoading(true)
    }
    const cartItems = await getCartItems(sessionId)
    setItems(cartItems)
    if (showLoading) {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = async (product: Product, quantity = 1) => {
    const sessionId = getSessionId()
    const tempId = `temp-${Date.now()}`

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product_id === product.id)

      if (existingIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        }
        return newItems
      } else {
        const newItem: CartItem = {
          id: tempId,
          session_id: sessionId,
          product_id: product.id,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product,
        }
        return [...prevItems, newItem]
      }
    })

    toast({
      title: "Ditambahkan ke keranjang",
      description: `${product.name} berhasil ditambahkan`,
      duration: 2000,
    })

    const result = await addToCart(sessionId, product.id, quantity)

    if (!result.success) {
      await loadCart(false)
      toast({
        title: "Gagal menambahkan",
        description: result.error || "Terjadi kesalahan",
        variant: "destructive",
        duration: 2000,
      })
    } else if (result.data) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === tempId
            ? {
                ...item,
                id: result.data.id,
                created_at: result.data.created_at,
                updated_at: result.data.updated_at,
              }
            : item.product_id === product.id && item.id !== tempId
              ? {
                  ...item,
                  id: result.data.id,
                  quantity: result.data.quantity,
                  updated_at: result.data.updated_at,
                }
              : item,
        ),
      )
    }
  }

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      setItems((prevItems) => {
        if (quantity <= 0) {
          return prevItems.filter((item) => item.id !== itemId)
        }
        return prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      })

      updateCartItemQuantity(itemId, quantity).then((result) => {
        if (!result.success) {
          loadCart(false)
          toast({
            title: "Gagal memperbarui",
            description: result.error || "Terjadi kesalahan",
            variant: "destructive",
            duration: 2000,
          })
        }
      })
    },
    [toast, loadCart],
  )

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

      toast({
        title: "Dihapus dari keranjang",
        description: "Item berhasil dihapus",
        duration: 2000,
      })

      removeFromCart(itemId).then((result) => {
        if (!result.success) {
          loadCart(false)
          toast({
            title: "Gagal menghapus",
            description: result.error || "Terjadi kesalahan",
            variant: "destructive",
            duration: 2000,
          })
        }
      })
    },
    [toast, loadCart],
  )

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        loadCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
