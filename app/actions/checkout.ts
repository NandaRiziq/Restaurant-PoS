"use server"

import { createClient } from "@/lib/supabase/server"
import type { Order, OrderItem } from "@/lib/types/order"

export async function createOrder(data: {
  sessionId: string
  customerName: string
  customerPhone?: string
  tableNumber: number
  totalAmount: number
  items: Array<{
    productId: string
    productName: string
    productPrice: number
    quantity: number
  }>
}) {
  const supabase = await createClient()

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        session_id: data.sessionId,
        customer_name: data.customerName,
        customer_phone: data.customerPhone || null,
        table_number: data.tableNumber,
        total_amount: data.totalAmount,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      throw orderError
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_price: item.productPrice,
      quantity: item.quantity,
      subtotal: item.productPrice * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      throw itemsError
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan" }
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

  if (error) {
    console.error("[v0] Error fetching order:", error)
    return null
  }

  return data
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId)

  if (error) {
    console.error("[v0] Error fetching order items:", error)
    return []
  }

  return data || []
}

export async function updateOrderPayment(orderId: string, paymentReference: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_method: "xendit",
      payment_reference: paymentReference,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("[v0] Error updating order payment:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
