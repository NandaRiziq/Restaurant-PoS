export interface Product {
  id: string
  name: string
  price: number
  category: "makanan" | "minuman"
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  session_id: string
  product_id: string
  quantity: number
  product?: Product
}
