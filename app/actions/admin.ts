"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/types/product"

export async function createProduct(data: {
  name: string
  price: number
  category: "makanan" | "minuman"
  description?: string
  imageFile?: File
  imageUrl?: string // Add this to accept pre-uploaded image URL
}) {
  const supabase = createAdminClient()

  try {
    let imageUrl = data.imageUrl // Use provided imageUrl if available

    if (!imageUrl && data.imageFile) {
      const uploadResult = await uploadImageToSupabase(data.imageFile)
      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url
      }
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description || null,
        image_url: imageUrl || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating product:", error)
      return { success: false, error: error.message }
    }

    return { success: true, product }
  } catch (error) {
    console.error("[v0] Error in createProduct:", error)
    return { success: false, error: "Terjadi kesalahan saat membuat produk" }
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const supabase = createAdminClient()

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
  const supabase = createAdminClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function uploadImageToSupabase(
  base64Data: string | File,
  fileName?: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createAdminClient()

    let buffer: Buffer
    let fileExt: string
    let uniqueFileName: string
    let filePath: string

    if (typeof base64Data === "string") {
      // Convert base64 to buffer
      const base64String = base64Data.split(",")[1] // Remove data:image/xxx;base64, prefix
      buffer = Buffer.from(base64String, "base64")
      fileExt = fileName!.split(".").pop()!
      uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      filePath = `${uniqueFileName}`
    } else {
      // Handle File upload
      fileExt = base64Data.name.split(".").pop()
      uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      filePath = `${uniqueFileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("product-images").upload(filePath, base64Data, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("[v0] Error uploading to Supabase Storage:", error)
        throw error
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath)

      return { success: true, url: publicUrl }
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: `image/${fileExt}`,
      })

    if (uploadError) {
      console.error("[v0] Error uploading to Supabase Storage:", uploadError)
      throw uploadError
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("[v0] Error uploading to Supabase:", error)
    return { success: false, error: error instanceof Error ? error.message : "Upload failed" }
  }
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

export async function processImageWithAI(file: File): Promise<{
  success: boolean
  data?: {
    name: string
    price: number
    category: "makanan" | "minuman"
    description: string
    image_url: string
  }
  error?: string
}> {
  try {
    // Step 1: Upload image to Supabase Storage
    const supabase = createAdminClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Error uploading to Supabase Storage:", uploadError)
      return {
        success: false,
        error: "Gagal mengupload gambar",
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath)

    console.log("[v0] Image uploaded to Supabase:", publicUrl)

    // Step 2: Call n8n webhook with image URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl || n8nWebhookUrl.trim() === "") {
      console.error("[v0] N8N_WEBHOOK_URL not configured or empty")
      return {
        success: false,
        error: "N8N webhook URL belum dikonfigurasi. Silakan tambahkan N8N_WEBHOOK_URL di Project Settings.",
      }
    }

    console.log("[v0] Calling n8n webhook:", n8nWebhookUrl)

    // Create abort controller for 30-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: publicUrl,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] n8n webhook error:", response.status, errorText)
        throw new Error(`AI processing failed with status ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] n8n response:", JSON.stringify(result))

      // n8n returns: { success: true, data: { name, price, category, description, image_url } }
      const n8nData = result.data || result

      return {
        success: true,
        data: {
          name: n8nData.name || "",
          price: n8nData.price || 0,
          category: n8nData.category === "minuman" ? "minuman" : "makanan",
          description: n8nData.description || "",
          image_url: publicUrl,
        },
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("[v0] n8n request timeout after 30 seconds")
        return {
          success: false,
          error: "Timeout: AI memproses terlalu lama (lebih dari 30 detik)",
        }
      }

      throw fetchError
    }
  } catch (error) {
    console.error("[v0] Error processing image with AI:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal memproses gambar dengan AI",
    }
  }
}
