export interface Order {
  id: string
  session_id: string
  customer_name: string
  customer_phone?: string // Made optional to match database schema
  table_number: number // Replaced customer_address with table_number
  total_amount: number
  status: "pending" | "paid" | "cancelled"
  payment_method?: string
  payment_reference?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  created_at: string
}
