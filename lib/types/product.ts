export interface Product {
  id: string
  name: string
  price: number
  category: "makanan" | "minuman"
  image_url: string | null
  description: string | null
  created_at: string
  updated_at: string
  is_active?: boolean // Add is_active field for soft delete
  is_visible?: boolean // Added is_visible field for visibility toggle
}

export interface CartItem {
  id: string
  session_id: string
  product_id: string
  quantity: number
  product?: Product
}
