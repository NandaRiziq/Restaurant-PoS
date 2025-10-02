"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatIDRCompact } from "@/lib/utils/currency"
import { getSessionId } from "@/lib/utils/session"
import { createOrder } from "@/app/actions/checkout"
import { clearCart } from "@/app/actions/cart"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalAmount, isLoading } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push("/")
    }
  }, [items, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const sessionId = getSessionId()

      const parsedTableNumber = Number.parseInt(tableNumber)

      if (Number.isNaN(parsedTableNumber) || parsedTableNumber < 1) {
        alert("Nomor meja harus diisi dengan angka yang valid")
        setIsSubmitting(false)
        return
      }

      // Create order
      const orderResult = await createOrder({
        sessionId,
        customerName,
        customerPhone: customerPhone || undefined,
        tableNumber: parsedTableNumber,
        totalAmount,
        items: items.map((item) => ({
          productId: item.product_id,
          productName: item.product?.name || "",
          productPrice: item.product?.price || 0,
          quantity: item.quantity,
        })),
      })

      if (!orderResult.success) {
        throw new Error(orderResult.error)
      }

      // Call Xendit payment API
      const paymentResponse = await fetch("/api/xendit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderResult.orderId,
          amount: totalAmount,
          customerName,
          customerPhone,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (paymentData.success) {
        // Clear cart
        await clearCart(sessionId)

        // Redirect to order confirmation
        router.push(`/order/${orderResult.orderId}`)
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Terjadi kesalahan saat checkout. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Toko
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Customer Information Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *opsional</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="08123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tableNumber">Nomor Meja</Label>
                    <Input
                      id="tableNumber"
                      type="number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="1"
                      required
                      min="1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    size="lg"
                  >
                    {isSubmitting ? "Memproses..." : "Lanjutkan ke Pembayaran"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
                        <Image
                          src={item.product?.image_url || "/placeholder.svg"}
                          alt={item.product?.name || ""}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatIDRCompact(item.product?.price || 0)}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatIDRCompact((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatIDRCompact(totalAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">{formatIDRCompact(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
