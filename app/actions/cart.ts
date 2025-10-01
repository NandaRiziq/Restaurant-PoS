"use server"

import { createClient } from "@/lib/supabase/server"
import type { CartItem } from "@/lib/types/product"

export async function getCartItems(sessionId: string): Promise<CartItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("session_id", sessionId)

  if (error) {
    console.error("[v0] Error fetching cart items:", error)
    return []
  }

  return data || []
}

export async function addToCart(sessionId: string, productId: string, quantity = 1) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("session_id", sessionId)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq("id", existing.id)

    if (error) {
      console.error("[v0] Error updating cart item:", error)
      return { success: false, error: error.message }
    }
  } else {
    // Insert new item
    const { error } = await supabase.from("cart_items").insert({
      session_id: sessionId,
      product_id: productId,
      quantity,
    })

    if (error) {
      console.error("[v0] Error adding to cart:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createClient()

  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", itemId)

  if (error) {
    console.error("[v0] Error updating cart item quantity:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

  if (error) {
    console.error("[v0] Error removing from cart:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function clearCart(sessionId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("cart_items").delete().eq("session_id", sessionId)

  if (error) {
    console.error("[v0] Error clearing cart:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
