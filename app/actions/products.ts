"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/product"

export async function getProducts(category?: "makanan" | "minuman"): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase.from("products").select("*").eq("is_active", true).eq("is_visible", true).order("name")

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .eq("is_visible", true)
    .single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }

  return data
}
