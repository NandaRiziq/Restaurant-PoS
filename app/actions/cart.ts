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
    console.error("Error fetching cart items:", error)
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
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating cart item:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        session_id: sessionId,
        product_id: productId,
        quantity,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding to cart:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (itemId.startsWith("temp-")) {
    // Temporary item not yet in database, skip database operation
    return { success: true }
  }

  const supabase = await createClient()

  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", itemId)

  if (error) {
    console.error("Error updating cart item quantity:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function removeFromCart(itemId: string) {
  if (itemId.startsWith("temp-")) {
    // Temporary item not yet in database, skip database operation
    return { success: true }
  }

  const supabase = await createClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

  if (error) {
    console.error("Error removing from cart:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function clearCart(sessionId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("cart_items").delete().eq("session_id", sessionId)

  if (error) {
    console.error("Error clearing cart:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
