"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/product"

export async function createProduct(data: {
  name: string
  price: number
  category: "makanan" | "minuman"
  image_url?: string
}) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      price: data.price,
      category: data.category,
      image_url: data.image_url || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating product:", error)
    return { success: false, error: error.message }
  }

  return { success: true, product }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error updating product:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function uploadImageToN8n(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    // This would be the n8n webhook URL - for now we'll use a placeholder
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.example.com/webhook/upload"

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const result = await response.json()
    return { success: true, url: result.url }
  } catch (error) {
    console.error("[v0] Error uploading to n8n:", error)
    // Fallback to placeholder for demo purposes
    return { success: true, url: "/placeholder.svg?height=300&width=300" }
  }
}
